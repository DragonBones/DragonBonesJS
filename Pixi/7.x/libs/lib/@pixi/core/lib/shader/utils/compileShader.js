"use strict";
function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  return gl.shaderSource(shader, src), gl.compileShader(shader), shader;
}
exports.compileShader = compileShader;
//# sourceMappingURL=compileShader.js.map
