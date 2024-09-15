"use strict";
var constants = require("@pixi/constants"), settings = require("@pixi/settings");
const unknownContext = {};
let context = unknownContext;
function getTestContext() {
  if (context === unknownContext || context?.isContextLost()) {
    const canvas = settings.settings.ADAPTER.createCanvas();
    let gl;
    settings.settings.PREFER_ENV >= constants.ENV.WEBGL2 && (gl = canvas.getContext("webgl2", {})), gl || (gl = canvas.getContext("webgl", {}) || canvas.getContext("experimental-webgl", {}), gl ? gl.getExtension("WEBGL_draw_buffers") : gl = null), context = gl;
  }
  return context;
}
exports.getTestContext = getTestContext;
//# sourceMappingURL=getTestContext.js.map
