import { CLEAR_MODES, Filter } from '@pixi/core';
import type { FilterSystem, RenderTexture } from '@pixi/core';
/**
 * The BlurFilterPass applies a horizontal or vertical Gaussian blur to an object.
 * @memberof PIXI
 */
export declare class BlurFilterPass extends Filter {
    horizontal: boolean;
    strength: number;
    passes: number;
    private _quality;
    /**
     * @param horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
     * @param strength - The strength of the blur filter.
     * @param quality - The quality of the blur filter.
     * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
     * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
     */
    constructor(horizontal: boolean, strength?: number, quality?: number, resolution?: number, kernelSize?: number);
    /**
     * Applies the filter.
     * @param filterManager - The manager.
     * @param input - The input target.
     * @param output - The output target.
     * @param clearMode - How to clear
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
    /**
     * Sets the strength of both the blur.
     * @default 16
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the quality of the blur by modifying the number of passes. More passes means higher
     * quality bluring but the lower the performance.
     * @default 4
     */
    get quality(): number;
    set quality(value: number);
}
