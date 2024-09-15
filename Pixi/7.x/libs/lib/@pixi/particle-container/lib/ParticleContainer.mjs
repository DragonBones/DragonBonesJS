import { BLEND_MODES, Color } from "@pixi/core";
import { Container } from "@pixi/display";
class ParticleContainer extends Container {
  /**
   * @param maxSize - The maximum number of particles that can be rendered by the container.
   *  Affects size of allocated buffers.
   * @param properties - The properties of children that should be uploaded to the gpu and applied.
   * @param {boolean} [properties.vertices=false] - When true, vertices be uploaded and applied.
   *                  if sprite's ` scale/anchor/trim/frame/orig` is dynamic, please set `true`.
   * @param {boolean} [properties.position=true] - When true, position be uploaded and applied.
   * @param {boolean} [properties.rotation=false] - When true, rotation be uploaded and applied.
   * @param {boolean} [properties.uvs=false] - When true, uvs be uploaded and applied.
   * @param {boolean} [properties.tint=false] - When true, alpha and tint be uploaded and applied.
   * @param {number} [batchSize=16384] - Number of particles per batch. If less than maxSize, it uses maxSize instead.
   * @param {boolean} [autoResize=false] - If true, container allocates more batches in case
   *  there are more than `maxSize` particles.
   */
  constructor(maxSize = 1500, properties, batchSize = 16384, autoResize = !1) {
    super();
    const maxBatchSize = 16384;
    batchSize > maxBatchSize && (batchSize = maxBatchSize), this._properties = [!1, !0, !1, !1, !1], this._maxSize = maxSize, this._batchSize = batchSize, this._buffers = null, this._bufferUpdateIDs = [], this._updateID = 0, this.interactiveChildren = !1, this.blendMode = BLEND_MODES.NORMAL, this.autoResize = autoResize, this.roundPixels = !0, this.baseTexture = null, this.setProperties(properties), this._tintColor = new Color(0), this.tintRgb = new Float32Array(3), this.tint = 16777215;
  }
  /**
   * Sets the private properties array to dynamic / static based on the passed properties object
   * @param properties - The properties to be uploaded
   */
  setProperties(properties) {
    properties && (this._properties[0] = "vertices" in properties || "scale" in properties ? !!properties.vertices || !!properties.scale : this._properties[0], this._properties[1] = "position" in properties ? !!properties.position : this._properties[1], this._properties[2] = "rotation" in properties ? !!properties.rotation : this._properties[2], this._properties[3] = "uvs" in properties ? !!properties.uvs : this._properties[3], this._properties[4] = "tint" in properties || "alpha" in properties ? !!properties.tint || !!properties.alpha : this._properties[4]);
  }
  updateTransform() {
    this.displayObjectUpdateTransform();
  }
  /**
   * The tint applied to the container. This is a hex value.
   * A value of 0xFFFFFF will remove any tint effect.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * @default 0xFFFFFF
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    this._tintColor.setValue(value), this._tintColor.toRgbArray(this.tintRgb);
  }
  /**
   * Renders the container using the WebGL renderer.
   * @param renderer - The WebGL renderer.
   */
  render(renderer) {
    !this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable || (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.valid || this.baseTexture.once("update", () => this.onChildrenChange(0))), renderer.batch.setObjectRenderer(renderer.plugins.particle), renderer.plugins.particle.render(this));
  }
  /**
   * Set the flag that static data should be updated to true
   * @param smallestChildIndex - The smallest child index.
   */
  onChildrenChange(smallestChildIndex) {
    const bufferIndex = Math.floor(smallestChildIndex / this._batchSize);
    for (; this._bufferUpdateIDs.length < bufferIndex; )
      this._bufferUpdateIDs.push(0);
    this._bufferUpdateIDs[bufferIndex] = ++this._updateID;
  }
  dispose() {
    if (this._buffers) {
      for (let i = 0; i < this._buffers.length; ++i)
        this._buffers[i].destroy();
      this._buffers = null;
    }
  }
  /**
   * Destroys the container
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their
   *  destroy method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the texture of the child sprite
   * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the base texture of the child sprite
   */
  destroy(options) {
    super.destroy(options), this.dispose(), this._properties = null, this._buffers = null, this._bufferUpdateIDs = null;
  }
}
export {
  ParticleContainer
};
//# sourceMappingURL=ParticleContainer.mjs.map
