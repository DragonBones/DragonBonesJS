"use strict";
var _const = require("../const.js"), FillStyle = require("./FillStyle.js");
class LineStyle extends FillStyle.FillStyle {
  constructor() {
    super(...arguments), this.width = 0, this.alignment = 0.5, this.native = !1, this.cap = _const.LINE_CAP.BUTT, this.join = _const.LINE_JOIN.MITER, this.miterLimit = 10;
  }
  /** Clones the object. */
  clone() {
    const obj = new LineStyle();
    return obj.color = this.color, obj.alpha = this.alpha, obj.texture = this.texture, obj.matrix = this.matrix, obj.visible = this.visible, obj.width = this.width, obj.alignment = this.alignment, obj.native = this.native, obj.cap = this.cap, obj.join = this.join, obj.miterLimit = this.miterLimit, obj;
  }
  /** Reset the line style to default. */
  reset() {
    super.reset(), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1, this.cap = _const.LINE_CAP.BUTT, this.join = _const.LINE_JOIN.MITER, this.miterLimit = 10;
  }
}
exports.LineStyle = LineStyle;
//# sourceMappingURL=LineStyle.js.map
