"use strict";
var _const = require("../const.js");
require("../resources/index.js");
var CompressedTextureResource = require("../resources/CompressedTextureResource.js");
const DDS_MAGIC_SIZE = 4, DDS_HEADER_SIZE = 124, DDS_HEADER_PF_SIZE = 32, DDS_HEADER_DX10_SIZE = 20, DDS_MAGIC = 542327876, DDS_FIELDS = {
  SIZE: 1,
  FLAGS: 2,
  HEIGHT: 3,
  WIDTH: 4,
  MIPMAP_COUNT: 7,
  PIXEL_FORMAT: 19
}, DDS_PF_FIELDS = {
  SIZE: 0,
  FLAGS: 1,
  FOURCC: 2,
  RGB_BITCOUNT: 3,
  R_BIT_MASK: 4,
  G_BIT_MASK: 5,
  B_BIT_MASK: 6,
  A_BIT_MASK: 7
}, DDS_DX10_FIELDS = {
  DXGI_FORMAT: 0,
  RESOURCE_DIMENSION: 1,
  MISC_FLAG: 2,
  ARRAY_SIZE: 3,
  MISC_FLAGS2: 4
}, PF_FLAGS = 1, DDPF_ALPHA = 2, DDPF_FOURCC = 4, DDPF_RGB = 64, DDPF_YUV = 512, DDPF_LUMINANCE = 131072, FOURCC_DXT1 = 827611204, FOURCC_DXT3 = 861165636, FOURCC_DXT5 = 894720068, FOURCC_DX10 = 808540228, DDS_RESOURCE_MISC_TEXTURECUBE = 4, FOURCC_TO_FORMAT = {
  [FOURCC_DXT1]: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  [FOURCC_DXT3]: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  [FOURCC_DXT5]: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT
}, DXGI_TO_FORMAT = {
  // WEBGL_compressed_texture_s3tc
  70: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  71: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  73: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  74: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  76: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
  77: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
  // WEBGL_compressed_texture_s3tc_srgb
  72: _const.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
  75: _const.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
  78: _const.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT,
  // EXT_texture_compression_bptc
  // BC6H
  96: _const.INTERNAL_FORMATS.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
  95: _const.INTERNAL_FORMATS.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT,
  // BC7
  98: _const.INTERNAL_FORMATS.COMPRESSED_RGBA_BPTC_UNORM_EXT,
  99: _const.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
};
function parseDDS(arrayBuffer) {
  const data = new Uint32Array(arrayBuffer);
  if (data[0] !== DDS_MAGIC)
    throw new Error("Invalid DDS file magic word");
  const header = new Uint32Array(arrayBuffer, 0, DDS_HEADER_SIZE / Uint32Array.BYTES_PER_ELEMENT), height = header[DDS_FIELDS.HEIGHT], width = header[DDS_FIELDS.WIDTH], mipmapCount = header[DDS_FIELDS.MIPMAP_COUNT], pixelFormat = new Uint32Array(
    arrayBuffer,
    DDS_FIELDS.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT,
    DDS_HEADER_PF_SIZE / Uint32Array.BYTES_PER_ELEMENT
  ), formatFlags = pixelFormat[PF_FLAGS];
  if (formatFlags & DDPF_FOURCC) {
    const fourCC = pixelFormat[DDS_PF_FIELDS.FOURCC];
    if (fourCC !== FOURCC_DX10) {
      const internalFormat2 = FOURCC_TO_FORMAT[fourCC], dataOffset2 = DDS_MAGIC_SIZE + DDS_HEADER_SIZE, texData = new Uint8Array(arrayBuffer, dataOffset2);
      return [new CompressedTextureResource.CompressedTextureResource(texData, {
        format: internalFormat2,
        width,
        height,
        levels: mipmapCount
        // CompressedTextureResource will separate the levelBuffers for us!
      })];
    }
    const dx10Offset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE, dx10Header = new Uint32Array(
      data.buffer,
      dx10Offset,
      DDS_HEADER_DX10_SIZE / Uint32Array.BYTES_PER_ELEMENT
    ), dxgiFormat = dx10Header[DDS_DX10_FIELDS.DXGI_FORMAT], resourceDimension = dx10Header[DDS_DX10_FIELDS.RESOURCE_DIMENSION], miscFlag = dx10Header[DDS_DX10_FIELDS.MISC_FLAG], arraySize = dx10Header[DDS_DX10_FIELDS.ARRAY_SIZE], internalFormat = DXGI_TO_FORMAT[dxgiFormat];
    if (internalFormat === void 0)
      throw new Error(`DDSParser cannot parse texture data with DXGI format ${dxgiFormat}`);
    if (miscFlag === DDS_RESOURCE_MISC_TEXTURECUBE)
      throw new Error("DDSParser does not support cubemap textures");
    if (resourceDimension === 6)
      throw new Error("DDSParser does not supported 3D texture data");
    const imageBuffers = new Array(), dataOffset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE + DDS_HEADER_DX10_SIZE;
    if (arraySize === 1)
      imageBuffers.push(new Uint8Array(arrayBuffer, dataOffset));
    else {
      const pixelSize = _const.INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[internalFormat];
      let imageSize = 0, levelWidth = width, levelHeight = height;
      for (let i = 0; i < mipmapCount; i++) {
        const alignedLevelWidth = Math.max(1, levelWidth + 3 & -4), alignedLevelHeight = Math.max(1, levelHeight + 3 & -4), levelSize = alignedLevelWidth * alignedLevelHeight * pixelSize;
        imageSize += levelSize, levelWidth = levelWidth >>> 1, levelHeight = levelHeight >>> 1;
      }
      let imageOffset = dataOffset;
      for (let i = 0; i < arraySize; i++)
        imageBuffers.push(new Uint8Array(arrayBuffer, imageOffset, imageSize)), imageOffset += imageSize;
    }
    return imageBuffers.map((buffer) => new CompressedTextureResource.CompressedTextureResource(buffer, {
      format: internalFormat,
      width,
      height,
      levels: mipmapCount
    }));
  }
  throw formatFlags & DDPF_RGB ? new Error("DDSParser does not support uncompressed texture data.") : formatFlags & DDPF_YUV ? new Error("DDSParser does not supported YUV uncompressed texture data.") : formatFlags & DDPF_LUMINANCE ? new Error("DDSParser does not support single-channel (lumninance) texture data!") : formatFlags & DDPF_ALPHA ? new Error("DDSParser does not support single-channel (alpha) texture data!") : new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
exports.parseDDS = parseDDS;
//# sourceMappingURL=parseDDS.js.map
