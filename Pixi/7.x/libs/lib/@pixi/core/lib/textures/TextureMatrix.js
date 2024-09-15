"use strict";
var math = require("@pixi/math");
const tempMat = new math.Matrix();
class TextureMatrix {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(texture, clampMargin) {
    this._texture = texture, this.mapCoord = new math.Matrix(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = typeof clampMargin > "u" ? 0.5 : clampMargin, this.isSimple = !1;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(value) {
    this._texture = value, this._textureID = -1;
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(uvs, out) {
    out === void 0 && (out = uvs);
    const mat = this.mapCoord;
    for (let i = 0; i < uvs.length; i += 2) {
      const x = uvs[i], y = uvs[i + 1];
      out[i] = x * mat.a + y * mat.c + mat.tx, out[i + 1] = x * mat.b + y * mat.d + mat.ty;
    }
    return out;
  }
  /**
   * Updates matrices if texture was changed.
   * @param [forceUpdate=false] - if true, matrices will be updated any case
   * @returns - Whether or not it was updated
   */
  update(forceUpdate) {
    const tex = this._texture;
    if (!tex || !tex.valid || !forceUpdate && this._textureID === tex._updateID)
      return !1;
    this._textureID = tex._updateID, this._updateID++;
    const uvs = tex._uvs;
    this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
    const orig = tex.orig, trim = tex.trim;
    trim && (tempMat.set(
      orig.width / trim.width,
      0,
      0,
      orig.height / trim.height,
      -trim.x / trim.width,
      -trim.y / trim.height
    ), this.mapCoord.append(tempMat));
    const texBase = tex.baseTexture, frame = this.uClampFrame, margin = this.clampMargin / texBase.resolution, offset = this.clampOffset;
    return frame[0] = (tex._frame.x + margin + offset) / texBase.width, frame[1] = (tex._frame.y + margin + offset) / texBase.height, frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width, frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height, this.uClampOffset[0] = offset / texBase.realWidth, this.uClampOffset[1] = offset / texBase.realHeight, this.isSimple = tex._frame.width === texBase.width && tex._frame.height === texBase.height && tex.rotate === 0, !0;
  }
}
exports.TextureMatrix = TextureMatrix;
//# sourceMappingURL=TextureMatrix.js.map
