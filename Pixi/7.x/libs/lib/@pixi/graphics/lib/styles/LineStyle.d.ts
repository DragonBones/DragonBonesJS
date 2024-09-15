import { LINE_CAP, LINE_JOIN } from '../const';
import { FillStyle } from './FillStyle';
/**
 * Represents the line style for Graphics.
 * @memberof PIXI
 */
export declare class LineStyle extends FillStyle {
    /** The width (thickness) of any lines drawn. */
    width: number;
    /** The alignment of any lines drawn (0.5 = middle, 1 = outer, 0 = inner). WebGL only. */
    alignment: number;
    /** If true the lines will be draw using LINES instead of TRIANGLE_STRIP. */
    native: boolean;
    /**
     * Line cap style.
     * @member {PIXI.LINE_CAP}
     * @default PIXI.LINE_CAP.BUTT
     */
    cap: LINE_CAP;
    /**
     * Line join style.
     * @member {PIXI.LINE_JOIN}
     * @default PIXI.LINE_JOIN.MITER
     */
    join: LINE_JOIN;
    /** Miter limit. */
    miterLimit: number;
    /** Clones the object. */
    clone(): LineStyle;
    /** Reset the line style to default. */
    reset(): void;
}
