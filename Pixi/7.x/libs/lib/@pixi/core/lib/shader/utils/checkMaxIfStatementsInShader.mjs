const fragTemplate = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function generateIfTestSrc(maxIfs) {
  let src = "";
  for (let i = 0; i < maxIfs; ++i)
    i > 0 && (src += `
else `), i < maxIfs - 1 && (src += `if(test == ${i}.0){}`);
  return src;
}
function checkMaxIfStatementsInShader(maxIfs, gl) {
  if (maxIfs === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const shader = gl.createShader(gl.FRAGMENT_SHADER);
  for (; ; ) {
    const fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
    if (gl.shaderSource(shader, fragmentSrc), gl.compileShader(shader), !gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      maxIfs = maxIfs / 2 | 0;
    else
      break;
  }
  return maxIfs;
}
export {
  checkMaxIfStatementsInShader
};
//# sourceMappingURL=checkMaxIfStatementsInShader.mjs.map
