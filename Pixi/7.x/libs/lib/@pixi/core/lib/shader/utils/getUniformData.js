"use strict";
var defaultValue = require("./defaultValue.js"), mapType = require("./mapType.js");
function getUniformData(program, gl) {
  const uniforms = {}, totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < totalUniforms; i++) {
    const uniformData = gl.getActiveUniform(program, i), name = uniformData.name.replace(/\[.*?\]$/, ""), isArray = !!uniformData.name.match(/\[.*?\]$/), type = mapType.mapType(gl, uniformData.type);
    uniforms[name] = {
      name,
      index: i,
      type,
      size: uniformData.size,
      isArray,
      value: defaultValue.defaultValue(type, uniformData.size)
    };
  }
  return uniforms;
}
exports.getUniformData = getUniformData;
//# sourceMappingURL=getUniformData.js.map
