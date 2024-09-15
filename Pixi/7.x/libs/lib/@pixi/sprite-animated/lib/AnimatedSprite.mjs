import { Texture, Ticker, UPDATE_PRIORITY } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
class AnimatedSprite extends Sprite {
  /**
   * @param textures - An array of {@link PIXI.Texture} or frame
   *  objects that make up the animation.
   * @param {boolean} [autoUpdate=true] - Whether to use Ticker.shared to auto update animation time.
   */
  constructor(textures, autoUpdate = !0) {
    super(textures[0] instanceof Texture ? textures[0] : textures[0].texture), this._textures = null, this._durations = null, this._autoUpdate = autoUpdate, this._isConnectedToTicker = !1, this.animationSpeed = 1, this.loop = !0, this.updateAnchor = !1, this.onComplete = null, this.onFrameChange = null, this.onLoop = null, this._currentTime = 0, this._playing = !1, this._previousFrame = null, this.textures = textures;
  }
  /** Stops the AnimatedSprite. */
  stop() {
    this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (Ticker.shared.remove(this.update, this), this._isConnectedToTicker = !1));
  }
  /** Plays the AnimatedSprite. */
  play() {
    this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (Ticker.shared.add(this.update, this, UPDATE_PRIORITY.HIGH), this._isConnectedToTicker = !0));
  }
  /**
   * Stops the AnimatedSprite and goes to a specific frame.
   * @param frameNumber - Frame index to stop at.
   */
  gotoAndStop(frameNumber) {
    this.stop(), this.currentFrame = frameNumber;
  }
  /**
   * Goes to a specific frame and begins playing the AnimatedSprite.
   * @param frameNumber - Frame index to start at.
   */
  gotoAndPlay(frameNumber) {
    this.currentFrame = frameNumber, this.play();
  }
  /**
   * Updates the object transform for rendering.
   * @param deltaTime - Time since last tick.
   */
  update(deltaTime) {
    if (!this._playing)
      return;
    const elapsed = this.animationSpeed * deltaTime, previousFrame = this.currentFrame;
    if (this._durations !== null) {
      let lag = this._currentTime % 1 * this._durations[this.currentFrame];
      for (lag += elapsed / 60 * 1e3; lag < 0; )
        this._currentTime--, lag += this._durations[this.currentFrame];
      const sign = Math.sign(this.animationSpeed * deltaTime);
      for (this._currentTime = Math.floor(this._currentTime); lag >= this._durations[this.currentFrame]; )
        lag -= this._durations[this.currentFrame] * sign, this._currentTime += sign;
      this._currentTime += lag / this._durations[this.currentFrame];
    } else
      this._currentTime += elapsed;
    this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : previousFrame !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < previousFrame || this.animationSpeed < 0 && this.currentFrame > previousFrame) && this.onLoop(), this.updateTexture());
  }
  /** Updates the displayed texture to match the current frame index. */
  updateTexture() {
    const currentFrame = this.currentFrame;
    this._previousFrame !== currentFrame && (this._previousFrame = currentFrame, this._texture = this._textures[currentFrame], this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this.uvs = this._texture._uvs.uvsFloat32, this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
  }
  /**
   * Stops the AnimatedSprite and destroys it.
   * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
   *  have been set to that value.
   * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy
   *      method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well.
   * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well.
   */
  destroy(options) {
    this.stop(), super.destroy(options), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
  }
  /**
   * A short hand way of creating an AnimatedSprite from an array of frame ids.
   * @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
   * @returns - The new animated sprite with the specified frames.
   */
  static fromFrames(frames) {
    const textures = [];
    for (let i = 0; i < frames.length; ++i)
      textures.push(Texture.from(frames[i]));
    return new AnimatedSprite(textures);
  }
  /**
   * A short hand way of creating an AnimatedSprite from an array of image ids.
   * @param images - The array of image urls the AnimatedSprite will use as its texture frames.
   * @returns The new animate sprite with the specified images as frames.
   */
  static fromImages(images) {
    const textures = [];
    for (let i = 0; i < images.length; ++i)
      textures.push(Texture.from(images[i]));
    return new AnimatedSprite(textures);
  }
  /**
   * The total number of frames in the AnimatedSprite. This is the same as number of textures
   * assigned to the AnimatedSprite.
   * @readonly
   * @default 0
   */
  get totalFrames() {
    return this._textures.length;
  }
  /** The array of textures used for this AnimatedSprite. */
  get textures() {
    return this._textures;
  }
  set textures(value) {
    if (value[0] instanceof Texture)
      this._textures = value, this._durations = null;
    else {
      this._textures = [], this._durations = [];
      for (let i = 0; i < value.length; i++)
        this._textures.push(value[i].texture), this._durations.push(value[i].time);
    }
    this._previousFrame = null, this.gotoAndStop(0), this.updateTexture();
  }
  /** The AnimatedSprite's current frame index. */
  get currentFrame() {
    let currentFrame = Math.floor(this._currentTime) % this._textures.length;
    return currentFrame < 0 && (currentFrame += this._textures.length), currentFrame;
  }
  set currentFrame(value) {
    if (value < 0 || value > this.totalFrames - 1)
      throw new Error(`[AnimatedSprite]: Invalid frame index value ${value}, expected to be between 0 and totalFrames ${this.totalFrames}.`);
    const previousFrame = this.currentFrame;
    this._currentTime = value, previousFrame !== this.currentFrame && this.updateTexture();
  }
  /**
   * Indicates if the AnimatedSprite is currently playing.
   * @readonly
   */
  get playing() {
    return this._playing;
  }
  /** Whether to use Ticker.shared to auto update animation time. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(value) {
    value !== this._autoUpdate && (this._autoUpdate = value, !this._autoUpdate && this._isConnectedToTicker ? (Ticker.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (Ticker.shared.add(this.update, this), this._isConnectedToTicker = !0));
  }
}
export {
  AnimatedSprite
};
//# sourceMappingURL=AnimatedSprite.mjs.map
