import { TYPES, FORMATS, BufferResource } from "@pixi/core";
import { INTERNAL_FORMAT_TO_BYTES_PER_PIXEL } from "../const.mjs";
import "../resources/index.mjs";
import { CompressedTextureResource } from "../resources/CompressedTextureResource.mjs";
const FILE_IDENTIFIER = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10], ENDIANNESS = 67305985, KTX_FIELDS = {
  FILE_IDENTIFIER: 0,
  ENDIANNESS: 12,
  GL_TYPE: 16,
  GL_TYPE_SIZE: 20,
  GL_FORMAT: 24,
  GL_INTERNAL_FORMAT: 28,
  GL_BASE_INTERNAL_FORMAT: 32,
  PIXEL_WIDTH: 36,
  PIXEL_HEIGHT: 40,
  PIXEL_DEPTH: 44,
  NUMBER_OF_ARRAY_ELEMENTS: 48,
  NUMBER_OF_FACES: 52,
  NUMBER_OF_MIPMAP_LEVELS: 56,
  BYTES_OF_KEY_VALUE_DATA: 60
}, FILE_HEADER_SIZE = 64, TYPES_TO_BYTES_PER_COMPONENT = {
  [TYPES.UNSIGNED_BYTE]: 1,
  [TYPES.UNSIGNED_SHORT]: 2,
  [TYPES.INT]: 4,
  [TYPES.UNSIGNED_INT]: 4,
  [TYPES.FLOAT]: 4,
  [TYPES.HALF_FLOAT]: 8
}, FORMATS_TO_COMPONENTS = {
  [FORMATS.RGBA]: 4,
  [FORMATS.RGB]: 3,
  [FORMATS.RG]: 2,
  [FORMATS.RED]: 1,
  [FORMATS.LUMINANCE]: 1,
  [FORMATS.LUMINANCE_ALPHA]: 2,
  [FORMATS.ALPHA]: 1
}, TYPES_TO_BYTES_PER_PIXEL = {
  [TYPES.UNSIGNED_SHORT_4_4_4_4]: 2,
  [TYPES.UNSIGNED_SHORT_5_5_5_1]: 2,
  [TYPES.UNSIGNED_SHORT_5_6_5]: 2
};
function parseKTX(url, arrayBuffer, loadKeyValueData = !1) {
  const dataView = new DataView(arrayBuffer);
  if (!validate(url, dataView))
    return null;
  const littleEndian = dataView.getUint32(KTX_FIELDS.ENDIANNESS, !0) === ENDIANNESS, glType = dataView.getUint32(KTX_FIELDS.GL_TYPE, littleEndian), glFormat = dataView.getUint32(KTX_FIELDS.GL_FORMAT, littleEndian), glInternalFormat = dataView.getUint32(KTX_FIELDS.GL_INTERNAL_FORMAT, littleEndian), pixelWidth = dataView.getUint32(KTX_FIELDS.PIXEL_WIDTH, littleEndian), pixelHeight = dataView.getUint32(KTX_FIELDS.PIXEL_HEIGHT, littleEndian) || 1, pixelDepth = dataView.getUint32(KTX_FIELDS.PIXEL_DEPTH, littleEndian) || 1, numberOfArrayElements = dataView.getUint32(KTX_FIELDS.NUMBER_OF_ARRAY_ELEMENTS, littleEndian) || 1, numberOfFaces = dataView.getUint32(KTX_FIELDS.NUMBER_OF_FACES, littleEndian), numberOfMipmapLevels = dataView.getUint32(KTX_FIELDS.NUMBER_OF_MIPMAP_LEVELS, littleEndian), bytesOfKeyValueData = dataView.getUint32(KTX_FIELDS.BYTES_OF_KEY_VALUE_DATA, littleEndian);
  if (pixelHeight === 0 || pixelDepth !== 1)
    throw new Error("Only 2D textures are supported");
  if (numberOfFaces !== 1)
    throw new Error("CubeTextures are not supported by KTXLoader yet!");
  if (numberOfArrayElements !== 1)
    throw new Error("WebGL does not support array textures");
  const blockWidth = 4, blockHeight = 4, alignedWidth = pixelWidth + 3 & -4, alignedHeight = pixelHeight + 3 & -4, imageBuffers = new Array(numberOfArrayElements);
  let imagePixels = pixelWidth * pixelHeight;
  glType === 0 && (imagePixels = alignedWidth * alignedHeight);
  let imagePixelByteSize;
  if (glType !== 0 ? TYPES_TO_BYTES_PER_COMPONENT[glType] ? imagePixelByteSize = TYPES_TO_BYTES_PER_COMPONENT[glType] * FORMATS_TO_COMPONENTS[glFormat] : imagePixelByteSize = TYPES_TO_BYTES_PER_PIXEL[glType] : imagePixelByteSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[glInternalFormat], imagePixelByteSize === void 0)
    throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  const kvData = loadKeyValueData ? parseKvData(dataView, bytesOfKeyValueData, littleEndian) : null;
  let mipByteSize = imagePixels * imagePixelByteSize, mipWidth = pixelWidth, mipHeight = pixelHeight, alignedMipWidth = alignedWidth, alignedMipHeight = alignedHeight, imageOffset = FILE_HEADER_SIZE + bytesOfKeyValueData;
  for (let mipmapLevel = 0; mipmapLevel < numberOfMipmapLevels; mipmapLevel++) {
    const imageSize = dataView.getUint32(imageOffset, littleEndian);
    let elementOffset = imageOffset + 4;
    for (let arrayElement = 0; arrayElement < numberOfArrayElements; arrayElement++) {
      let mips = imageBuffers[arrayElement];
      mips || (mips = imageBuffers[arrayElement] = new Array(numberOfMipmapLevels)), mips[mipmapLevel] = {
        levelID: mipmapLevel,
        // don't align mipWidth when texture not compressed! (glType not zero)
        levelWidth: numberOfMipmapLevels > 1 || glType !== 0 ? mipWidth : alignedMipWidth,
        levelHeight: numberOfMipmapLevels > 1 || glType !== 0 ? mipHeight : alignedMipHeight,
        levelBuffer: new Uint8Array(arrayBuffer, elementOffset, mipByteSize)
      }, elementOffset += mipByteSize;
    }
    imageOffset += imageSize + 4, imageOffset = imageOffset % 4 !== 0 ? imageOffset + 4 - imageOffset % 4 : imageOffset, mipWidth = mipWidth >> 1 || 1, mipHeight = mipHeight >> 1 || 1, alignedMipWidth = mipWidth + blockWidth - 1 & ~(blockWidth - 1), alignedMipHeight = mipHeight + blockHeight - 1 & ~(blockHeight - 1), mipByteSize = alignedMipWidth * alignedMipHeight * imagePixelByteSize;
  }
  return glType !== 0 ? {
    uncompressed: imageBuffers.map((levelBuffers) => {
      let buffer = levelBuffers[0].levelBuffer, convertToInt = !1;
      return glType === TYPES.FLOAT ? buffer = new Float32Array(
        levelBuffers[0].levelBuffer.buffer,
        levelBuffers[0].levelBuffer.byteOffset,
        levelBuffers[0].levelBuffer.byteLength / 4
      ) : glType === TYPES.UNSIGNED_INT ? (convertToInt = !0, buffer = new Uint32Array(
        levelBuffers[0].levelBuffer.buffer,
        levelBuffers[0].levelBuffer.byteOffset,
        levelBuffers[0].levelBuffer.byteLength / 4
      )) : glType === TYPES.INT && (convertToInt = !0, buffer = new Int32Array(
        levelBuffers[0].levelBuffer.buffer,
        levelBuffers[0].levelBuffer.byteOffset,
        levelBuffers[0].levelBuffer.byteLength / 4
      )), {
        resource: new BufferResource(
          buffer,
          {
            width: levelBuffers[0].levelWidth,
            height: levelBuffers[0].levelHeight
          }
        ),
        type: glType,
        format: convertToInt ? convertFormatToInteger(glFormat) : glFormat
      };
    }),
    kvData
  } : {
    compressed: imageBuffers.map((levelBuffers) => new CompressedTextureResource(null, {
      format: glInternalFormat,
      width: pixelWidth,
      height: pixelHeight,
      levels: numberOfMipmapLevels,
      levelBuffers
    })),
    kvData
  };
}
function validate(url, dataView) {
  for (let i = 0; i < FILE_IDENTIFIER.length; i++)
    if (dataView.getUint8(i) !== FILE_IDENTIFIER[i])
      return console.error(`${url} is not a valid *.ktx file!`), !1;
  return !0;
}
function convertFormatToInteger(format) {
  switch (format) {
    case FORMATS.RGBA:
      return FORMATS.RGBA_INTEGER;
    case FORMATS.RGB:
      return FORMATS.RGB_INTEGER;
    case FORMATS.RG:
      return FORMATS.RG_INTEGER;
    case FORMATS.RED:
      return FORMATS.RED_INTEGER;
    default:
      return format;
  }
}
function parseKvData(dataView, bytesOfKeyValueData, littleEndian) {
  const kvData = /* @__PURE__ */ new Map();
  let bytesIntoKeyValueData = 0;
  for (; bytesIntoKeyValueData < bytesOfKeyValueData; ) {
    const keyAndValueByteSize = dataView.getUint32(FILE_HEADER_SIZE + bytesIntoKeyValueData, littleEndian), keyAndValueByteOffset = FILE_HEADER_SIZE + bytesIntoKeyValueData + 4, valuePadding = 3 - (keyAndValueByteSize + 3) % 4;
    if (keyAndValueByteSize === 0 || keyAndValueByteSize > bytesOfKeyValueData - bytesIntoKeyValueData) {
      console.error("KTXLoader: keyAndValueByteSize out of bounds");
      break;
    }
    let keyNulByte = 0;
    for (; keyNulByte < keyAndValueByteSize && dataView.getUint8(keyAndValueByteOffset + keyNulByte) !== 0; keyNulByte++)
      ;
    if (keyNulByte === -1) {
      console.error("KTXLoader: Failed to find null byte terminating kvData key");
      break;
    }
    const key = new TextDecoder().decode(
      new Uint8Array(dataView.buffer, keyAndValueByteOffset, keyNulByte)
    ), value = new DataView(
      dataView.buffer,
      keyAndValueByteOffset + keyNulByte + 1,
      keyAndValueByteSize - keyNulByte - 1
    );
    kvData.set(key, value), bytesIntoKeyValueData += 4 + keyAndValueByteSize + valuePadding;
  }
  return kvData;
}
export {
  FORMATS_TO_COMPONENTS,
  TYPES_TO_BYTES_PER_COMPONENT,
  TYPES_TO_BYTES_PER_PIXEL,
  parseKTX
};
//# sourceMappingURL=parseKTX.mjs.map
