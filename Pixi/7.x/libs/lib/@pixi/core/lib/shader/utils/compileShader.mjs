function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  return gl.shaderSource(shader, src), gl.compileShader(shader), shader;
}
export {
  compileShader
};
//# sourceMappingURL=compileShader.mjs.map
