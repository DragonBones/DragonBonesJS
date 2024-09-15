import type { FillStyle } from '../styles/FillStyle';
import type { LineStyle } from '../styles/LineStyle';
/**
 * A structure to hold interim batch objects for Graphics.
 * @memberof PIXI.graphicsUtils
 */
export declare class BatchPart {
    style: LineStyle | FillStyle;
    start: number;
    size: number;
    attribStart: number;
    attribSize: number;
    constructor();
    /**
     * Begin batch part.
     * @param style
     * @param startIndex
     * @param attribStart
     */
    begin(style: LineStyle | FillStyle, startIndex: number, attribStart: number): void;
    /**
     * End batch part.
     * @param endIndex
     * @param endAttrib
     */
    end(endIndex: number, endAttrib: number): void;
    reset(): void;
}
