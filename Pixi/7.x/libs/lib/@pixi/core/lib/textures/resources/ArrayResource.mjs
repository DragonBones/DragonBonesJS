import { TARGETS } from "@pixi/constants";
import { AbstractMultiResource } from "./AbstractMultiResource.mjs";
class ArrayResource extends AbstractMultiResource {
  /**
   * @param source - Number of items in array or the collection
   *        of image URLs to use. Can also be resources, image elements, canvas, etc.
   * @param options - Options to apply to {@link PIXI.autoDetectResource}
   * @param {number} [options.width] - Width of the resource
   * @param {number} [options.height] - Height of the resource
   */
  constructor(source, options) {
    const { width, height } = options || {};
    let urls, length;
    Array.isArray(source) ? (urls = source, length = source.length) : length = source, super(length, { width, height }), urls && this.initFromArray(urls, options);
  }
  /**
   * Set a baseTexture by ID,
   * ArrayResource just takes resource from it, nothing more
   * @param baseTexture
   * @param index - Zero-based index of resource to set
   * @returns - Instance for chaining
   */
  addBaseTextureAt(baseTexture, index) {
    if (baseTexture.resource)
      this.addResourceAt(baseTexture.resource, index);
    else
      throw new Error("ArrayResource does not support RenderTexture");
    return this;
  }
  /**
   * Add binding
   * @param baseTexture
   */
  bind(baseTexture) {
    super.bind(baseTexture), baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;
  }
  /**
   * Upload the resources to the GPU.
   * @param renderer
   * @param texture
   * @param glTexture
   * @returns - whether texture was uploaded
   */
  upload(renderer, texture, glTexture) {
    const { length, itemDirtyIds, items } = this, { gl } = renderer;
    glTexture.dirtyId < 0 && gl.texImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      glTexture.internalFormat,
      this._width,
      this._height,
      length,
      0,
      texture.format,
      glTexture.type,
      null
    );
    for (let i = 0; i < length; i++) {
      const item = items[i];
      itemDirtyIds[i] < item.dirtyId && (itemDirtyIds[i] = item.dirtyId, item.valid && gl.texSubImage3D(
        gl.TEXTURE_2D_ARRAY,
        0,
        0,
        // xoffset
        0,
        // yoffset
        i,
        // zoffset
        item.resource.width,
        item.resource.height,
        1,
        texture.format,
        glTexture.type,
        item.resource.source
      ));
    }
    return !0;
  }
}
export {
  ArrayResource
};
//# sourceMappingURL=ArrayResource.mjs.map
