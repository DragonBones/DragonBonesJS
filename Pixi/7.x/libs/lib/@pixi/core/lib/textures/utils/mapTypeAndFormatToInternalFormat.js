"use strict";
var constants = require("@pixi/constants");
function mapTypeAndFormatToInternalFormat(gl) {
  let table;
  return "WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext ? table = {
    [constants.TYPES.UNSIGNED_BYTE]: {
      [constants.FORMATS.RGBA]: gl.RGBA8,
      [constants.FORMATS.RGB]: gl.RGB8,
      [constants.FORMATS.RG]: gl.RG8,
      [constants.FORMATS.RED]: gl.R8,
      [constants.FORMATS.RGBA_INTEGER]: gl.RGBA8UI,
      [constants.FORMATS.RGB_INTEGER]: gl.RGB8UI,
      [constants.FORMATS.RG_INTEGER]: gl.RG8UI,
      [constants.FORMATS.RED_INTEGER]: gl.R8UI,
      [constants.FORMATS.ALPHA]: gl.ALPHA,
      [constants.FORMATS.LUMINANCE]: gl.LUMINANCE,
      [constants.FORMATS.LUMINANCE_ALPHA]: gl.LUMINANCE_ALPHA
    },
    [constants.TYPES.BYTE]: {
      [constants.FORMATS.RGBA]: gl.RGBA8_SNORM,
      [constants.FORMATS.RGB]: gl.RGB8_SNORM,
      [constants.FORMATS.RG]: gl.RG8_SNORM,
      [constants.FORMATS.RED]: gl.R8_SNORM,
      [constants.FORMATS.RGBA_INTEGER]: gl.RGBA8I,
      [constants.FORMATS.RGB_INTEGER]: gl.RGB8I,
      [constants.FORMATS.RG_INTEGER]: gl.RG8I,
      [constants.FORMATS.RED_INTEGER]: gl.R8I
    },
    [constants.TYPES.UNSIGNED_SHORT]: {
      [constants.FORMATS.RGBA_INTEGER]: gl.RGBA16UI,
      [constants.FORMATS.RGB_INTEGER]: gl.RGB16UI,
      [constants.FORMATS.RG_INTEGER]: gl.RG16UI,
      [constants.FORMATS.RED_INTEGER]: gl.R16UI,
      [constants.FORMATS.DEPTH_COMPONENT]: gl.DEPTH_COMPONENT16
    },
    [constants.TYPES.SHORT]: {
      [constants.FORMATS.RGBA_INTEGER]: gl.RGBA16I,
      [constants.FORMATS.RGB_INTEGER]: gl.RGB16I,
      [constants.FORMATS.RG_INTEGER]: gl.RG16I,
      [constants.FORMATS.RED_INTEGER]: gl.R16I
    },
    [constants.TYPES.UNSIGNED_INT]: {
      [constants.FORMATS.RGBA_INTEGER]: gl.RGBA32UI,
      [constants.FORMATS.RGB_INTEGER]: gl.RGB32UI,
      [constants.FORMATS.RG_INTEGER]: gl.RG32UI,
      [constants.FORMATS.RED_INTEGER]: gl.R32UI,
      [constants.FORMATS.DEPTH_COMPONENT]: gl.DEPTH_COMPONENT24
    },
    [constants.TYPES.INT]: {
      [constants.FORMATS.RGBA_INTEGER]: gl.RGBA32I,
      [constants.FORMATS.RGB_INTEGER]: gl.RGB32I,
      [constants.FORMATS.RG_INTEGER]: gl.RG32I,
      [constants.FORMATS.RED_INTEGER]: gl.R32I
    },
    [constants.TYPES.FLOAT]: {
      [constants.FORMATS.RGBA]: gl.RGBA32F,
      [constants.FORMATS.RGB]: gl.RGB32F,
      [constants.FORMATS.RG]: gl.RG32F,
      [constants.FORMATS.RED]: gl.R32F,
      [constants.FORMATS.DEPTH_COMPONENT]: gl.DEPTH_COMPONENT32F
    },
    [constants.TYPES.HALF_FLOAT]: {
      [constants.FORMATS.RGBA]: gl.RGBA16F,
      [constants.FORMATS.RGB]: gl.RGB16F,
      [constants.FORMATS.RG]: gl.RG16F,
      [constants.FORMATS.RED]: gl.R16F
    },
    [constants.TYPES.UNSIGNED_SHORT_5_6_5]: {
      [constants.FORMATS.RGB]: gl.RGB565
    },
    [constants.TYPES.UNSIGNED_SHORT_4_4_4_4]: {
      [constants.FORMATS.RGBA]: gl.RGBA4
    },
    [constants.TYPES.UNSIGNED_SHORT_5_5_5_1]: {
      [constants.FORMATS.RGBA]: gl.RGB5_A1
    },
    [constants.TYPES.UNSIGNED_INT_2_10_10_10_REV]: {
      [constants.FORMATS.RGBA]: gl.RGB10_A2,
      [constants.FORMATS.RGBA_INTEGER]: gl.RGB10_A2UI
    },
    [constants.TYPES.UNSIGNED_INT_10F_11F_11F_REV]: {
      [constants.FORMATS.RGB]: gl.R11F_G11F_B10F
    },
    [constants.TYPES.UNSIGNED_INT_5_9_9_9_REV]: {
      [constants.FORMATS.RGB]: gl.RGB9_E5
    },
    [constants.TYPES.UNSIGNED_INT_24_8]: {
      [constants.FORMATS.DEPTH_STENCIL]: gl.DEPTH24_STENCIL8
    },
    [constants.TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV]: {
      [constants.FORMATS.DEPTH_STENCIL]: gl.DEPTH32F_STENCIL8
    }
  } : table = {
    [constants.TYPES.UNSIGNED_BYTE]: {
      [constants.FORMATS.RGBA]: gl.RGBA,
      [constants.FORMATS.RGB]: gl.RGB,
      [constants.FORMATS.ALPHA]: gl.ALPHA,
      [constants.FORMATS.LUMINANCE]: gl.LUMINANCE,
      [constants.FORMATS.LUMINANCE_ALPHA]: gl.LUMINANCE_ALPHA
    },
    [constants.TYPES.UNSIGNED_SHORT_5_6_5]: {
      [constants.FORMATS.RGB]: gl.RGB
    },
    [constants.TYPES.UNSIGNED_SHORT_4_4_4_4]: {
      [constants.FORMATS.RGBA]: gl.RGBA
    },
    [constants.TYPES.UNSIGNED_SHORT_5_5_5_1]: {
      [constants.FORMATS.RGBA]: gl.RGBA
    }
  }, table;
}
exports.mapTypeAndFormatToInternalFormat = mapTypeAndFormatToInternalFormat;
//# sourceMappingURL=mapTypeAndFormatToInternalFormat.js.map
