import { INTERNAL_FORMAT_TO_BYTES_PER_PIXEL } from "../const.mjs";
import { BlobResource } from "./BlobResource.mjs";
class CompressedTextureResource extends BlobResource {
  /**
   * @param source - the buffer/URL holding the compressed texture data
   * @param options
   * @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
   * @param {number} options.width - the image width in pixels.
   * @param {number} options.height - the image height in pixels.
   * @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
   * @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
   *      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
   */
  constructor(source, options) {
    super(source, options), this.format = options.format, this.levels = options.levels || 1, this._width = options.width, this._height = options.height, this._extension = CompressedTextureResource._formatToExtension(this.format), (options.levelBuffers || this.buffer) && (this._levelBuffers = options.levelBuffers || CompressedTextureResource._createLevelBuffers(
      source instanceof Uint8Array ? source : this.buffer.uint8View,
      this.format,
      this.levels,
      4,
      4,
      // PVRTC has 8x4 blocks in 2bpp mode
      this.width,
      this.height
    ));
  }
  /**
   * @override
   * @param renderer - A reference to the current renderer
   * @param _texture - the texture
   * @param _glTexture - texture instance for this webgl context
   */
  upload(renderer, _texture, _glTexture) {
    const gl = renderer.gl;
    if (!renderer.context.extensions[this._extension])
      throw new Error(`${this._extension} textures are not supported on the current machine`);
    if (!this._levelBuffers)
      return !1;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    for (let i = 0, j = this.levels; i < j; i++) {
      const { levelID, levelWidth, levelHeight, levelBuffer } = this._levelBuffers[i];
      gl.compressedTexImage2D(gl.TEXTURE_2D, levelID, this.format, levelWidth, levelHeight, 0, levelBuffer);
    }
    return !0;
  }
  /** @protected */
  onBlobLoaded() {
    this._levelBuffers = CompressedTextureResource._createLevelBuffers(
      this.buffer.uint8View,
      this.format,
      this.levels,
      4,
      4,
      // PVRTC has 8x4 blocks in 2bpp mode
      this.width,
      this.height
    );
  }
  /**
   * Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
   * @private
   * @param format - the compression format to get the extension for.
   */
  static _formatToExtension(format) {
    if (format >= 33776 && format <= 33779)
      return "s3tc";
    if (format >= 35916 && format <= 35919)
      return "s3tc_sRGB";
    if (format >= 37488 && format <= 37497)
      return "etc";
    if (format >= 35840 && format <= 35843)
      return "pvrtc";
    if (format === 36196)
      return "etc1";
    if (format === 35986 || format === 35987 || format === 34798)
      return "atc";
    if (format >= 36492 && format <= 36495)
      return "bptc";
    if (format === 37808)
      return "astc";
    throw new Error(`Invalid (compressed) texture format given: ${format}`);
  }
  /**
   * Pre-creates buffer views for each mipmap level
   * @private
   * @param buffer -
   * @param format - compression formats
   * @param levels - mipmap levels
   * @param blockWidth -
   * @param blockHeight -
   * @param imageWidth - width of the image in pixels
   * @param imageHeight - height of the image in pixels
   */
  static _createLevelBuffers(buffer, format, levels, blockWidth, blockHeight, imageWidth, imageHeight) {
    const buffers = new Array(levels);
    let offset = buffer.byteOffset, levelWidth = imageWidth, levelHeight = imageHeight, alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1), alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1), levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
    for (let i = 0; i < levels; i++)
      buffers[i] = {
        levelID: i,
        levelWidth: levels > 1 ? levelWidth : alignedLevelWidth,
        levelHeight: levels > 1 ? levelHeight : alignedLevelHeight,
        levelBuffer: new Uint8Array(buffer.buffer, offset, levelSize)
      }, offset += levelSize, levelWidth = levelWidth >> 1 || 1, levelHeight = levelHeight >> 1 || 1, alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1), alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1), levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
    return buffers;
  }
}
export {
  CompressedTextureResource
};
//# sourceMappingURL=CompressedTextureResource.mjs.map
