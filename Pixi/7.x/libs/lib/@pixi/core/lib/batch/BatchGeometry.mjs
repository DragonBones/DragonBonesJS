import { TYPES } from "@pixi/constants";
import { Buffer } from "../geometry/Buffer.mjs";
import { Geometry } from "../geometry/Geometry.mjs";
class BatchGeometry extends Geometry {
  /**
   * @param {boolean} [_static=false] - Optimization flag, where `false`
   *        is updated every frame, `true` doesn't change frame-to-frame.
   */
  constructor(_static = !1) {
    super(), this._buffer = new Buffer(null, _static, !1), this._indexBuffer = new Buffer(null, _static, !0), this.addAttribute("aVertexPosition", this._buffer, 2, !1, TYPES.FLOAT).addAttribute("aTextureCoord", this._buffer, 2, !1, TYPES.FLOAT).addAttribute("aColor", this._buffer, 4, !0, TYPES.UNSIGNED_BYTE).addAttribute("aTextureId", this._buffer, 1, !0, TYPES.FLOAT).addIndex(this._indexBuffer);
  }
}
export {
  BatchGeometry
};
//# sourceMappingURL=BatchGeometry.mjs.map
