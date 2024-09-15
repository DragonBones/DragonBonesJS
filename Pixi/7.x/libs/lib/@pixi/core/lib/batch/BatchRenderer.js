"use strict";
var color = require("@pixi/color"), constants = require("@pixi/constants"), extensions = require("@pixi/extensions"), settings = require("@pixi/settings"), utils = require("@pixi/utils"), ViewableBuffer = require("../geometry/ViewableBuffer.js"), checkMaxIfStatementsInShader = require("../shader/utils/checkMaxIfStatementsInShader.js"), State = require("../state/State.js"), BaseTexture = require("../textures/BaseTexture.js"), BatchDrawCall = require("./BatchDrawCall.js"), BatchGeometry = require("./BatchGeometry.js"), BatchShaderGenerator = require("./BatchShaderGenerator.js"), BatchTextureArray = require("./BatchTextureArray.js"), canUploadSameBuffer = require("./canUploadSameBuffer.js"), maxRecommendedTextures = require("./maxRecommendedTextures.js"), ObjectRenderer = require("./ObjectRenderer.js"), texture$1 = require("./texture.frag.js"), texture = require("./texture.vert.js");
const _BatchRenderer = class _BatchRenderer2 extends ObjectRenderer.ObjectRenderer {
  /**
   * This will hook onto the renderer's `contextChange`
   * and `prerender` signals.
   * @param {PIXI.Renderer} renderer - The renderer this works for.
   */
  constructor(renderer) {
    super(renderer), this.setShaderGenerator(), this.geometryClass = BatchGeometry.BatchGeometry, this.vertexSize = 6, this.state = State.State.for2d(), this.size = _BatchRenderer2.defaultBatchSize * 4, this._vertexCount = 0, this._indexCount = 0, this._bufferedElements = [], this._bufferedTextures = [], this._bufferSize = 0, this._shader = null, this._packedGeometries = [], this._packedGeometryPoolSize = 2, this._flushId = 0, this._aBuffers = {}, this._iBuffers = {}, this.maxTextures = 1, this.renderer.on("prerender", this.onPrerender, this), renderer.runners.contextChange.add(this), this._dcIndex = 0, this._aIndex = 0, this._iIndex = 0, this._attributeBuffer = null, this._indexBuffer = null, this._tempBoundTextures = [];
  }
  /**
   * The maximum textures that this device supports.
   * @static
   * @default 32
   */
  static get defaultMaxTextures() {
    return this._defaultMaxTextures = this._defaultMaxTextures ?? maxRecommendedTextures.maxRecommendedTextures(32), this._defaultMaxTextures;
  }
  static set defaultMaxTextures(value) {
    this._defaultMaxTextures = value;
  }
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   */
  static get canUploadSameBuffer() {
    return this._canUploadSameBuffer = this._canUploadSameBuffer ?? canUploadSameBuffer.canUploadSameBuffer(), this._canUploadSameBuffer;
  }
  static set canUploadSameBuffer(value) {
    this._canUploadSameBuffer = value;
  }
  /**
   * @see PIXI.BatchRenderer#maxTextures
   * @deprecated since 7.1.0
   * @readonly
   */
  get MAX_TEXTURES() {
    return utils.deprecation("7.1.0", "BatchRenderer#MAX_TEXTURES renamed to BatchRenderer#maxTextures"), this.maxTextures;
  }
  /**
   * The default vertex shader source
   * @readonly
   */
  static get defaultVertexSrc() {
    return texture.default;
  }
  /**
   * The default fragment shader source
   * @readonly
   */
  static get defaultFragmentTemplate() {
    return texture$1.default;
  }
  /**
   * Set the shader generator.
   * @param {object} [options]
   * @param {string} [options.vertex=PIXI.BatchRenderer.defaultVertexSrc] - Vertex shader source
   * @param {string} [options.fragment=PIXI.BatchRenderer.defaultFragmentTemplate] - Fragment shader template
   */
  setShaderGenerator({
    vertex = _BatchRenderer2.defaultVertexSrc,
    fragment = _BatchRenderer2.defaultFragmentTemplate
  } = {}) {
    this.shaderGenerator = new BatchShaderGenerator.BatchShaderGenerator(vertex, fragment);
  }
  /**
   * Handles the `contextChange` signal.
   *
   * It calculates `this.maxTextures` and allocating the packed-geometry object pool.
   */
  contextChange() {
    const gl = this.renderer.gl;
    settings.settings.PREFER_ENV === constants.ENV.WEBGL_LEGACY ? this.maxTextures = 1 : (this.maxTextures = Math.min(
      gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      _BatchRenderer2.defaultMaxTextures
    ), this.maxTextures = checkMaxIfStatementsInShader.checkMaxIfStatementsInShader(
      this.maxTextures,
      gl
    )), this._shader = this.shaderGenerator.generateShader(this.maxTextures);
    for (let i = 0; i < this._packedGeometryPoolSize; i++)
      this._packedGeometries[i] = new this.geometryClass();
    this.initFlushBuffers();
  }
  /** Makes sure that static and dynamic flush pooled objects have correct dimensions. */
  initFlushBuffers() {
    const {
      _drawCallPool,
      _textureArrayPool
    } = _BatchRenderer2, MAX_SPRITES = this.size / 4, MAX_TA = Math.floor(MAX_SPRITES / this.maxTextures) + 1;
    for (; _drawCallPool.length < MAX_SPRITES; )
      _drawCallPool.push(new BatchDrawCall.BatchDrawCall());
    for (; _textureArrayPool.length < MAX_TA; )
      _textureArrayPool.push(new BatchTextureArray.BatchTextureArray());
    for (let i = 0; i < this.maxTextures; i++)
      this._tempBoundTextures[i] = null;
  }
  /** Handles the `prerender` signal. It ensures that flushes start from the first geometry object again. */
  onPrerender() {
    this._flushId = 0;
  }
  /**
   * Buffers the "batchable" object. It need not be rendered immediately.
   * @param {PIXI.DisplayObject} element - the element to render when
   *    using this renderer
   */
  render(element) {
    element._texture.valid && (this._vertexCount + element.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += element.vertexData.length / 2, this._indexCount += element.indices.length, this._bufferedTextures[this._bufferSize] = element._texture.baseTexture, this._bufferedElements[this._bufferSize++] = element);
  }
  buildTexturesAndDrawCalls() {
    const {
      _bufferedTextures: textures,
      maxTextures
    } = this, textureArrays = _BatchRenderer2._textureArrayPool, batch = this.renderer.batch, boundTextures = this._tempBoundTextures, touch = this.renderer.textureGC.count;
    let TICK = ++BaseTexture.BaseTexture._globalBatch, countTexArrays = 0, texArray = textureArrays[0], start = 0;
    batch.copyBoundTextures(boundTextures, maxTextures);
    for (let i = 0; i < this._bufferSize; ++i) {
      const tex = textures[i];
      textures[i] = null, tex._batchEnabled !== TICK && (texArray.count >= maxTextures && (batch.boundArray(texArray, boundTextures, TICK, maxTextures), this.buildDrawCalls(texArray, start, i), start = i, texArray = textureArrays[++countTexArrays], ++TICK), tex._batchEnabled = TICK, tex.touched = touch, texArray.elements[texArray.count++] = tex);
    }
    texArray.count > 0 && (batch.boundArray(texArray, boundTextures, TICK, maxTextures), this.buildDrawCalls(texArray, start, this._bufferSize), ++countTexArrays, ++TICK);
    for (let i = 0; i < boundTextures.length; i++)
      boundTextures[i] = null;
    BaseTexture.BaseTexture._globalBatch = TICK;
  }
  /**
   * Populating drawcalls for rendering
   * @param texArray
   * @param start
   * @param finish
   */
  buildDrawCalls(texArray, start, finish) {
    const {
      _bufferedElements: elements,
      _attributeBuffer,
      _indexBuffer,
      vertexSize
    } = this, drawCalls = _BatchRenderer2._drawCallPool;
    let dcIndex = this._dcIndex, aIndex = this._aIndex, iIndex = this._iIndex, drawCall = drawCalls[dcIndex];
    drawCall.start = this._iIndex, drawCall.texArray = texArray;
    for (let i = start; i < finish; ++i) {
      const sprite = elements[i], tex = sprite._texture.baseTexture, spriteBlendMode = utils.premultiplyBlendMode[tex.alphaMode ? 1 : 0][sprite.blendMode];
      elements[i] = null, start < i && drawCall.blend !== spriteBlendMode && (drawCall.size = iIndex - drawCall.start, start = i, drawCall = drawCalls[++dcIndex], drawCall.texArray = texArray, drawCall.start = iIndex), this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex), aIndex += sprite.vertexData.length / 2 * vertexSize, iIndex += sprite.indices.length, drawCall.blend = spriteBlendMode;
    }
    start < finish && (drawCall.size = iIndex - drawCall.start, ++dcIndex), this._dcIndex = dcIndex, this._aIndex = aIndex, this._iIndex = iIndex;
  }
  /**
   * Bind textures for current rendering
   * @param texArray
   */
  bindAndClearTexArray(texArray) {
    const textureSystem = this.renderer.texture;
    for (let j = 0; j < texArray.count; j++)
      textureSystem.bind(texArray.elements[j], texArray.ids[j]), texArray.elements[j] = null;
    texArray.count = 0;
  }
  updateGeometry() {
    const {
      _packedGeometries: packedGeometries,
      _attributeBuffer: attributeBuffer,
      _indexBuffer: indexBuffer
    } = this;
    _BatchRenderer2.canUploadSameBuffer ? (packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData), packedGeometries[this._flushId]._indexBuffer.update(indexBuffer), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, packedGeometries[this._flushId] = new this.geometryClass()), packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData), packedGeometries[this._flushId]._indexBuffer.update(indexBuffer), this.renderer.geometry.bind(packedGeometries[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
  }
  drawBatches() {
    const dcCount = this._dcIndex, { gl, state: stateSystem } = this.renderer, drawCalls = _BatchRenderer2._drawCallPool;
    let curTexArray = null;
    for (let i = 0; i < dcCount; i++) {
      const { texArray, type, size, start, blend } = drawCalls[i];
      curTexArray !== texArray && (curTexArray = texArray, this.bindAndClearTexArray(texArray)), this.state.blendMode = blend, stateSystem.set(this.state), gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
    }
  }
  /** Renders the content _now_ and empties the current batch. */
  flush() {
    this._vertexCount !== 0 && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
  }
  /** Starts a new sprite batch. */
  start() {
    this.renderer.state.set(this.state), this.renderer.texture.ensureSamplerType(this.maxTextures), this.renderer.shader.bind(this._shader), _BatchRenderer2.canUploadSameBuffer && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
  }
  /** Stops and flushes the current batch. */
  stop() {
    this.flush();
  }
  /** Destroys this `BatchRenderer`. It cannot be used again. */
  destroy() {
    for (let i = 0; i < this._packedGeometryPoolSize; i++)
      this._packedGeometries[i] && this._packedGeometries[i].destroy();
    this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), super.destroy();
  }
  /**
   * Fetches an attribute buffer from `this._aBuffers` that can hold atleast `size` floats.
   * @param size - minimum capacity required
   * @returns - buffer than can hold atleast `size` floats
   */
  getAttributeBuffer(size) {
    const roundedP2 = utils.nextPow2(Math.ceil(size / 8)), roundedSizeIndex = utils.log2(roundedP2), roundedSize = roundedP2 * 8;
    this._aBuffers.length <= roundedSizeIndex && (this._iBuffers.length = roundedSizeIndex + 1);
    let buffer = this._aBuffers[roundedSize];
    return buffer || (this._aBuffers[roundedSize] = buffer = new ViewableBuffer.ViewableBuffer(roundedSize * this.vertexSize * 4)), buffer;
  }
  /**
   * Fetches an index buffer from `this._iBuffers` that can
   * have at least `size` capacity.
   * @param size - minimum required capacity
   * @returns - buffer that can fit `size` indices.
   */
  getIndexBuffer(size) {
    const roundedP2 = utils.nextPow2(Math.ceil(size / 12)), roundedSizeIndex = utils.log2(roundedP2), roundedSize = roundedP2 * 12;
    this._iBuffers.length <= roundedSizeIndex && (this._iBuffers.length = roundedSizeIndex + 1);
    let buffer = this._iBuffers[roundedSizeIndex];
    return buffer || (this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize)), buffer;
  }
  /**
   * Takes the four batching parameters of `element`, interleaves
   * and pushes them into the batching attribute/index buffers given.
   *
   * It uses these properties: `vertexData` `uvs`, `textureId` and
   * `indicies`. It also uses the "tint" of the base-texture, if
   * present.
   * @param {PIXI.DisplayObject} element - element being rendered
   * @param attributeBuffer - attribute buffer.
   * @param indexBuffer - index buffer
   * @param aIndex - number of floats already in the attribute buffer
   * @param iIndex - number of indices already in `indexBuffer`
   */
  packInterleavedGeometry(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
    const {
      uint32View,
      float32View
    } = attributeBuffer, packedVertices = aIndex / this.vertexSize, uvs = element.uvs, indicies = element.indices, vertexData = element.vertexData, textureId = element._texture.baseTexture._batchLocation, alpha = Math.min(element.worldAlpha, 1), argb = color.Color.shared.setValue(element._tintRGB).toPremultiplied(alpha, element._texture.baseTexture.alphaMode > 0);
    for (let i = 0; i < vertexData.length; i += 2)
      float32View[aIndex++] = vertexData[i], float32View[aIndex++] = vertexData[i + 1], float32View[aIndex++] = uvs[i], float32View[aIndex++] = uvs[i + 1], uint32View[aIndex++] = argb, float32View[aIndex++] = textureId;
    for (let i = 0; i < indicies.length; i++)
      indexBuffer[iIndex++] = packedVertices + indicies[i];
  }
};
_BatchRenderer.defaultBatchSize = 4096, /** @ignore */
_BatchRenderer.extension = {
  name: "batch",
  type: extensions.ExtensionType.RendererPlugin
}, /**
* Pool of `BatchDrawCall` objects that `flush` used
* to create "batches" of the objects being rendered.
*
* These are never re-allocated again.
* Shared between all batch renderers because it can be only one "flush" working at the moment.
* @member {PIXI.BatchDrawCall[]}
*/
_BatchRenderer._drawCallPool = [], /**
* Pool of `BatchDrawCall` objects that `flush` used
* to create "batches" of the objects being rendered.
*
* These are never re-allocated again.
* Shared between all batch renderers because it can be only one "flush" working at the moment.
* @member {PIXI.BatchTextureArray[]}
*/
_BatchRenderer._textureArrayPool = [];
let BatchRenderer = _BatchRenderer;
extensions.extensions.add(BatchRenderer);
exports.BatchRenderer = BatchRenderer;
//# sourceMappingURL=BatchRenderer.js.map
