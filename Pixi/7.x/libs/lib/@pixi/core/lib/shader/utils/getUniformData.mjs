import { defaultValue } from "./defaultValue.mjs";
import { mapType } from "./mapType.mjs";
function getUniformData(program, gl) {
  const uniforms = {}, totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < totalUniforms; i++) {
    const uniformData = gl.getActiveUniform(program, i), name = uniformData.name.replace(/\[.*?\]$/, ""), isArray = !!uniformData.name.match(/\[.*?\]$/), type = mapType(gl, uniformData.type);
    uniforms[name] = {
      name,
      index: i,
      type,
      size: uniformData.size,
      isArray,
      value: defaultValue(type, uniformData.size)
    };
  }
  return uniforms;
}
export {
  getUniformData
};
//# sourceMappingURL=getUniformData.mjs.map
