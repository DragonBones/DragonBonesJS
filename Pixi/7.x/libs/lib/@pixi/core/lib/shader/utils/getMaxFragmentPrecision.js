"use strict";
var constants = require("@pixi/constants"), getTestContext = require("./getTestContext.js");
let maxFragmentPrecision;
function getMaxFragmentPrecision() {
  if (!maxFragmentPrecision) {
    maxFragmentPrecision = constants.PRECISION.MEDIUM;
    const gl = getTestContext.getTestContext();
    if (gl && gl.getShaderPrecisionFormat) {
      const shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      shaderFragment && (maxFragmentPrecision = shaderFragment.precision ? constants.PRECISION.HIGH : constants.PRECISION.MEDIUM);
    }
  }
  return maxFragmentPrecision;
}
exports.getMaxFragmentPrecision = getMaxFragmentPrecision;
//# sourceMappingURL=getMaxFragmentPrecision.js.map
