"use strict";
var GLProgram = require("../GLProgram.js"), compileShader = require("./compileShader.js"), defaultValue = require("./defaultValue.js"), getAttributeData = require("./getAttributeData.js"), getUniformData = require("./getUniformData.js"), logProgramError = require("./logProgramError.js");
function generateProgram(gl, program) {
  const glVertShader = compileShader.compileShader(gl, gl.VERTEX_SHADER, program.vertexSrc), glFragShader = compileShader.compileShader(gl, gl.FRAGMENT_SHADER, program.fragmentSrc), webGLProgram = gl.createProgram();
  gl.attachShader(webGLProgram, glVertShader), gl.attachShader(webGLProgram, glFragShader);
  const transformFeedbackVaryings = program.extra?.transformFeedbackVaryings;
  if (transformFeedbackVaryings && (typeof gl.transformFeedbackVaryings != "function" ? console.warn("TransformFeedback is not supported but TransformFeedbackVaryings are given.") : gl.transformFeedbackVaryings(
    webGLProgram,
    transformFeedbackVaryings.names,
    transformFeedbackVaryings.bufferMode === "separate" ? gl.SEPARATE_ATTRIBS : gl.INTERLEAVED_ATTRIBS
  )), gl.linkProgram(webGLProgram), gl.getProgramParameter(webGLProgram, gl.LINK_STATUS) || logProgramError.logProgramError(gl, webGLProgram, glVertShader, glFragShader), program.attributeData = getAttributeData.getAttributeData(webGLProgram, gl), program.uniformData = getUniformData.getUniformData(webGLProgram, gl), !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(program.vertexSrc)) {
    const keys = Object.keys(program.attributeData);
    keys.sort((a, b) => a > b ? 1 : -1);
    for (let i = 0; i < keys.length; i++)
      program.attributeData[keys[i]].location = i, gl.bindAttribLocation(webGLProgram, i, keys[i]);
    gl.linkProgram(webGLProgram);
  }
  gl.deleteShader(glVertShader), gl.deleteShader(glFragShader);
  const uniformData = {};
  for (const i in program.uniformData) {
    const data = program.uniformData[i];
    uniformData[i] = {
      location: gl.getUniformLocation(webGLProgram, i),
      value: defaultValue.defaultValue(data.type, data.size)
    };
  }
  return new GLProgram.GLProgram(webGLProgram, uniformData);
}
exports.generateProgram = generateProgram;
//# sourceMappingURL=generateProgram.js.map
