"use strict";
var math = require("@pixi/math"), Program = require("../shader/Program.js"), Shader = require("../shader/Shader.js"), UniformGroup = require("../shader/UniformGroup.js");
class BatchShaderGenerator {
  /**
   * @param vertexSrc - Vertex shader
   * @param fragTemplate - Fragment shader template
   */
  constructor(vertexSrc, fragTemplate) {
    if (this.vertexSrc = vertexSrc, this.fragTemplate = fragTemplate, this.programCache = {}, this.defaultGroupCache = {}, !fragTemplate.includes("%count%"))
      throw new Error('Fragment template must contain "%count%".');
    if (!fragTemplate.includes("%forloop%"))
      throw new Error('Fragment template must contain "%forloop%".');
  }
  generateShader(maxTextures) {
    if (!this.programCache[maxTextures]) {
      const sampleValues = new Int32Array(maxTextures);
      for (let i = 0; i < maxTextures; i++)
        sampleValues[i] = i;
      this.defaultGroupCache[maxTextures] = UniformGroup.UniformGroup.from({ uSamplers: sampleValues }, !0);
      let fragmentSrc = this.fragTemplate;
      fragmentSrc = fragmentSrc.replace(/%count%/gi, `${maxTextures}`), fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures)), this.programCache[maxTextures] = new Program.Program(this.vertexSrc, fragmentSrc);
    }
    const uniforms = {
      tint: new Float32Array([1, 1, 1, 1]),
      translationMatrix: new math.Matrix(),
      default: this.defaultGroupCache[maxTextures]
    };
    return new Shader.Shader(this.programCache[maxTextures], uniforms);
  }
  generateSampleSrc(maxTextures) {
    let src = "";
    src += `
`, src += `
`;
    for (let i = 0; i < maxTextures; i++)
      i > 0 && (src += `
else `), i < maxTextures - 1 && (src += `if(vTextureId < ${i}.5)`), src += `
{`, src += `
	color = texture2D(uSamplers[${i}], vTextureCoord);`, src += `
}`;
    return src += `
`, src += `
`, src;
  }
}
exports.BatchShaderGenerator = BatchShaderGenerator;
//# sourceMappingURL=BatchShaderGenerator.js.map
