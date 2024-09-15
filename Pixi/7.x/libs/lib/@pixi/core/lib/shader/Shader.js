"use strict";
var runner = require("@pixi/runner"), Program = require("./Program.js"), UniformGroup = require("./UniformGroup.js");
class Shader {
  /**
   * @param program - The program the shader will use.
   * @param uniforms - Custom uniforms to use to augment the built-in ones.
   */
  constructor(program, uniforms) {
    this.uniformBindCount = 0, this.program = program, uniforms ? uniforms instanceof UniformGroup.UniformGroup ? this.uniformGroup = uniforms : this.uniformGroup = new UniformGroup.UniformGroup(uniforms) : this.uniformGroup = new UniformGroup.UniformGroup({}), this.disposeRunner = new runner.Runner("disposeShader");
  }
  // TODO move to shader system..
  checkUniformExists(name, group) {
    if (group.uniforms[name])
      return !0;
    for (const i in group.uniforms) {
      const uniform = group.uniforms[i];
      if (uniform.group === !0 && this.checkUniformExists(name, uniform))
        return !0;
    }
    return !1;
  }
  destroy() {
    this.uniformGroup = null, this.disposeRunner.emit(this), this.disposeRunner.destroy();
  }
  /**
   * Shader uniform values, shortcut for `uniformGroup.uniforms`.
   * @readonly
   */
  get uniforms() {
    return this.uniformGroup.uniforms;
  }
  /**
   * A short hand function to create a shader based of a vertex and fragment shader.
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param uniforms - Custom uniforms to use to augment the built-in ones.
   * @returns A shiny new PixiJS shader!
   */
  static from(vertexSrc, fragmentSrc, uniforms) {
    const program = Program.Program.from(vertexSrc, fragmentSrc);
    return new Shader(program, uniforms);
  }
}
exports.Shader = Shader;
//# sourceMappingURL=Shader.js.map
