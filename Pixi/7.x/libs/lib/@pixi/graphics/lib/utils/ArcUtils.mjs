import { PI_2 } from "@pixi/core";
import { curves } from "../const.mjs";
class ArcUtils {
  /**
   * Calculate information of the arc for {@link PIXI.Graphics.arcTo}.
   * @private
   * @param x1 - The x-coordinate of the first control point of the arc
   * @param y1 - The y-coordinate of the first control point of the arc
   * @param x2 - The x-coordinate of the second control point of the arc
   * @param y2 - The y-coordinate of the second control point of the arc
   * @param radius - The radius of the arc
   * @param points - Collection of points to add to
   * @returns - If the arc length is valid, return center of circle, radius and other info otherwise `null`.
   */
  static curveTo(x1, y1, x2, y2, radius, points) {
    const fromX = points[points.length - 2], a1 = points[points.length - 1] - y1, b1 = fromX - x1, a2 = y2 - y1, b2 = x2 - x1, mm = Math.abs(a1 * b2 - b1 * a2);
    if (mm < 1e-8 || radius === 0)
      return (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) && points.push(x1, y1), null;
    const dd = a1 * a1 + b1 * b1, cc = a2 * a2 + b2 * b2, tt = a1 * a2 + b1 * b2, k1 = radius * Math.sqrt(dd) / mm, k2 = radius * Math.sqrt(cc) / mm, j1 = k1 * tt / dd, j2 = k2 * tt / cc, cx = k1 * b2 + k2 * b1, cy = k1 * a2 + k2 * a1, px = b1 * (k2 + j1), py = a1 * (k2 + j1), qx = b2 * (k1 + j2), qy = a2 * (k1 + j2), startAngle = Math.atan2(py - cy, px - cx), endAngle = Math.atan2(qy - cy, qx - cx);
    return {
      cx: cx + x1,
      cy: cy + y1,
      radius,
      startAngle,
      endAngle,
      anticlockwise: b1 * a2 > b2 * a1
    };
  }
  /**
   * The arc method creates an arc/curve (used to create circles, or parts of circles).
   * @private
   * @param _startX - Start x location of arc
   * @param _startY - Start y location of arc
   * @param cx - The x-coordinate of the center of the circle
   * @param cy - The y-coordinate of the center of the circle
   * @param radius - The radius of the circle
   * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
   *  of the arc's circle)
   * @param endAngle - The ending angle, in radians
   * @param _anticlockwise - Specifies whether the drawing should be
   *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
   *  indicates counter-clockwise.
   * @param points - Collection of points to add to
   */
  static arc(_startX, _startY, cx, cy, radius, startAngle, endAngle, _anticlockwise, points) {
    const sweep = endAngle - startAngle, n = curves._segmentsCount(
      Math.abs(sweep) * radius,
      Math.ceil(Math.abs(sweep) / PI_2) * 40
    ), theta = sweep / (n * 2), theta2 = theta * 2, cTheta = Math.cos(theta), sTheta = Math.sin(theta), segMinus = n - 1, remainder = segMinus % 1 / segMinus;
    for (let i = 0; i <= segMinus; ++i) {
      const real = i + remainder * i, angle = theta + startAngle + theta2 * real, c = Math.cos(angle), s = -Math.sin(angle);
      points.push(
        (cTheta * c + sTheta * s) * radius + cx,
        (cTheta * -s + sTheta * c) * radius + cy
      );
    }
  }
}
export {
  ArcUtils
};
//# sourceMappingURL=ArcUtils.mjs.map
