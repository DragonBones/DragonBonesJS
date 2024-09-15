import { BUFFER_TYPE } from "@pixi/constants";
import { Buffer } from "../geometry/Buffer.mjs";
let UID = 0;
class UniformGroup {
  /**
   * @param {object | Buffer} [uniforms] - Custom uniforms to use to augment the built-in ones. Or a pixi buffer.
   * @param isStatic - Uniforms wont be changed after creation.
   * @param isUbo - If true, will treat this uniform group as a uniform buffer object.
   */
  constructor(uniforms, isStatic, isUbo) {
    this.group = !0, this.syncUniforms = {}, this.dirtyId = 0, this.id = UID++, this.static = !!isStatic, this.ubo = !!isUbo, uniforms instanceof Buffer ? (this.buffer = uniforms, this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER, this.autoManage = !1, this.ubo = !0) : (this.uniforms = uniforms, this.ubo && (this.buffer = new Buffer(new Float32Array(1)), this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER, this.autoManage = !0));
  }
  update() {
    this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
  }
  add(name, uniforms, _static) {
    if (!this.ubo)
      this.uniforms[name] = new UniformGroup(uniforms, _static);
    else
      throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
  }
  static from(uniforms, _static, _ubo) {
    return new UniformGroup(uniforms, _static, _ubo);
  }
  /**
   * A short hand function for creating a static UBO UniformGroup.
   * @param uniforms - the ubo item
   * @param _static - should this be updated each time it is used? defaults to true here!
   */
  static uboFrom(uniforms, _static) {
    return new UniformGroup(uniforms, _static ?? !0, !0);
  }
}
export {
  UniformGroup
};
//# sourceMappingURL=UniformGroup.mjs.map
