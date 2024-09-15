"use strict";
var constants = require("@pixi/constants"), Buffer = require("../geometry/Buffer.js"), Geometry = require("../geometry/Geometry.js");
class BatchGeometry extends Geometry.Geometry {
  /**
   * @param {boolean} [_static=false] - Optimization flag, where `false`
   *        is updated every frame, `true` doesn't change frame-to-frame.
   */
  constructor(_static = !1) {
    super(), this._buffer = new Buffer.Buffer(null, _static, !1), this._indexBuffer = new Buffer.Buffer(null, _static, !0), this.addAttribute("aVertexPosition", this._buffer, 2, !1, constants.TYPES.FLOAT).addAttribute("aTextureCoord", this._buffer, 2, !1, constants.TYPES.FLOAT).addAttribute("aColor", this._buffer, 4, !0, constants.TYPES.UNSIGNED_BYTE).addAttribute("aTextureId", this._buffer, 1, !0, constants.TYPES.FLOAT).addIndex(this._indexBuffer);
  }
}
exports.BatchGeometry = BatchGeometry;
//# sourceMappingURL=BatchGeometry.js.map
