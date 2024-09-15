import type { IPoint } from './IPoint';
import type { IPointData } from './IPointData';
export interface ObservablePoint extends GlobalMixins.Point, IPoint {
}
/**
 * The ObservablePoint object represents a location in a two-dimensional coordinate system, where `x` represents
 * the position on the horizontal axis and `y` represents the position on the vertical axis.
 *
 * An `ObservablePoint` is a point that triggers a callback when the point's position is changed.
 * @memberof PIXI
 */
export declare class ObservablePoint<T = any> implements IPoint {
    /** The callback function triggered when `x` and/or `y` are changed */
    cb: (this: T) => any;
    /** The owner of the callback */
    scope: any;
    _x: number;
    _y: number;
    /**
     * Creates a new `ObservablePoint`
     * @param cb - callback function triggered when `x` and/or `y` are changed
     * @param scope - owner of callback
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    constructor(cb: (this: T) => any, scope: T, x?: number, y?: number);
    /**
     * Creates a clone of this point.
     * The callback and scope params can be overridden otherwise they will default
     * to the clone object's values.
     * @override
     * @param cb - The callback function triggered when `x` and/or `y` are changed
     * @param scope - The owner of the callback
     * @returns a copy of this observable point
     */
    clone(cb?: (this: T) => any, scope?: any): ObservablePoint;
    /**
     * Sets the point to a new `x` and `y` position.
     * If `y` is omitted, both `x` and `y` will be set to `x`.
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=x] - position of the point on the y axis
     * @returns The observable point instance itself
     */
    set(x?: number, y?: number): this;
    /**
     * Copies x and y from the given point (`p`)
     * @param p - The point to copy from. Can be any of type that is or extends `IPointData`
     * @returns The observable point instance itself
     */
    copyFrom(p: IPointData): this;
    /**
     * Copies this point's x and y into that of the given point (`p`)
     * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
     * @returns The point (`p`) with values updated
     */
    copyTo<T extends IPoint>(p: T): T;
    /**
     * Accepts another point (`p`) and returns `true` if the given point is equal to this point
     * @param p - The point to check
     * @returns Returns `true` if both `x` and `y` are equal
     */
    equals(p: IPointData): boolean;
    /** Position of the observable point on the x axis. */
    get x(): number;
    set x(value: number);
    /** Position of the observable point on the y axis. */
    get y(): number;
    set y(value: number);
}
