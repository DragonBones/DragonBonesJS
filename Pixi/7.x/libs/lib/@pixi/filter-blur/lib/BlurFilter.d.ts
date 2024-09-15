import { CLEAR_MODES, Filter } from '@pixi/core';
import { BlurFilterPass } from './BlurFilterPass';
import type { BLEND_MODES, FilterSystem, RenderTexture } from '@pixi/core';
/**
 * The BlurFilter applies a Gaussian blur to an object.
 *
 * The strength of the blur can be set for the x-axis and y-axis separately.
 * @memberof PIXI
 */
export declare class BlurFilter extends Filter {
    blurXFilter: BlurFilterPass;
    blurYFilter: BlurFilterPass;
    private _repeatEdgePixels;
    /**
     * @param strength - The strength of the blur filter.
     * @param quality - The quality of the blur filter.
     * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
     * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
     */
    constructor(strength?: number, quality?: number, resolution?: number, kernelSize?: number);
    /**
     * Applies the filter.
     * @param filterManager - The manager.
     * @param input - The input target.
     * @param output - The output target.
     * @param clearMode - How to clear
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
    protected updatePadding(): void;
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the number of passes for blur. More passes means higher quality bluring.
     * @default 1
     */
    get quality(): number;
    set quality(value: number);
    /**
     * Sets the strength of the blurX property
     * @default 2
     */
    get blurX(): number;
    set blurX(value: number);
    /**
     * Sets the strength of the blurY property
     * @default 2
     */
    get blurY(): number;
    set blurY(value: number);
    /**
     * Sets the blendmode of the filter
     * @default PIXI.BLEND_MODES.NORMAL
     */
    get blendMode(): BLEND_MODES;
    set blendMode(value: BLEND_MODES);
    /**
     * If set to true the edge of the target will be clamped
     * @default false
     */
    get repeatEdgePixels(): boolean;
    set repeatEdgePixels(value: boolean);
}
