import { ALPHA_MODES } from "@pixi/constants";
import { settings } from "@pixi/settings";
import { BaseImageResource } from "./BaseImageResource.mjs";
class ImageResource extends BaseImageResource {
  /**
   * @param source - image source or URL
   * @param options
   * @param {boolean} [options.autoLoad=true] - start loading process
   * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - whether its required to create
   *        a bitmap before upload
   * @param {boolean} [options.crossorigin=true] - Load image using cross origin
   * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Premultiply image alpha in bitmap
   */
  constructor(source, options) {
    if (options = options || {}, typeof source == "string") {
      const imageElement = new Image();
      BaseImageResource.crossOrigin(imageElement, source, options.crossorigin), imageElement.src = source, source = imageElement;
    }
    super(source), !source.complete && this._width && this._height && (this._width = 0, this._height = 0), this.url = source.src, this._process = null, this.preserveBitmap = !1, this.createBitmap = (options.createBitmap ?? settings.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap, this.alphaMode = typeof options.alphaMode == "number" ? options.alphaMode : null, this.bitmap = null, this._load = null, options.autoLoad !== !1 && this.load();
  }
  /**
   * Returns a promise when image will be loaded and processed.
   * @param createBitmap - whether process image into bitmap
   */
  load(createBitmap) {
    return this._load ? this._load : (createBitmap !== void 0 && (this.createBitmap = createBitmap), this._load = new Promise((resolve, reject) => {
      const source = this.source;
      this.url = source.src;
      const completed = () => {
        this.destroyed || (source.onload = null, source.onerror = null, this.update(), this._load = null, this.createBitmap ? resolve(this.process()) : resolve(this));
      };
      source.complete && source.src ? completed() : (source.onload = completed, source.onerror = (event) => {
        reject(event), this.onError.emit(event);
      });
    }), this._load);
  }
  /**
   * Called when we need to convert image into BitmapImage.
   * Can be called multiple times, real promise is cached inside.
   * @returns - Cached promise to fill that bitmap
   */
  process() {
    const source = this.source;
    if (this._process !== null)
      return this._process;
    if (this.bitmap !== null || !globalThis.createImageBitmap)
      return Promise.resolve(this);
    const createImageBitmap = globalThis.createImageBitmap, cors = !source.crossOrigin || source.crossOrigin === "anonymous";
    return this._process = fetch(
      source.src,
      {
        mode: cors ? "cors" : "no-cors"
      }
    ).then((r) => r.blob()).then((blob) => createImageBitmap(
      blob,
      0,
      0,
      source.width,
      source.height,
      {
        premultiplyAlpha: this.alphaMode === null || this.alphaMode === ALPHA_MODES.UNPACK ? "premultiply" : "none"
      }
    )).then((bitmap) => this.destroyed ? Promise.reject() : (this.bitmap = bitmap, this.update(), this._process = null, Promise.resolve(this))), this._process;
  }
  /**
   * Upload the image resource to GPU.
   * @param renderer - Renderer to upload to
   * @param baseTexture - BaseTexture for this resource
   * @param glTexture - GLTexture to use
   * @returns {boolean} true is success
   */
  upload(renderer, baseTexture, glTexture) {
    if (typeof this.alphaMode == "number" && (baseTexture.alphaMode = this.alphaMode), !this.createBitmap)
      return super.upload(renderer, baseTexture, glTexture);
    if (!this.bitmap && (this.process(), !this.bitmap))
      return !1;
    if (super.upload(renderer, baseTexture, glTexture, this.bitmap), !this.preserveBitmap) {
      let flag = !0;
      const glTextures = baseTexture._glTextures;
      for (const key in glTextures) {
        const otherTex = glTextures[key];
        if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId) {
          flag = !1;
          break;
        }
      }
      flag && (this.bitmap.close && this.bitmap.close(), this.bitmap = null);
    }
    return !0;
  }
  /** Destroys this resource. */
  dispose() {
    this.source.onload = null, this.source.onerror = null, super.dispose(), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if current environment support HTMLImageElement, and source is string or HTMLImageElement
   */
  static test(source) {
    return typeof HTMLImageElement < "u" && (typeof source == "string" || source instanceof HTMLImageElement);
  }
}
export {
  ImageResource
};
//# sourceMappingURL=ImageResource.mjs.map
