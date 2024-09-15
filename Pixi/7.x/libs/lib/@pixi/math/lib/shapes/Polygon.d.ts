import { SHAPES } from '../const';
import type { IPointData } from '../IPointData';
/**
 * A class to define a shape via user defined coordinates.
 * @memberof PIXI
 */
export declare class Polygon {
    /** An array of the points of this polygon. */
    points: number[];
    /** `false` after moveTo, `true` after `closePath`. In all other cases it is `true`. */
    closeStroke: boolean;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default PIXI.SHAPES.POLY
     * @see PIXI.SHAPES
     */
    readonly type: SHAPES.POLY;
    constructor(points: IPointData[] | number[]);
    constructor(...points: IPointData[] | number[]);
    /**
     * Creates a clone of this polygon.
     * @returns - A copy of the polygon.
     */
    clone(): Polygon;
    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon.
     * @param x - The X coordinate of the point to test.
     * @param y - The Y coordinate of the point to test.
     * @returns - Whether the x/y coordinates are within this polygon.
     */
    contains(x: number, y: number): boolean;
}
