"use strict";
var constants = require("@pixi/constants"), settings = require("@pixi/settings"), BaseImageResource = require("./BaseImageResource.js");
class ImageBitmapResource extends BaseImageResource.BaseImageResource {
  /**
   * @param source - ImageBitmap or URL to use.
   * @param options - Options to use.
   */
  constructor(source, options) {
    options = options || {};
    let baseSource, url, ownsImageBitmap;
    typeof source == "string" ? (baseSource = ImageBitmapResource.EMPTY, url = source, ownsImageBitmap = !0) : (baseSource = source, url = null, ownsImageBitmap = !1), super(baseSource), this.url = url, this.crossOrigin = options.crossOrigin ?? !0, this.alphaMode = typeof options.alphaMode == "number" ? options.alphaMode : null, this.ownsImageBitmap = options.ownsImageBitmap ?? ownsImageBitmap, this._load = null, options.autoLoad !== !1 && this.load();
  }
  load() {
    return this._load ? this._load : (this._load = new Promise(async (resolve, reject) => {
      if (this.url === null) {
        resolve(this);
        return;
      }
      try {
        const response = await settings.settings.ADAPTER.fetch(this.url, {
          mode: this.crossOrigin ? "cors" : "no-cors"
        });
        if (this.destroyed)
          return;
        const imageBlob = await response.blob();
        if (this.destroyed)
          return;
        const imageBitmap = await createImageBitmap(imageBlob, {
          premultiplyAlpha: this.alphaMode === null || this.alphaMode === constants.ALPHA_MODES.UNPACK ? "premultiply" : "none"
        });
        if (this.destroyed) {
          imageBitmap.close();
          return;
        }
        this.source = imageBitmap, this.update(), resolve(this);
      } catch (e) {
        if (this.destroyed)
          return;
        reject(e), this.onError.emit(e);
      }
    }), this._load);
  }
  /**
   * Upload the image bitmap resource to GPU.
   * @param renderer - Renderer to upload to
   * @param baseTexture - BaseTexture for this resource
   * @param glTexture - GLTexture to use
   * @returns {boolean} true is success
   */
  upload(renderer, baseTexture, glTexture) {
    return this.source instanceof ImageBitmap ? (typeof this.alphaMode == "number" && (baseTexture.alphaMode = this.alphaMode), super.upload(renderer, baseTexture, glTexture)) : (this.load(), !1);
  }
  /** Destroys this resource. */
  dispose() {
    this.ownsImageBitmap && this.source instanceof ImageBitmap && this.source.close(), super.dispose(), this._load = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if current environment support ImageBitmap, and source is string or ImageBitmap
   */
  static test(source) {
    return !!globalThis.createImageBitmap && typeof ImageBitmap < "u" && (typeof source == "string" || source instanceof ImageBitmap);
  }
  /**
   * ImageBitmap cannot be created synchronously, so a empty placeholder canvas is needed when loading from URLs.
   * Only for internal usage.
   * @returns The cached placeholder canvas.
   */
  static get EMPTY() {
    return ImageBitmapResource._EMPTY = ImageBitmapResource._EMPTY ?? settings.settings.ADAPTER.createCanvas(0, 0), ImageBitmapResource._EMPTY;
  }
}
exports.ImageBitmapResource = ImageBitmapResource;
//# sourceMappingURL=ImageBitmapResource.js.map
