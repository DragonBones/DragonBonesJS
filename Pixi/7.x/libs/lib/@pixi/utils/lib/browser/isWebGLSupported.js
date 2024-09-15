"use strict";
require("../settings.js");
var settings = require("@pixi/settings");
let supported;
function isWebGLSupported() {
  return typeof supported > "u" && (supported = function() {
    const contextOptions = {
      stencil: !0,
      failIfMajorPerformanceCaveat: settings.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
    };
    try {
      if (!settings.settings.ADAPTER.getWebGLRenderingContext())
        return !1;
      const canvas = settings.settings.ADAPTER.createCanvas();
      let gl = canvas.getContext("webgl", contextOptions) || canvas.getContext("experimental-webgl", contextOptions);
      const success = !!gl?.getContextAttributes()?.stencil;
      if (gl) {
        const loseContext = gl.getExtension("WEBGL_lose_context");
        loseContext && loseContext.loseContext();
      }
      return gl = null, success;
    } catch {
      return !1;
    }
  }()), supported;
}
exports.isWebGLSupported = isWebGLSupported;
//# sourceMappingURL=isWebGLSupported.js.map
