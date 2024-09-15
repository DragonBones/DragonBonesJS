import { TARGETS } from "@pixi/constants";
import { AbstractMultiResource } from "./AbstractMultiResource.mjs";
const _CubeResource = class _CubeResource2 extends AbstractMultiResource {
  /**
   * @param {Array<string|PIXI.Resource>} [source] - Collection of URLs or resources
   *        to use as the sides of the cube.
   * @param options - ImageResource options
   * @param {number} [options.width] - Width of resource
   * @param {number} [options.height] - Height of resource
   * @param {number} [options.autoLoad=true] - Whether to auto-load resources
   * @param {number} [options.linkBaseTexture=true] - In case BaseTextures are supplied,
   *   whether to copy them or use
   */
  constructor(source, options) {
    const { width, height, autoLoad, linkBaseTexture } = options || {};
    if (source && source.length !== _CubeResource2.SIDES)
      throw new Error(`Invalid length. Got ${source.length}, expected 6`);
    super(6, { width, height });
    for (let i = 0; i < _CubeResource2.SIDES; i++)
      this.items[i].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i;
    this.linkBaseTexture = linkBaseTexture !== !1, source && this.initFromArray(source, options), autoLoad !== !1 && this.load();
  }
  /**
   * Add binding.
   * @param baseTexture - parent base texture
   */
  bind(baseTexture) {
    super.bind(baseTexture), baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
  }
  addBaseTextureAt(baseTexture, index, linkBaseTexture) {
    if (linkBaseTexture === void 0 && (linkBaseTexture = this.linkBaseTexture), !this.items[index])
      throw new Error(`Index ${index} is out of bounds`);
    if (!this.linkBaseTexture || baseTexture.parentTextureArray || Object.keys(baseTexture._glTextures).length > 0)
      if (baseTexture.resource)
        this.addResourceAt(baseTexture.resource, index);
      else
        throw new Error("CubeResource does not support copying of renderTexture.");
    else
      baseTexture.target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index, baseTexture.parentTextureArray = this.baseTexture, this.items[index] = baseTexture;
    return baseTexture.valid && !this.valid && this.resize(baseTexture.realWidth, baseTexture.realHeight), this.items[index] = baseTexture, this;
  }
  /**
   * Upload the resource
   * @param renderer
   * @param _baseTexture
   * @param glTexture
   * @returns {boolean} true is success
   */
  upload(renderer, _baseTexture, glTexture) {
    const dirty = this.itemDirtyIds;
    for (let i = 0; i < _CubeResource2.SIDES; i++) {
      const side = this.items[i];
      (dirty[i] < side.dirtyId || glTexture.dirtyId < _baseTexture.dirtyId) && (side.valid && side.resource ? (side.resource.upload(renderer, side, glTexture), dirty[i] = side.dirtyId) : dirty[i] < -1 && (renderer.gl.texImage2D(
        side.target,
        0,
        glTexture.internalFormat,
        _baseTexture.realWidth,
        _baseTexture.realHeight,
        0,
        _baseTexture.format,
        glTexture.type,
        null
      ), dirty[i] = -1));
    }
    return !0;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if source is an array of 6 elements
   */
  static test(source) {
    return Array.isArray(source) && source.length === _CubeResource2.SIDES;
  }
};
_CubeResource.SIDES = 6;
let CubeResource = _CubeResource;
export {
  CubeResource
};
//# sourceMappingURL=CubeResource.mjs.map
