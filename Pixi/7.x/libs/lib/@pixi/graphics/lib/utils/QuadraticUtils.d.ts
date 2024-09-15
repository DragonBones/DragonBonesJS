/**
 * Utilities for quadratic curves.
 * @private
 */
export declare class QuadraticUtils {
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
    static curveLength(fromX: number, fromY: number, cpX: number, cpY: number, toX: number, toY: number): number;
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
    static curveTo(cpX: number, cpY: number, toX: number, toY: number, points: Array<number>): void;
}
