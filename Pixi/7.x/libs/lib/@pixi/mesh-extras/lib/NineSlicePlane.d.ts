import { Texture } from '@pixi/core';
import { SimplePlane } from './SimplePlane';
import type { ITypedArray } from '@pixi/core';
export interface NineSlicePlane extends GlobalMixins.NineSlicePlane {
}
/**
 * The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
 * for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
 *
 * <pre>
 *      A                          B
 *    +---+----------------------+---+
 *  C | 1 |          2           | 3 |
 *    +---+----------------------+---+
 *    |   |                      |   |
 *    | 4 |          5           | 6 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *  D | 7 |          8           | 9 |
 *    +---+----------------------+---+
 *  When changing this objects width and/or height:
 *     areas 1 3 7 and 9 will remain unscaled.
 *     areas 2 and 8 will be stretched horizontally
 *     areas 4 and 6 will be stretched vertically
 *     area 5 will be stretched both horizontally and vertically
 * </pre>
 * @example
 * import { NineSlicePlane, Texture } from 'pixi.js';
 *
 * const plane9 = new NineSlicePlane(Texture.from('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
 * @memberof PIXI
 */
export declare class NineSlicePlane extends SimplePlane {
    private _origWidth;
    private _origHeight;
    /**
     * The width of the left column (a).
     * @private
     */
    _leftWidth: number;
    /**
     * The width of the right column (b)
     * @private
     */
    _rightWidth: number;
    /**
     * The height of the top row (c)
     * @private
     */
    _topHeight: number;
    /**
     * The height of the bottom row (d)
     * @private
     */
    _bottomHeight: number;
    /**
     * @param texture - The texture to use on the NineSlicePlane.
     * @param {number} [leftWidth=10] - size of the left vertical bar (A)
     * @param {number} [topHeight=10] - size of the top horizontal bar (C)
     * @param {number} [rightWidth=10] - size of the right vertical bar (B)
     * @param {number} [bottomHeight=10] - size of the bottom horizontal bar (D)
     */
    constructor(texture: Texture, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number);
    textureUpdated(): void;
    get vertices(): ITypedArray;
    set vertices(value: ITypedArray);
    /** Updates the horizontal vertices. */
    updateHorizontalVertices(): void;
    /** Updates the vertical vertices. */
    updateVerticalVertices(): void;
    /**
     * Returns the smaller of a set of vertical and horizontal scale of nine slice corners.
     * @returns Smaller number of vertical and horizontal scale.
     */
    private _getMinScale;
    /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get width(): number;
    set width(value: number);
    /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get height(): number;
    set height(value: number);
    /** The width of the left column. */
    get leftWidth(): number;
    set leftWidth(value: number);
    /** The width of the right column. */
    get rightWidth(): number;
    set rightWidth(value: number);
    /** The height of the top row. */
    get topHeight(): number;
    set topHeight(value: number);
    /** The height of the bottom row. */
    get bottomHeight(): number;
    set bottomHeight(value: number);
    /** Refreshes NineSlicePlane coords. All of them. */
    private _refresh;
}
