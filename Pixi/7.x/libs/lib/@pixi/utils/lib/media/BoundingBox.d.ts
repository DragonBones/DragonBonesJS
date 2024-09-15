/**
 * A rectangular bounding box describing the boundary of an area.
 * @memberof PIXI.utils
 * @since 7.1.0
 */
export declare class BoundingBox {
    /** The left coordinate value of the bounding box. */
    left: number;
    /** The top coordinate value of the bounding box. */
    top: number;
    /** The right coordinate value of the bounding box. */
    right: number;
    /** The bottom coordinate value of the bounding box. */
    bottom: number;
    /**
     * @param left - The left coordinate value of the bounding box.
     * @param top - The top coordinate value of the bounding box.
     * @param right - The right coordinate value of the bounding box.
     * @param bottom - The bottom coordinate value of the bounding box.
     */
    constructor(left: number, top: number, right: number, bottom: number);
    /** The width of the bounding box. */
    get width(): number;
    /** The height of the bounding box. */
    get height(): number;
    /** Determines whether the BoundingBox is empty. */
    isEmpty(): boolean;
    /**
     * An empty BoundingBox.
     * @type {PIXI.utils.BoundingBox}
     */
    static readonly EMPTY: BoundingBox;
}
