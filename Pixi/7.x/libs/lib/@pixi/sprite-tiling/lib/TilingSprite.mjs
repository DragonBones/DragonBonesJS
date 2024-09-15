import { Point, Transform, TextureMatrix, Rectangle, Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
const tempPoint = new Point();
class TilingSprite extends Sprite {
  /**
   * Note: The wrap mode of the texture is forced to REPEAT on render if the size of the texture
   * is a power of two, the texture's wrap mode is CLAMP, and the texture hasn't been bound yet.
   * @param texture - The texture of the tiling sprite.
   * @param width - The width of the tiling sprite.
   * @param height - The height of the tiling sprite.
   */
  constructor(texture, width = 100, height = 100) {
    super(texture), this.tileTransform = new Transform(), this._width = width, this._height = height, this.uvMatrix = this.texture.uvMatrix || new TextureMatrix(texture), this.pluginName = "tilingSprite", this.uvRespectAnchor = !1;
  }
  /**
   * Changes frame clamping in corresponding textureTransform, shortcut
   * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
   * @default 0.5
   * @member {number}
   */
  get clampMargin() {
    return this.uvMatrix.clampMargin;
  }
  set clampMargin(value) {
    this.uvMatrix.clampMargin = value, this.uvMatrix.update(!0);
  }
  /** The scaling of the image that is being tiled. */
  get tileScale() {
    return this.tileTransform.scale;
  }
  set tileScale(value) {
    this.tileTransform.scale.copyFrom(value);
  }
  /** The offset of the image that is being tiled. */
  get tilePosition() {
    return this.tileTransform.position;
  }
  set tilePosition(value) {
    this.tileTransform.position.copyFrom(value);
  }
  /**
   * @protected
   */
  _onTextureUpdate() {
    this.uvMatrix && (this.uvMatrix.texture = this._texture), this._cachedTint = 16777215;
  }
  /**
   * Renders the object using the WebGL renderer
   * @param renderer - The renderer
   */
  _render(renderer) {
    const texture = this._texture;
    !texture || !texture.valid || (this.tileTransform.updateLocalTransform(), this.uvMatrix.update(), renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]), renderer.plugins[this.pluginName].render(this));
  }
  /** Updates the bounds of the tiling sprite. */
  _calculateBounds() {
    const minX = this._width * -this._anchor._x, minY = this._height * -this._anchor._y, maxX = this._width * (1 - this._anchor._x), maxY = this._height * (1 - this._anchor._y);
    this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
  }
  /**
   * Gets the local bounds of the sprite object.
   * @param rect - Optional output rectangle.
   * @returns The bounds.
   */
  getLocalBounds(rect) {
    return this.children.length === 0 ? (this._bounds.minX = this._width * -this._anchor._x, this._bounds.minY = this._height * -this._anchor._y, this._bounds.maxX = this._width * (1 - this._anchor._x), this._bounds.maxY = this._height * (1 - this._anchor._y), rect || (this._localBoundsRect || (this._localBoundsRect = new Rectangle()), rect = this._localBoundsRect), this._bounds.getRectangle(rect)) : super.getLocalBounds.call(this, rect);
  }
  /**
   * Checks if a point is inside this tiling sprite.
   * @param point - The point to check.
   * @returns Whether or not the sprite contains the point.
   */
  containsPoint(point) {
    this.worldTransform.applyInverse(point, tempPoint);
    const width = this._width, height = this._height, x1 = -width * this.anchor._x;
    if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
      const y1 = -height * this.anchor._y;
      if (tempPoint.y >= y1 && tempPoint.y < y1 + height)
        return !0;
    }
    return !1;
  }
  /**
   * Destroys this sprite and optionally its texture and children
   * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *      method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well
   * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
   */
  destroy(options) {
    super.destroy(options), this.tileTransform = null, this.uvMatrix = null;
  }
  /**
   * Helper function that creates a new tiling sprite based on the source you provide.
   * The source can be - frame id, image url, video url, canvas element, video element, base texture
   * @static
   * @param {string|PIXI.Texture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
   * @param {object} options - See {@link PIXI.BaseTexture}'s constructor for options.
   * @param {number} options.width - required width of the tiling sprite
   * @param {number} options.height - required height of the tiling sprite
   * @returns {PIXI.TilingSprite} The newly created texture
   */
  static from(source, options) {
    const texture = source instanceof Texture ? source : Texture.from(source, options);
    return new TilingSprite(
      texture,
      options.width,
      options.height
    );
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
  /** The height of the TilingSprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
}
export {
  TilingSprite
};
//# sourceMappingURL=TilingSprite.mjs.map
