import { BaseTexture, Texture, utils, Rectangle } from "@pixi/core";
const _Spritesheet = class _Spritesheet2 {
  /** @ignore */
  constructor(optionsOrTexture, arg1, arg2) {
    this.linkedSheets = [], (optionsOrTexture instanceof BaseTexture || optionsOrTexture instanceof Texture) && (optionsOrTexture = { texture: optionsOrTexture, data: arg1, resolutionFilename: arg2 });
    const { texture, data, resolutionFilename = null, cachePrefix = "" } = optionsOrTexture;
    this.cachePrefix = cachePrefix, this._texture = texture instanceof Texture ? texture : null, this.baseTexture = texture instanceof BaseTexture ? texture : this._texture.baseTexture, this.textures = {}, this.animations = {}, this.data = data;
    const resource = this.baseTexture.resource;
    this.resolution = this._updateResolution(resolutionFilename || (resource ? resource.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Generate the resolution from the filename or fallback
   * to the meta.scale field of the JSON data.
   * @param resolutionFilename - The filename to use for resolving
   *        the default resolution.
   * @returns Resolution to use for spritesheet.
   */
  _updateResolution(resolutionFilename = null) {
    const { scale } = this.data.meta;
    let resolution = utils.getResolutionOfUrl(resolutionFilename, null);
    return resolution === null && (resolution = typeof scale == "number" ? scale : parseFloat(scale ?? "1")), resolution !== 1 && this.baseTexture.setResolution(resolution), resolution;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   * @method PIXI.Spritesheet#parse
   */
  parse() {
    return new Promise((resolve) => {
      this._callback = resolve, this._batchIndex = 0, this._frameKeys.length <= _Spritesheet2.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(initialFrameIndex) {
    let frameIndex = initialFrameIndex;
    const maxFrames = _Spritesheet2.BATCH_SIZE;
    for (; frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length; ) {
      const i = this._frameKeys[frameIndex], data = this._frames[i], rect = data.frame;
      if (rect) {
        let frame = null, trim = null;
        const sourceSize = data.trimmed !== !1 && data.sourceSize ? data.sourceSize : data.frame, orig = new Rectangle(
          0,
          0,
          Math.floor(sourceSize.w) / this.resolution,
          Math.floor(sourceSize.h) / this.resolution
        );
        data.rotated ? frame = new Rectangle(
          Math.floor(rect.x) / this.resolution,
          Math.floor(rect.y) / this.resolution,
          Math.floor(rect.h) / this.resolution,
          Math.floor(rect.w) / this.resolution
        ) : frame = new Rectangle(
          Math.floor(rect.x) / this.resolution,
          Math.floor(rect.y) / this.resolution,
          Math.floor(rect.w) / this.resolution,
          Math.floor(rect.h) / this.resolution
        ), data.trimmed !== !1 && data.spriteSourceSize && (trim = new Rectangle(
          Math.floor(data.spriteSourceSize.x) / this.resolution,
          Math.floor(data.spriteSourceSize.y) / this.resolution,
          Math.floor(rect.w) / this.resolution,
          Math.floor(rect.h) / this.resolution
        )), this.textures[i] = new Texture(
          this.baseTexture,
          frame,
          orig,
          trim,
          data.rotated ? 2 : 0,
          data.anchor,
          data.borders
        ), Texture.addToCache(this.textures[i], this.cachePrefix + i.toString());
      }
      frameIndex++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const animations = this.data.animations || {};
    for (const animName in animations) {
      this.animations[animName] = [];
      for (let i = 0; i < animations[animName].length; i++) {
        const frameName = animations[animName][i];
        this.animations[animName].push(this.textures[frameName]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const callback = this._callback;
    this._callback = null, this._batchIndex = 0, callback.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * _Spritesheet2.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * _Spritesheet2.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(destroyBase = !1) {
    for (const i in this.textures)
      this.textures[i].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, destroyBase && (this._texture?.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null, this.linkedSheets = [];
  }
};
_Spritesheet.BATCH_SIZE = 1e3;
let Spritesheet = _Spritesheet;
export {
  Spritesheet
};
//# sourceMappingURL=Spritesheet.mjs.map
