"use strict";
var _const = require("../const.js"), Rectangle = require("./Rectangle.js");
class Circle {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(x = 0, y = 0, radius = 0) {
    this.x = x, this.y = y, this.radius = radius, this.type = _const.SHAPES.CIRC;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new Circle(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   */
  contains(x, y) {
    if (this.radius <= 0)
      return !1;
    const r2 = this.radius * this.radius;
    let dx = this.x - x, dy = this.y - y;
    return dx *= dx, dy *= dy, dx + dy <= r2;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @returns The framing rectangle
   */
  getBounds() {
    return new Rectangle.Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}
Circle.prototype.toString = function() {
  return `[@pixi/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
};
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map
