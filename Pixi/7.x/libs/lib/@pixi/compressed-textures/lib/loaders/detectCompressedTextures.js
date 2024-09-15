"use strict";
var core = require("@pixi/core");
let storedGl, extensions;
function getCompressedTextureExtensions() {
  extensions = {
    bptc: storedGl.getExtension("EXT_texture_compression_bptc"),
    astc: storedGl.getExtension("WEBGL_compressed_texture_astc"),
    etc: storedGl.getExtension("WEBGL_compressed_texture_etc"),
    s3tc: storedGl.getExtension("WEBGL_compressed_texture_s3tc"),
    s3tc_sRGB: storedGl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
    /* eslint-disable-line camelcase */
    pvrtc: storedGl.getExtension("WEBGL_compressed_texture_pvrtc") || storedGl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
    etc1: storedGl.getExtension("WEBGL_compressed_texture_etc1"),
    atc: storedGl.getExtension("WEBGL_compressed_texture_atc")
  };
}
const detectCompressedTextures = {
  extension: {
    type: core.ExtensionType.DetectionParser,
    priority: 2
  },
  test: async () => {
    const gl = core.settings.ADAPTER.createCanvas().getContext("webgl");
    return gl ? (storedGl = gl, !0) : (console.warn("WebGL not available for compressed textures."), !1);
  },
  add: async (formats) => {
    extensions || getCompressedTextureExtensions();
    const textureFormats = [];
    for (const extensionName in extensions)
      extensions[extensionName] && textureFormats.push(extensionName);
    return [...textureFormats, ...formats];
  },
  remove: async (formats) => (extensions || getCompressedTextureExtensions(), formats.filter((f) => !(f in extensions)))
};
core.extensions.add(detectCompressedTextures);
exports.detectCompressedTextures = detectCompressedTextures;
//# sourceMappingURL=detectCompressedTextures.js.map
