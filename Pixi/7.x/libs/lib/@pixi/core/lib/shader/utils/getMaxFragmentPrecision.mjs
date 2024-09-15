import { PRECISION } from "@pixi/constants";
import { getTestContext } from "./getTestContext.mjs";
let maxFragmentPrecision;
function getMaxFragmentPrecision() {
  if (!maxFragmentPrecision) {
    maxFragmentPrecision = PRECISION.MEDIUM;
    const gl = getTestContext();
    if (gl && gl.getShaderPrecisionFormat) {
      const shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      shaderFragment && (maxFragmentPrecision = shaderFragment.precision ? PRECISION.HIGH : PRECISION.MEDIUM);
    }
  }
  return maxFragmentPrecision;
}
export {
  getMaxFragmentPrecision
};
//# sourceMappingURL=getMaxFragmentPrecision.mjs.map
