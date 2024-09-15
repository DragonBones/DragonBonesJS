"use strict";
var color = require("@pixi/color"), extensions = require("@pixi/extensions"), math = require("@pixi/math");
const tempRect = new math.Rectangle(), tempRect2 = new math.Rectangle();
class RenderTextureSystem {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(renderer) {
    this.renderer = renderer, this.defaultMaskStack = [], this.current = null, this.sourceFrame = new math.Rectangle(), this.destinationFrame = new math.Rectangle(), this.viewportFrame = new math.Rectangle();
  }
  contextChange() {
    const attributes = this.renderer?.gl.getContextAttributes();
    this._rendererPremultipliedAlpha = !!(attributes && attributes.alpha && attributes.premultipliedAlpha);
  }
  /**
   * Bind the current render texture.
   * @param renderTexture - RenderTexture to bind, by default its `null` - the screen.
   * @param sourceFrame - Part of world that is mapped to the renderTexture.
   * @param destinationFrame - Part of renderTexture, by default it has the same size as sourceFrame.
   */
  bind(renderTexture = null, sourceFrame, destinationFrame) {
    const renderer = this.renderer;
    this.current = renderTexture;
    let baseTexture, framebuffer, resolution;
    renderTexture ? (baseTexture = renderTexture.baseTexture, resolution = baseTexture.resolution, sourceFrame || (tempRect.width = renderTexture.frame.width, tempRect.height = renderTexture.frame.height, sourceFrame = tempRect), destinationFrame || (tempRect2.x = renderTexture.frame.x, tempRect2.y = renderTexture.frame.y, tempRect2.width = sourceFrame.width, tempRect2.height = sourceFrame.height, destinationFrame = tempRect2), framebuffer = baseTexture.framebuffer) : (resolution = renderer.resolution, sourceFrame || (tempRect.width = renderer._view.screen.width, tempRect.height = renderer._view.screen.height, sourceFrame = tempRect), destinationFrame || (destinationFrame = tempRect, destinationFrame.width = sourceFrame.width, destinationFrame.height = sourceFrame.height));
    const viewportFrame = this.viewportFrame;
    viewportFrame.x = destinationFrame.x * resolution, viewportFrame.y = destinationFrame.y * resolution, viewportFrame.width = destinationFrame.width * resolution, viewportFrame.height = destinationFrame.height * resolution, renderTexture || (viewportFrame.y = renderer.view.height - (viewportFrame.y + viewportFrame.height)), viewportFrame.ceil(), this.renderer.framebuffer.bind(framebuffer, viewportFrame), this.renderer.projection.update(destinationFrame, sourceFrame, resolution, !framebuffer), renderTexture ? this.renderer.mask.setMaskStack(baseTexture.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(sourceFrame), this.destinationFrame.copyFrom(destinationFrame);
  }
  /**
   * Erases the render texture and fills the drawing area with a colour.
   * @param clearColor - The color as rgba, default to use the renderer backgroundColor
   * @param [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
   *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
   */
  clear(clearColor, mask) {
    const fallbackColor = this.current ? this.current.baseTexture.clear : this.renderer.background.backgroundColor, color$1 = color.Color.shared.setValue(clearColor || fallbackColor);
    (this.current && this.current.baseTexture.alphaMode > 0 || !this.current && this._rendererPremultipliedAlpha) && color$1.premultiply(color$1.alpha);
    const destinationFrame = this.destinationFrame, baseFrame = this.current ? this.current.baseTexture : this.renderer._view.screen, clearMask = destinationFrame.width !== baseFrame.width || destinationFrame.height !== baseFrame.height;
    if (clearMask) {
      let { x, y, width, height } = this.viewportFrame;
      x = Math.round(x), y = Math.round(y), width = Math.round(width), height = Math.round(height), this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(x, y, width, height);
    }
    this.renderer.framebuffer.clear(color$1.red, color$1.green, color$1.blue, color$1.alpha, mask), clearMask && this.renderer.scissor.pop();
  }
  resize() {
    this.bind(null);
  }
  /** Resets render-texture state. */
  reset() {
    this.bind(null);
  }
  destroy() {
    this.renderer = null;
  }
}
RenderTextureSystem.extension = {
  type: extensions.ExtensionType.RendererSystem,
  name: "renderTexture"
};
extensions.extensions.add(RenderTextureSystem);
exports.RenderTextureSystem = RenderTextureSystem;
//# sourceMappingURL=RenderTextureSystem.js.map
