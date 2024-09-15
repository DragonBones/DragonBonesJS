import { Shader, Matrix, Program, TextureMatrix, Color } from "@pixi/core";
import fragment from "./shader/mesh.frag.mjs";
import vertex from "./shader/mesh.vert.mjs";
class MeshMaterial extends Shader {
  /**
   * @param uSampler - Texture that material uses to render.
   * @param options - Additional options
   * @param {number} [options.alpha=1] - Default alpha.
   * @param {PIXI.ColorSource} [options.tint=0xFFFFFF] - Default tint.
   * @param {string} [options.pluginName='batch'] - Renderer plugin for batching.
   * @param {PIXI.Program} [options.program=0xFFFFFF] - Custom program.
   * @param {object} [options.uniforms] - Custom uniforms.
   */
  constructor(uSampler, options) {
    const uniforms = {
      uSampler,
      alpha: 1,
      uTextureMatrix: Matrix.IDENTITY,
      uColor: new Float32Array([1, 1, 1, 1])
    };
    options = Object.assign({
      tint: 16777215,
      alpha: 1,
      pluginName: "batch"
    }, options), options.uniforms && Object.assign(uniforms, options.uniforms), super(options.program || Program.from(vertex, fragment), uniforms), this._colorDirty = !1, this.uvMatrix = new TextureMatrix(uSampler), this.batchable = options.program === void 0, this.pluginName = options.pluginName, this._tintColor = new Color(options.tint), this._tintRGB = this._tintColor.toLittleEndianNumber(), this._colorDirty = !0, this.alpha = options.alpha;
  }
  /** Reference to the texture being rendered. */
  get texture() {
    return this.uniforms.uSampler;
  }
  set texture(value) {
    this.uniforms.uSampler !== value && (!this.uniforms.uSampler.baseTexture.alphaMode != !value.baseTexture.alphaMode && (this._colorDirty = !0), this.uniforms.uSampler = value, this.uvMatrix.texture = value);
  }
  /**
   * This gets automatically set by the object using this.
   * @default 1
   */
  set alpha(value) {
    value !== this._alpha && (this._alpha = value, this._colorDirty = !0);
  }
  get alpha() {
    return this._alpha;
  }
  /**
   * Multiply tint for the material.
   * @default 0xFFFFFF
   */
  set tint(value) {
    value !== this.tint && (this._tintColor.setValue(value), this._tintRGB = this._tintColor.toLittleEndianNumber(), this._colorDirty = !0);
  }
  get tint() {
    return this._tintColor.value;
  }
  /**
   * Get the internal number from tint color
   * @ignore
   */
  get tintValue() {
    return this._tintColor.toNumber();
  }
  /** Gets called automatically by the Mesh. Intended to be overridden for custom {@link PIXI.MeshMaterial} objects. */
  update() {
    if (this._colorDirty) {
      this._colorDirty = !1;
      const applyToChannels = this.texture.baseTexture.alphaMode;
      Color.shared.setValue(this._tintColor).premultiply(this._alpha, applyToChannels).toArray(this.uniforms.uColor);
    }
    this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
  }
}
export {
  MeshMaterial
};
//# sourceMappingURL=MeshMaterial.mjs.map
