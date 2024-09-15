"use strict";
var _const = require("../const.js");
class RoundedRectangle {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(x = 0, y = 0, width = 0, height = 0, radius = 20) {
    this.x = x, this.y = y, this.width = width, this.height = height, this.radius = radius, this.type = _const.SHAPES.RREC;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
   */
  contains(x, y) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      const radius = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (y >= this.y + radius && y <= this.y + this.height - radius || x >= this.x + radius && x <= this.x + this.width - radius)
        return !0;
      let dx = x - (this.x + radius), dy = y - (this.y + radius);
      const radius2 = radius * radius;
      if (dx * dx + dy * dy <= radius2 || (dx = x - (this.x + this.width - radius), dx * dx + dy * dy <= radius2) || (dy = y - (this.y + this.height - radius), dx * dx + dy * dy <= radius2) || (dx = x - (this.x + radius), dx * dx + dy * dy <= radius2))
        return !0;
    }
    return !1;
  }
}
RoundedRectangle.prototype.toString = function() {
  return `[@pixi/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
};
exports.RoundedRectangle = RoundedRectangle;
//# sourceMappingURL=RoundedRectangle.js.map
