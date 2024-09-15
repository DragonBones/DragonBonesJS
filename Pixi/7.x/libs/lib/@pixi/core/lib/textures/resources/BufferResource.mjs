import { ALPHA_MODES } from "@pixi/constants";
import { Resource } from "./Resource.mjs";
class BufferResource extends Resource {
  /**
   * @param source - Source buffer
   * @param options - Options
   * @param {number} options.width - Width of the texture
   * @param {number} options.height - Height of the texture
   * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
   */
  constructor(source, options) {
    const { width, height } = options || {};
    if (!width || !height)
      throw new Error("BufferResource width or height invalid");
    super(width, height), this.data = source, this.unpackAlignment = options.unpackAlignment ?? 4;
  }
  /**
   * Upload the texture to the GPU.
   * @param renderer - Upload to the renderer
   * @param baseTexture - Reference to parent texture
   * @param glTexture - glTexture
   * @returns - true is success
   */
  upload(renderer, baseTexture, glTexture) {
    const gl = renderer.gl;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment), gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    const width = baseTexture.realWidth, height = baseTexture.realHeight;
    return glTexture.width === width && glTexture.height === height ? gl.texSubImage2D(
      baseTexture.target,
      0,
      0,
      0,
      width,
      height,
      baseTexture.format,
      glTexture.type,
      this.data
    ) : (glTexture.width = width, glTexture.height = height, gl.texImage2D(
      baseTexture.target,
      0,
      glTexture.internalFormat,
      width,
      height,
      0,
      baseTexture.format,
      glTexture.type,
      this.data
    )), !0;
  }
  /** Destroy and don't use after this. */
  dispose() {
    this.data = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if buffer source
   */
  static test(source) {
    return source === null || source instanceof Int8Array || source instanceof Uint8Array || source instanceof Uint8ClampedArray || source instanceof Int16Array || source instanceof Uint16Array || source instanceof Int32Array || source instanceof Uint32Array || source instanceof Float32Array;
  }
}
export {
  BufferResource
};
//# sourceMappingURL=BufferResource.mjs.map
