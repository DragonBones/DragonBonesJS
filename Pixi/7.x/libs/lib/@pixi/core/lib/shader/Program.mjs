import { PRECISION } from "@pixi/constants";
import { ProgramCache, isMobile } from "@pixi/utils";
import defaultFragment from "./defaultProgram.frag.mjs";
import defaultVertex from "./defaultProgram.vert.mjs";
import "./utils/index.mjs";
import { setPrecision } from "./utils/setPrecision.mjs";
import { getMaxFragmentPrecision } from "./utils/getMaxFragmentPrecision.mjs";
let UID = 0;
const nameCache = {}, _Program = class _Program2 {
  /**
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param name - Name for shader
   * @param extra - Extra data for shader
   */
  constructor(vertexSrc, fragmentSrc, name = "pixi-shader", extra = {}) {
    this.extra = {}, this.id = UID++, this.vertexSrc = vertexSrc || _Program2.defaultVertexSrc, this.fragmentSrc = fragmentSrc || _Program2.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), this.extra = extra, this.vertexSrc.substring(0, 8) !== "#version" && (name = name.replace(/\s+/g, "-"), nameCache[name] ? (nameCache[name]++, name += `-${nameCache[name]}`) : nameCache[name] = 1, this.vertexSrc = `#define SHADER_NAME ${name}
${this.vertexSrc}`, this.fragmentSrc = `#define SHADER_NAME ${name}
${this.fragmentSrc}`, this.vertexSrc = setPrecision(
      this.vertexSrc,
      _Program2.defaultVertexPrecision,
      PRECISION.HIGH
    ), this.fragmentSrc = setPrecision(
      this.fragmentSrc,
      _Program2.defaultFragmentPrecision,
      getMaxFragmentPrecision()
    )), this.glPrograms = {}, this.syncUniforms = null;
  }
  /**
   * The default vertex shader source.
   * @readonly
   */
  static get defaultVertexSrc() {
    return defaultVertex;
  }
  /**
   * The default fragment shader source.
   * @readonly
   */
  static get defaultFragmentSrc() {
    return defaultFragment;
  }
  /**
   * A short hand function to create a program based of a vertex and fragment shader.
   *
   * This method will also check to see if there is a cached program.
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param name - Name for shader
   * @returns A shiny new PixiJS shader program!
   */
  static from(vertexSrc, fragmentSrc, name) {
    const key = vertexSrc + fragmentSrc;
    let program = ProgramCache[key];
    return program || (ProgramCache[key] = program = new _Program2(vertexSrc, fragmentSrc, name)), program;
  }
};
_Program.defaultVertexPrecision = PRECISION.HIGH, /**
* Default specify float precision in fragment shader.
* iOS is best set at highp due to https://github.com/pixijs/pixijs/issues/3742
* @static
* @type {PIXI.PRECISION}
* @default PIXI.PRECISION.MEDIUM
*/
_Program.defaultFragmentPrecision = isMobile.apple.device ? PRECISION.HIGH : PRECISION.MEDIUM;
let Program = _Program;
export {
  Program
};
//# sourceMappingURL=Program.mjs.map
