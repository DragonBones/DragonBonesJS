"use strict";
var constants = require("@pixi/constants"), extensions = require("@pixi/extensions"), math = require("@pixi/math"), RenderTexturePool = require("../renderTexture/RenderTexturePool.js"), UniformGroup = require("../shader/UniformGroup.js"), Quad = require("../utils/Quad.js"), QuadUv = require("../utils/QuadUv.js"), FilterState = require("./FilterState.js");
const tempPoints = [new math.Point(), new math.Point(), new math.Point(), new math.Point()], tempMatrix = new math.Matrix();
class FilterSystem {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(renderer) {
    this.renderer = renderer, this.defaultFilterStack = [{}], this.texturePool = new RenderTexturePool.RenderTexturePool(), this.statePool = [], this.quad = new Quad.Quad(), this.quadUv = new QuadUv.QuadUv(), this.tempRect = new math.Rectangle(), this.activeState = {}, this.globalUniforms = new UniformGroup.UniformGroup({
      outputFrame: new math.Rectangle(),
      inputSize: new Float32Array(4),
      inputPixel: new Float32Array(4),
      inputClamp: new Float32Array(4),
      resolution: 1,
      // legacy variables
      filterArea: new Float32Array(4),
      filterClamp: new Float32Array(4)
    }, !0), this.forceClear = !1, this.useMaxPadding = !1;
  }
  init() {
    this.texturePool.setScreenSize(this.renderer.view);
  }
  /**
   * Pushes a set of filters to be applied later to the system. This will redirect further rendering into an
   * input render-texture for the rest of the filtering pipeline.
   * @param {PIXI.DisplayObject} target - The target of the filter to render.
   * @param filters - The filters to apply.
   */
  push(target, filters) {
    const renderer = this.renderer, filterStack = this.defaultFilterStack, state = this.statePool.pop() || new FilterState.FilterState(), renderTextureSystem = renderer.renderTexture;
    let currentResolution, currentMultisample;
    if (renderTextureSystem.current) {
      const renderTexture = renderTextureSystem.current;
      currentResolution = renderTexture.resolution, currentMultisample = renderTexture.multisample;
    } else
      currentResolution = renderer.resolution, currentMultisample = renderer.multisample;
    let resolution = filters[0].resolution || currentResolution, multisample = filters[0].multisample ?? currentMultisample, padding = filters[0].padding, autoFit = filters[0].autoFit, legacy = filters[0].legacy ?? !0;
    for (let i = 1; i < filters.length; i++) {
      const filter = filters[i];
      resolution = Math.min(resolution, filter.resolution || currentResolution), multisample = Math.min(multisample, filter.multisample ?? currentMultisample), padding = this.useMaxPadding ? Math.max(padding, filter.padding) : padding + filter.padding, autoFit = autoFit && filter.autoFit, legacy = legacy || (filter.legacy ?? !0);
    }
    filterStack.length === 1 && (this.defaultFilterStack[0].renderTexture = renderTextureSystem.current), filterStack.push(state), state.resolution = resolution, state.multisample = multisample, state.legacy = legacy, state.target = target, state.sourceFrame.copyFrom(target.filterArea || target.getBounds(!0)), state.sourceFrame.pad(padding);
    const sourceFrameProjected = this.tempRect.copyFrom(renderTextureSystem.sourceFrame);
    renderer.projection.transform && this.transformAABB(
      tempMatrix.copyFrom(renderer.projection.transform).invert(),
      sourceFrameProjected
    ), autoFit ? (state.sourceFrame.fit(sourceFrameProjected), (state.sourceFrame.width <= 0 || state.sourceFrame.height <= 0) && (state.sourceFrame.width = 0, state.sourceFrame.height = 0)) : state.sourceFrame.intersects(sourceFrameProjected) || (state.sourceFrame.width = 0, state.sourceFrame.height = 0), this.roundFrame(
      state.sourceFrame,
      renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution,
      renderTextureSystem.sourceFrame,
      renderTextureSystem.destinationFrame,
      renderer.projection.transform
    ), state.renderTexture = this.getOptimalFilterTexture(
      state.sourceFrame.width,
      state.sourceFrame.height,
      resolution,
      multisample
    ), state.filters = filters, state.destinationFrame.width = state.renderTexture.width, state.destinationFrame.height = state.renderTexture.height;
    const destinationFrame = this.tempRect;
    destinationFrame.x = 0, destinationFrame.y = 0, destinationFrame.width = state.sourceFrame.width, destinationFrame.height = state.sourceFrame.height, state.renderTexture.filterFrame = state.sourceFrame, state.bindingSourceFrame.copyFrom(renderTextureSystem.sourceFrame), state.bindingDestinationFrame.copyFrom(renderTextureSystem.destinationFrame), state.transform = renderer.projection.transform, renderer.projection.transform = null, renderTextureSystem.bind(state.renderTexture, state.sourceFrame, destinationFrame), renderer.framebuffer.clear(0, 0, 0, 0);
  }
  /** Pops off the filter and applies it. */
  pop() {
    const filterStack = this.defaultFilterStack, state = filterStack.pop(), filters = state.filters;
    this.activeState = state;
    const globalUniforms = this.globalUniforms.uniforms;
    globalUniforms.outputFrame = state.sourceFrame, globalUniforms.resolution = state.resolution;
    const inputSize = globalUniforms.inputSize, inputPixel = globalUniforms.inputPixel, inputClamp = globalUniforms.inputClamp;
    if (inputSize[0] = state.destinationFrame.width, inputSize[1] = state.destinationFrame.height, inputSize[2] = 1 / inputSize[0], inputSize[3] = 1 / inputSize[1], inputPixel[0] = Math.round(inputSize[0] * state.resolution), inputPixel[1] = Math.round(inputSize[1] * state.resolution), inputPixel[2] = 1 / inputPixel[0], inputPixel[3] = 1 / inputPixel[1], inputClamp[0] = 0.5 * inputPixel[2], inputClamp[1] = 0.5 * inputPixel[3], inputClamp[2] = state.sourceFrame.width * inputSize[2] - 0.5 * inputPixel[2], inputClamp[3] = state.sourceFrame.height * inputSize[3] - 0.5 * inputPixel[3], state.legacy) {
      const filterArea = globalUniforms.filterArea;
      filterArea[0] = state.destinationFrame.width, filterArea[1] = state.destinationFrame.height, filterArea[2] = state.sourceFrame.x, filterArea[3] = state.sourceFrame.y, globalUniforms.filterClamp = globalUniforms.inputClamp;
    }
    this.globalUniforms.update();
    const lastState = filterStack[filterStack.length - 1];
    if (this.renderer.framebuffer.blit(), filters.length === 1)
      filters[0].apply(this, state.renderTexture, lastState.renderTexture, constants.CLEAR_MODES.BLEND, state), this.returnFilterTexture(state.renderTexture);
    else {
      let flip = state.renderTexture, flop = this.getOptimalFilterTexture(
        flip.width,
        flip.height,
        state.resolution
      );
      flop.filterFrame = flip.filterFrame;
      let i = 0;
      for (i = 0; i < filters.length - 1; ++i) {
        i === 1 && state.multisample > 1 && (flop = this.getOptimalFilterTexture(
          flip.width,
          flip.height,
          state.resolution
        ), flop.filterFrame = flip.filterFrame), filters[i].apply(this, flip, flop, constants.CLEAR_MODES.CLEAR, state);
        const t = flip;
        flip = flop, flop = t;
      }
      filters[i].apply(this, flip, lastState.renderTexture, constants.CLEAR_MODES.BLEND, state), i > 1 && state.multisample > 1 && this.returnFilterTexture(state.renderTexture), this.returnFilterTexture(flip), this.returnFilterTexture(flop);
    }
    state.clear(), this.statePool.push(state);
  }
  /**
   * Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.
   * @param filterTexture - renderTexture to bind, should belong to filter pool or filter stack
   * @param clearMode - clearMode, by default its CLEAR/YES. See {@link PIXI.CLEAR_MODES}
   */
  bindAndClear(filterTexture, clearMode = constants.CLEAR_MODES.CLEAR) {
    const {
      renderTexture: renderTextureSystem,
      state: stateSystem
    } = this.renderer;
    if (filterTexture === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, filterTexture?.filterFrame) {
      const destinationFrame = this.tempRect;
      destinationFrame.x = 0, destinationFrame.y = 0, destinationFrame.width = filterTexture.filterFrame.width, destinationFrame.height = filterTexture.filterFrame.height, renderTextureSystem.bind(filterTexture, filterTexture.filterFrame, destinationFrame);
    } else
      filterTexture !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? renderTextureSystem.bind(filterTexture) : this.renderer.renderTexture.bind(
        filterTexture,
        this.activeState.bindingSourceFrame,
        this.activeState.bindingDestinationFrame
      );
    const autoClear = stateSystem.stateId & 1 || this.forceClear;
    (clearMode === constants.CLEAR_MODES.CLEAR || clearMode === constants.CLEAR_MODES.BLIT && autoClear) && this.renderer.framebuffer.clear(0, 0, 0, 0);
  }
  /**
   * Draws a filter using the default rendering process.
   *
   * This should be called only by {@link PIXI.Filter#apply}.
   * @param filter - The filter to draw.
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  applyFilter(filter, input, output, clearMode) {
    const renderer = this.renderer;
    renderer.state.set(filter.state), this.bindAndClear(output, clearMode), filter.uniforms.uSampler = input, filter.uniforms.filterGlobals = this.globalUniforms, renderer.shader.bind(filter), filter.legacy = !!filter.program.attributeData.aTextureCoord, filter.legacy ? (this.quadUv.map(input._frame, input.filterFrame), renderer.geometry.bind(this.quadUv), renderer.geometry.draw(constants.DRAW_MODES.TRIANGLES)) : (renderer.geometry.bind(this.quad), renderer.geometry.draw(constants.DRAW_MODES.TRIANGLE_STRIP));
  }
  /**
   * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
   *
   * Use `outputMatrix * vTextureCoord` in the shader.
   * @param outputMatrix - The matrix to output to.
   * @param {PIXI.Sprite} sprite - The sprite to map to.
   * @returns The mapped matrix.
   */
  calculateSpriteMatrix(outputMatrix, sprite) {
    const { sourceFrame, destinationFrame } = this.activeState, { orig } = sprite._texture, mappedMatrix = outputMatrix.set(
      destinationFrame.width,
      0,
      0,
      destinationFrame.height,
      sourceFrame.x,
      sourceFrame.y
    ), worldTransform = sprite.worldTransform.copyTo(math.Matrix.TEMP_MATRIX);
    return worldTransform.invert(), mappedMatrix.prepend(worldTransform), mappedMatrix.scale(1 / orig.width, 1 / orig.height), mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y), mappedMatrix;
  }
  /** Destroys this Filter System. */
  destroy() {
    this.renderer = null, this.texturePool.clear(!1);
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture in real pixels.
   * @param minHeight - The minimum height of the render texture in real pixels.
   * @param resolution - The resolution of the render texture.
   * @param multisample - Number of samples of the render texture.
   * @returns - The new render texture.
   */
  getOptimalFilterTexture(minWidth, minHeight, resolution = 1, multisample = constants.MSAA_QUALITY.NONE) {
    return this.texturePool.getOptimalTexture(minWidth, minHeight, resolution, multisample);
  }
  /**
   * Gets extra render texture to use inside current filter
   * To be compliant with older filters, you can use params in any order
   * @param input - renderTexture from which size and resolution will be copied
   * @param resolution - override resolution of the renderTexture
   * @param multisample - number of samples of the renderTexture
   */
  getFilterTexture(input, resolution, multisample) {
    if (typeof input == "number") {
      const swap = input;
      input = resolution, resolution = swap;
    }
    input = input || this.activeState.renderTexture;
    const filterTexture = this.texturePool.getOptimalTexture(
      input.width,
      input.height,
      resolution || input.resolution,
      multisample || constants.MSAA_QUALITY.NONE
    );
    return filterTexture.filterFrame = input.filterFrame, filterTexture;
  }
  /**
   * Frees a render texture back into the pool.
   * @param renderTexture - The renderTarget to free
   */
  returnFilterTexture(renderTexture) {
    this.texturePool.returnTexture(renderTexture);
  }
  /** Empties the texture pool. */
  emptyPool() {
    this.texturePool.clear(!0);
  }
  /** Calls `texturePool.resize()`, affects fullScreen renderTextures. */
  resize() {
    this.texturePool.setScreenSize(this.renderer.view);
  }
  /**
   * @param matrix - first param
   * @param rect - second param
   */
  transformAABB(matrix, rect) {
    const lt = tempPoints[0], lb = tempPoints[1], rt = tempPoints[2], rb = tempPoints[3];
    lt.set(rect.left, rect.top), lb.set(rect.left, rect.bottom), rt.set(rect.right, rect.top), rb.set(rect.right, rect.bottom), matrix.apply(lt, lt), matrix.apply(lb, lb), matrix.apply(rt, rt), matrix.apply(rb, rb);
    const x0 = Math.min(lt.x, lb.x, rt.x, rb.x), y0 = Math.min(lt.y, lb.y, rt.y, rb.y), x1 = Math.max(lt.x, lb.x, rt.x, rb.x), y1 = Math.max(lt.y, lb.y, rt.y, rb.y);
    rect.x = x0, rect.y = y0, rect.width = x1 - x0, rect.height = y1 - y0;
  }
  roundFrame(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
    if (!(frame.width <= 0 || frame.height <= 0 || bindingSourceFrame.width <= 0 || bindingSourceFrame.height <= 0)) {
      if (transform) {
        const { a, b, c, d } = transform;
        if ((Math.abs(b) > 1e-4 || Math.abs(c) > 1e-4) && (Math.abs(a) > 1e-4 || Math.abs(d) > 1e-4))
          return;
      }
      transform = transform ? tempMatrix.copyFrom(transform) : tempMatrix.identity(), transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(
        bindingDestinationFrame.width / bindingSourceFrame.width,
        bindingDestinationFrame.height / bindingSourceFrame.height
      ).translate(bindingDestinationFrame.x, bindingDestinationFrame.y), this.transformAABB(transform, frame), frame.ceil(resolution), this.transformAABB(transform.invert(), frame);
    }
  }
}
FilterSystem.extension = {
  type: extensions.ExtensionType.RendererSystem,
  name: "filter"
};
extensions.extensions.add(FilterSystem);
exports.FilterSystem = FilterSystem;
//# sourceMappingURL=FilterSystem.js.map
