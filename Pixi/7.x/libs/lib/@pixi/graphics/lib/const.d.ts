/**
 * Supported line joints in `PIXI.LineStyle` for graphics.
 * @see PIXI.Graphics#lineStyle
 * @see https://graphicdesign.stackexchange.com/questions/59018/what-is-a-bevel-join-of-two-lines-exactly-illustrator
 * @memberof PIXI
 * @static
 * @enum {string}
 */
export declare enum LINE_JOIN {
    /**
     * 'miter': make a sharp corner where outer part of lines meet
     * @default miter
     */
    MITER = "miter",
    /**
     * 'bevel': add a square butt at each end of line segment and fill the triangle at turn
     * @default bevel
     */
    BEVEL = "bevel",
    /**
     * 'round': add an arc at the joint
     * @default round
     */
    ROUND = "round"
}
/**
 * Support line caps in `PIXI.LineStyle` for graphics.
 * @see PIXI.Graphics#lineStyle
 * @memberof PIXI
 * @static
 * @enum {string}
 */
export declare enum LINE_CAP {
    /**
     * 'butt': don't add any cap at line ends (leaves orthogonal edges)
     * @default butt
     */
    BUTT = "butt",
    /**
     * 'round': add semicircle at ends
     * @default round
     */
    ROUND = "round",
    /**
     * 'square': add square at end (like `BUTT` except more length at end)
     * @default square
     */
    SQUARE = "square"
}
/**
 * @memberof PIXI
 * @deprecated
 */
export interface IGraphicsCurvesSettings {
    adaptive: boolean;
    maxLength: number;
    minSegments: number;
    maxSegments: number;
    epsilon: number;
    _segmentsCount(length: number, defaultSegments?: number): number;
}
/**
 * @private
 */
export declare const curves: {
    adaptive: boolean;
    maxLength: number;
    minSegments: number;
    maxSegments: number;
    epsilon: number;
    _segmentsCount(length: number, defaultSegments?: number): number;
};
/**
 * @static
 * @readonly
 * @memberof PIXI
 * @name GRAPHICS_CURVES
 * @type {object}
 * @deprecated since 7.1.0
 * @see PIXI.Graphics.curves
 */
export declare const GRAPHICS_CURVES: {
    adaptive: boolean;
    maxLength: number;
    minSegments: number;
    maxSegments: number;
    epsilon: number;
    _segmentsCount(length: number, defaultSegments?: number): number;
};
