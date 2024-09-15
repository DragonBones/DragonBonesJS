"use strict";
require("./settings.js");
var settings = require("@pixi/settings"), eventemitter3 = require("eventemitter3"), earcut = require("earcut"), url = require("./url.js"), path = require("./path.js"), detectVideoAlphaMode = require("./browser/detectVideoAlphaMode.js"), hello = require("./browser/hello.js"), isWebGLSupported = require("./browser/isWebGLSupported.js"), hex = require("./color/hex.js"), premultiply = require("./color/premultiply.js"), _const = require("./const.js"), createIndicesForQuads = require("./data/createIndicesForQuads.js"), getBufferType = require("./data/getBufferType.js"), interleaveTypedArrays = require("./data/interleaveTypedArrays.js"), pow2 = require("./data/pow2.js"), removeItems = require("./data/removeItems.js"), sign = require("./data/sign.js"), uid = require("./data/uid.js"), deprecation = require("./logging/deprecation.js"), BoundingBox = require("./media/BoundingBox.js"), caches = require("./media/caches.js"), CanvasRenderTarget = require("./media/CanvasRenderTarget.js"), getCanvasBoundingBox = require("./media/getCanvasBoundingBox.js"), trimCanvas = require("./media/trimCanvas.js"), decomposeDataUri = require("./network/decomposeDataUri.js"), determineCrossOrigin = require("./network/determineCrossOrigin.js"), getResolutionOfUrl = require("./network/getResolutionOfUrl.js");
require("./types/index.js");
Object.defineProperty(exports, "isMobile", {
  enumerable: !0,
  get: function() {
    return settings.isMobile;
  }
});
exports.EventEmitter = eventemitter3;
exports.earcut = earcut;
exports.url = url.url;
exports.path = path.path;
exports.detectVideoAlphaMode = detectVideoAlphaMode.detectVideoAlphaMode;
exports.sayHello = hello.sayHello;
exports.skipHello = hello.skipHello;
exports.isWebGLSupported = isWebGLSupported.isWebGLSupported;
exports.hex2rgb = hex.hex2rgb;
exports.hex2string = hex.hex2string;
exports.rgb2hex = hex.rgb2hex;
exports.string2hex = hex.string2hex;
exports.correctBlendMode = premultiply.correctBlendMode;
exports.premultiplyBlendMode = premultiply.premultiplyBlendMode;
exports.premultiplyRgba = premultiply.premultiplyRgba;
exports.premultiplyTint = premultiply.premultiplyTint;
exports.premultiplyTintToRgba = premultiply.premultiplyTintToRgba;
exports.DATA_URI = _const.DATA_URI;
exports.createIndicesForQuads = createIndicesForQuads.createIndicesForQuads;
exports.getBufferType = getBufferType.getBufferType;
exports.interleaveTypedArrays = interleaveTypedArrays.interleaveTypedArrays;
exports.isPow2 = pow2.isPow2;
exports.log2 = pow2.log2;
exports.nextPow2 = pow2.nextPow2;
exports.removeItems = removeItems.removeItems;
exports.sign = sign.sign;
exports.uid = uid.uid;
exports.deprecation = deprecation.deprecation;
exports.BoundingBox = BoundingBox.BoundingBox;
exports.BaseTextureCache = caches.BaseTextureCache;
exports.ProgramCache = caches.ProgramCache;
exports.TextureCache = caches.TextureCache;
exports.clearTextureCache = caches.clearTextureCache;
exports.destroyTextureCache = caches.destroyTextureCache;
exports.CanvasRenderTarget = CanvasRenderTarget.CanvasRenderTarget;
exports.getCanvasBoundingBox = getCanvasBoundingBox.getCanvasBoundingBox;
exports.trimCanvas = trimCanvas.trimCanvas;
exports.decomposeDataUri = decomposeDataUri.decomposeDataUri;
exports.determineCrossOrigin = determineCrossOrigin.determineCrossOrigin;
exports.getResolutionOfUrl = getResolutionOfUrl.getResolutionOfUrl;
//# sourceMappingURL=index.js.map
