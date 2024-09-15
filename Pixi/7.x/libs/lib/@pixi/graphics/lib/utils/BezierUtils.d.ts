/**
 * Utilities for bezier curves
 * @private
 */
export declare class BezierUtils {
    /**
     * Calculate length of bezier curve.
     * Analytical solution is impossible, since it involves an integral that does not integrate in general.
     * Therefore numerical solution is used.
     * @private
     * @param fromX - Starting point x
     * @param fromY - Starting point y
     * @param cpX - Control point x
     * @param cpY - Control point y
     * @param cpX2 - Second Control point x
     * @param cpY2 - Second Control point y
     * @param toX - Destination point x
     * @param toY - Destination point y
     * @returns - Length of bezier curve
     */
    static curveLength(fromX: number, fromY: number, cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): number;
    /**
     * Calculate the points for a bezier curve and then draws it.
     *
     * Ignored from docs since it is not directly exposed.
     * @ignore
     * @param cpX - Control point x
     * @param cpY - Control point y
     * @param cpX2 - Second Control point x
     * @param cpY2 - Second Control point y
     * @param toX - Destination point x
     * @param toY - Destination point y
     * @param points - Path array to push points into
     */
    static curveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number, points: Array<number>): void;
}
