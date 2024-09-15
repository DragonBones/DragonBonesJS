"use strict";
var core = require("@pixi/core"), display = require("@pixi/display");
const tempPoint = new core.Point(), indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
class Sprite extends display.Container {
  /** @param texture - The texture for this sprite. */
  constructor(texture) {
    super(), this._anchor = new core.ObservablePoint(
      this._onAnchorUpdate,
      this,
      texture ? texture.defaultAnchor.x : 0,
      texture ? texture.defaultAnchor.y : 0
    ), this._texture = null, this._width = 0, this._height = 0, this._tintColor = new core.Color(16777215), this._tintRGB = null, this.tint = 16777215, this.blendMode = core.BLEND_MODES.NORMAL, this._cachedTint = 16777215, this.uvs = null, this.texture = texture || core.Texture.EMPTY, this.vertexData = new Float32Array(8), this.vertexTrimmedData = null, this._transformID = -1, this._textureID = -1, this._transformTrimmedID = -1, this._textureTrimmedID = -1, this.indices = indices, this.pluginName = "batch", this.isSprite = !0, this._roundPixels = core.settings.ROUND_PIXELS;
  }
  /** When the texture is updated, this event will fire to update the scale and frame. */
  _onTextureUpdate() {
    this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = core.utils.sign(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = core.utils.sign(this.scale.y) * this._height / this._texture.orig.height);
  }
  /** Called when the anchor position updates. */
  _onAnchorUpdate() {
    this._transformID = -1, this._transformTrimmedID = -1;
  }
  /** Calculates worldTransform * vertices, store it in vertexData. */
  calculateVertices() {
    const texture = this._texture;
    if (this._transformID === this.transform._worldID && this._textureID === texture._updateID)
      return;
    this._textureID !== texture._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = texture._updateID;
    const wt = this.transform.worldTransform, a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty, vertexData = this.vertexData, trim = texture.trim, orig = texture.orig, anchor = this._anchor;
    let w0 = 0, w1 = 0, h0 = 0, h1 = 0;
    if (trim ? (w1 = trim.x - anchor._x * orig.width, w0 = w1 + trim.width, h1 = trim.y - anchor._y * orig.height, h0 = h1 + trim.height) : (w1 = -anchor._x * orig.width, w0 = w1 + orig.width, h1 = -anchor._y * orig.height, h0 = h1 + orig.height), vertexData[0] = a * w1 + c * h1 + tx, vertexData[1] = d * h1 + b * w1 + ty, vertexData[2] = a * w0 + c * h1 + tx, vertexData[3] = d * h1 + b * w0 + ty, vertexData[4] = a * w0 + c * h0 + tx, vertexData[5] = d * h0 + b * w0 + ty, vertexData[6] = a * w1 + c * h0 + tx, vertexData[7] = d * h0 + b * w1 + ty, this._roundPixels) {
      const resolution = core.settings.RESOLUTION;
      for (let i = 0; i < vertexData.length; ++i)
        vertexData[i] = Math.round(vertexData[i] * resolution) / resolution;
    }
  }
  /**
   * Calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData.
   *
   * This is used to ensure that the true width and height of a trimmed texture is respected.
   */
  calculateTrimmedVertices() {
    if (!this.vertexTrimmedData)
      this.vertexTrimmedData = new Float32Array(8);
    else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID)
      return;
    this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
    const texture = this._texture, vertexData = this.vertexTrimmedData, orig = texture.orig, anchor = this._anchor, wt = this.transform.worldTransform, a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty, w1 = -anchor._x * orig.width, w0 = w1 + orig.width, h1 = -anchor._y * orig.height, h0 = h1 + orig.height;
    if (vertexData[0] = a * w1 + c * h1 + tx, vertexData[1] = d * h1 + b * w1 + ty, vertexData[2] = a * w0 + c * h1 + tx, vertexData[3] = d * h1 + b * w0 + ty, vertexData[4] = a * w0 + c * h0 + tx, vertexData[5] = d * h0 + b * w0 + ty, vertexData[6] = a * w1 + c * h0 + tx, vertexData[7] = d * h0 + b * w1 + ty, this._roundPixels) {
      const resolution = core.settings.RESOLUTION;
      for (let i = 0; i < vertexData.length; ++i)
        vertexData[i] = Math.round(vertexData[i] * resolution) / resolution;
    }
  }
  /**
   *
   * Renders the object using the WebGL renderer
   * @param renderer - The webgl renderer to use.
   */
  _render(renderer) {
    this.calculateVertices(), renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]), renderer.plugins[this.pluginName].render(this);
  }
  /** Updates the bounds of the sprite. */
  _calculateBounds() {
    const trim = this._texture.trim, orig = this._texture.orig;
    !trim || trim.width === orig.width && trim.height === orig.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
  }
  /**
   * Gets the local bounds of the sprite object.
   * @param rect - Optional output rectangle.
   * @returns The bounds.
   */
  getLocalBounds(rect) {
    return this.children.length === 0 ? (this._localBounds || (this._localBounds = new display.Bounds()), this._localBounds.minX = this._texture.orig.width * -this._anchor._x, this._localBounds.minY = this._texture.orig.height * -this._anchor._y, this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y), rect || (this._localBoundsRect || (this._localBoundsRect = new core.Rectangle()), rect = this._localBoundsRect), this._localBounds.getRectangle(rect)) : super.getLocalBounds.call(this, rect);
  }
  /**
   * Tests if a point is inside this sprite
   * @param point - the point to test
   * @returns The result of the test
   */
  containsPoint(point) {
    this.worldTransform.applyInverse(point, tempPoint);
    const width = this._texture.orig.width, height = this._texture.orig.height, x1 = -width * this.anchor.x;
    let y1 = 0;
    return tempPoint.x >= x1 && tempPoint.x < x1 + width && (y1 = -height * this.anchor.y, tempPoint.y >= y1 && tempPoint.y < y1 + height);
  }
  /**
   * Destroys this sprite and optionally its texture and children.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param [options.children=false] - if set to true, all the children will have their destroy
   *      method called as well. 'options' will be passed on to those calls.
   * @param [options.texture=false] - Should it destroy the current texture of the sprite as well
   * @param [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
   */
  destroy(options) {
    if (super.destroy(options), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null, typeof options == "boolean" ? options : options?.texture) {
      const destroyBaseTexture = typeof options == "boolean" ? options : options?.baseTexture;
      this._texture.destroy(!!destroyBaseTexture);
    }
    this._texture = null;
  }
  // some helper functions..
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image url, video url, canvas element, video element, base texture
   * @param {string|PIXI.Texture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
   *     - Source to create texture from
   * @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
   * @returns The newly created sprite
   */
  static from(source, options) {
    const texture = source instanceof core.Texture ? source : core.Texture.from(source, options);
    return new Sprite(texture);
  }
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   *
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   *
   * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
   * @default false
   */
  set roundPixels(value) {
    this._roundPixels !== value && (this._transformID = -1, this._transformTrimmedID = -1), this._roundPixels = value;
  }
  get roundPixels() {
    return this._roundPixels;
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(value) {
    const s = core.utils.sign(this.scale.x) || 1;
    this.scale.x = s * value / this._texture.orig.width, this._width = value;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(value) {
    const s = core.utils.sign(this.scale.y) || 1;
    this.scale.y = s * value / this._texture.orig.height, this._height = value;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(Texture.WHITE);
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    this._anchor.copyFrom(value);
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    this._tintColor.setValue(value), this._tintRGB = this._tintColor.toLittleEndianNumber();
  }
  /**
   * Get the tint as a RGB integer.
   * @ignore
   */
  get tintValue() {
    return this._tintColor.toNumber();
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  set texture(value) {
    this._texture !== value && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = value || core.Texture.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, value && (value.baseTexture.valid ? this._onTextureUpdate() : value.once("update", this._onTextureUpdate, this)));
  }
}
exports.Sprite = Sprite;
//# sourceMappingURL=Sprite.js.map
