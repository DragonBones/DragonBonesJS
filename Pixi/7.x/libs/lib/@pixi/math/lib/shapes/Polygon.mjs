import { SHAPES } from "../const.mjs";
class Polygon {
  /**
   * @param {PIXI.IPointData[]|number[]} points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...points) {
    let flat = Array.isArray(points[0]) ? points[0] : points;
    if (typeof flat[0] != "number") {
      const p = [];
      for (let i = 0, il = flat.length; i < il; i++)
        p.push(flat[i].x, flat[i].y);
      flat = p;
    }
    this.points = flat, this.type = SHAPES.POLY, this.closeStroke = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const points = this.points.slice(), polygon = new Polygon(points);
    return polygon.closeStroke = this.closeStroke, polygon;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(x, y) {
    let inside = !1;
    const length = this.points.length / 2;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      const xi = this.points[i * 2], yi = this.points[i * 2 + 1], xj = this.points[j * 2], yj = this.points[j * 2 + 1];
      yi > y != yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi && (inside = !inside);
    }
    return inside;
  }
}
Polygon.prototype.toString = function() {
  return `[@pixi/math:PolygoncloseStroke=${this.closeStroke}points=${this.points.reduce((pointsDesc, currentPoint) => `${pointsDesc}, ${currentPoint}`, "")}]`;
};
export {
  Polygon
};
//# sourceMappingURL=Polygon.mjs.map
