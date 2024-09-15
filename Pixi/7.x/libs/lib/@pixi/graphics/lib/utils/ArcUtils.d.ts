interface IArcLikeShape {
    cx: number;
    cy: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    anticlockwise: boolean;
}
/**
 * Utilities for arc curves.
 * @private
 */
export declare class ArcUtils {
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
    static curveTo(x1: number, y1: number, x2: number, y2: number, radius: number, points: Array<number>): IArcLikeShape;
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
    static arc(_startX: number, _startY: number, cx: number, cy: number, radius: number, startAngle: number, endAngle: number, _anticlockwise: boolean, points: Array<number>): void;
}
export {};
