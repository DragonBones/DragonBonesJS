import { curves } from "../const.mjs";
class QuadraticUtils {
  /**
   * Calculate length of quadratic curve
   * @see {@link http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/}
   * for the detailed explanation of math behind this.
   * @private
   * @param fromX - x-coordinate of curve start point
   * @param fromY - y-coordinate of curve start point
   * @param cpX - x-coordinate of curve control point
   * @param cpY - y-coordinate of curve control point
   * @param toX - x-coordinate of curve end point
   * @param toY - y-coordinate of curve end point
   * @returns - Length of quadratic curve
   */
  static curveLength(fromX, fromY, cpX, cpY, toX, toY) {
    const ax = fromX - 2 * cpX + toX, ay = fromY - 2 * cpY + toY, bx = 2 * cpX - 2 * fromX, by = 2 * cpY - 2 * fromY, a = 4 * (ax * ax + ay * ay), b = 4 * (ax * bx + ay * by), c = bx * bx + by * by, s = 2 * Math.sqrt(a + b + c), a2 = Math.sqrt(a), a32 = 2 * a * a2, c2 = 2 * Math.sqrt(c), ba = b / a2;
    return (a32 * s + a2 * b * (s - c2) + (4 * c * a - b * b) * Math.log((2 * a2 + ba + s) / (ba + c2))) / (4 * a32);
  }
  /**
   * Calculate the points for a quadratic bezier curve and then draws it.
   * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
   * @private
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @param points - Points to add segments to.
   */
  static curveTo(cpX, cpY, toX, toY, points) {
    const fromX = points[points.length - 2], fromY = points[points.length - 1], n = curves._segmentsCount(
      QuadraticUtils.curveLength(fromX, fromY, cpX, cpY, toX, toY)
    );
    let xa = 0, ya = 0;
    for (let i = 1; i <= n; ++i) {
      const j = i / n;
      xa = fromX + (cpX - fromX) * j, ya = fromY + (cpY - fromY) * j, points.push(
        xa + (cpX + (toX - cpX) * j - xa) * j,
        ya + (cpY + (toY - cpY) * j - ya) * j
      );
    }
  }
}
export {
  QuadraticUtils
};
//# sourceMappingURL=QuadraticUtils.mjs.map
