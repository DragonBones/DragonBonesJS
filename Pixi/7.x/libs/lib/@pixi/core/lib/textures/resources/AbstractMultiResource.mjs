import { BaseTexture } from "../BaseTexture.mjs";
import { autoDetectResource } from "./autoDetectResource.mjs";
import { Resource } from "./Resource.mjs";
class AbstractMultiResource extends Resource {
  /**
   * @param length
   * @param options - Options to for Resource constructor
   * @param {number} [options.width] - Width of the resource
   * @param {number} [options.height] - Height of the resource
   */
  constructor(length, options) {
    const { width, height } = options || {};
    super(width, height), this.items = [], this.itemDirtyIds = [];
    for (let i = 0; i < length; i++) {
      const partTexture = new BaseTexture();
      this.items.push(partTexture), this.itemDirtyIds.push(-2);
    }
    this.length = length, this._load = null, this.baseTexture = null;
  }
  /**
   * Used from ArrayResource and CubeResource constructors.
   * @param resources - Can be resources, image elements, canvas, etc. ,
   *  length should be same as constructor length
   * @param options - Detect options for resources
   */
  initFromArray(resources, options) {
    for (let i = 0; i < this.length; i++)
      resources[i] && (resources[i].castToBaseTexture ? this.addBaseTextureAt(resources[i].castToBaseTexture(), i) : resources[i] instanceof Resource ? this.addResourceAt(resources[i], i) : this.addResourceAt(autoDetectResource(resources[i], options), i));
  }
  /** Destroy this BaseImageResource. */
  dispose() {
    for (let i = 0, len = this.length; i < len; i++)
      this.items[i].destroy();
    this.items = null, this.itemDirtyIds = null, this._load = null;
  }
  /**
   * Set a resource by ID
   * @param resource
   * @param index - Zero-based index of resource to set
   * @returns - Instance for chaining
   */
  addResourceAt(resource, index) {
    if (!this.items[index])
      throw new Error(`Index ${index} is out of bounds`);
    return resource.valid && !this.valid && this.resize(resource.width, resource.height), this.items[index].setResource(resource), this;
  }
  /**
   * Set the parent base texture.
   * @param baseTexture
   */
  bind(baseTexture) {
    if (this.baseTexture !== null)
      throw new Error("Only one base texture per TextureArray is allowed");
    super.bind(baseTexture);
    for (let i = 0; i < this.length; i++)
      this.items[i].parentTextureArray = baseTexture, this.items[i].on("update", baseTexture.update, baseTexture);
  }
  /**
   * Unset the parent base texture.
   * @param baseTexture
   */
  unbind(baseTexture) {
    super.unbind(baseTexture);
    for (let i = 0; i < this.length; i++)
      this.items[i].parentTextureArray = null, this.items[i].off("update", baseTexture.update, baseTexture);
  }
  /**
   * Load all the resources simultaneously
   * @returns - When load is resolved
   */
  load() {
    if (this._load)
      return this._load;
    const promises = this.items.map((item) => item.resource).filter((item) => item).map((item) => item.load());
    return this._load = Promise.all(promises).then(
      () => {
        const { realWidth, realHeight } = this.items[0];
        return this.resize(realWidth, realHeight), this.update(), Promise.resolve(this);
      }
    ), this._load;
  }
}
export {
  AbstractMultiResource
};
//# sourceMappingURL=AbstractMultiResource.mjs.map
