"use strict";
var constants = require("@pixi/constants"), utils = require("@pixi/utils"), BaseRenderTexture = require("./BaseRenderTexture.js"), RenderTexture = require("./RenderTexture.js");
class RenderTexturePool {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
   */
  constructor(textureOptions) {
    this.texturePool = {}, this.textureOptions = textureOptions || {}, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param realWidth - Width of texture in pixels.
   * @param realHeight - Height of texture in pixels.
   * @param multisample - Number of samples of the framebuffer.
   */
  createTexture(realWidth, realHeight, multisample = constants.MSAA_QUALITY.NONE) {
    const baseRenderTexture = new BaseRenderTexture.BaseRenderTexture(Object.assign({
      width: realWidth,
      height: realHeight,
      resolution: 1,
      multisample
    }, this.textureOptions));
    return new RenderTexture.RenderTexture(baseRenderTexture);
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param multisample - Number of samples of the render texture.
   * @returns The new render texture.
   */
  getOptimalTexture(minWidth, minHeight, resolution = 1, multisample = constants.MSAA_QUALITY.NONE) {
    let key;
    minWidth = Math.max(Math.ceil(minWidth * resolution - 1e-6), 1), minHeight = Math.max(Math.ceil(minHeight * resolution - 1e-6), 1), !this.enableFullScreen || minWidth !== this._pixelsWidth || minHeight !== this._pixelsHeight ? (minWidth = utils.nextPow2(minWidth), minHeight = utils.nextPow2(minHeight), key = ((minWidth & 65535) << 16 | minHeight & 65535) >>> 0, multisample > 1 && (key += multisample * 4294967296)) : key = multisample > 1 ? -multisample : -1, this.texturePool[key] || (this.texturePool[key] = []);
    let renderTexture = this.texturePool[key].pop();
    return renderTexture || (renderTexture = this.createTexture(minWidth, minHeight, multisample)), renderTexture.filterPoolKey = key, renderTexture.setResolution(resolution), renderTexture;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   *
   * `getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`
   * @param input - renderTexture from which size and resolution will be copied
   * @param resolution - override resolution of the renderTexture
   *  It overrides, it does not multiply
   * @param multisample - number of samples of the renderTexture
   */
  getFilterTexture(input, resolution, multisample) {
    const filterTexture = this.getOptimalTexture(
      input.width,
      input.height,
      resolution || input.resolution,
      multisample || constants.MSAA_QUALITY.NONE
    );
    return filterTexture.filterFrame = input.filterFrame, filterTexture;
  }
  /**
   * Place a render texture back into the pool.
   * @param renderTexture - The renderTexture to free
   */
  returnTexture(renderTexture) {
    const key = renderTexture.filterPoolKey;
    renderTexture.filterFrame = null, this.texturePool[key].push(renderTexture);
  }
  /**
   * Alias for returnTexture, to be compliant with FilterSystem interface.
   * @param renderTexture - The renderTexture to free
   */
  returnFilterTexture(renderTexture) {
    this.returnTexture(renderTexture);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(destroyTextures) {
    if (destroyTextures = destroyTextures !== !1, destroyTextures)
      for (const i in this.texturePool) {
        const textures = this.texturePool[i];
        if (textures)
          for (let j = 0; j < textures.length; j++)
            textures[j].destroy(!0);
      }
    this.texturePool = {};
  }
  /**
   * If screen size was changed, drops all screen-sized textures,
   * sets new screen size, sets `enableFullScreen` to true
   *
   * Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`
   * @param size - Initial size of screen.
   */
  setScreenSize(size) {
    if (!(size.width === this._pixelsWidth && size.height === this._pixelsHeight)) {
      this.enableFullScreen = size.width > 0 && size.height > 0;
      for (const i in this.texturePool) {
        if (!(Number(i) < 0))
          continue;
        const textures = this.texturePool[i];
        if (textures)
          for (let j = 0; j < textures.length; j++)
            textures[j].destroy(!0);
        this.texturePool[i] = [];
      }
      this._pixelsWidth = size.width, this._pixelsHeight = size.height;
    }
  }
}
RenderTexturePool.SCREEN_KEY = -1;
exports.RenderTexturePool = RenderTexturePool;
//# sourceMappingURL=RenderTexturePool.js.map
