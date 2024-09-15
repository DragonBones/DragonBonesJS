import type { ICanvas } from '@pixi/settings';
/**
 * Trim transparent borders from a canvas.
 * @memberof PIXI.utils
 * @param {PIXI.ICanvas} canvas - The canvas to trim.
 * @returns The trimmed canvas data.
 */
export declare function trimCanvas(canvas: ICanvas): {
    width: number;
    height: number;
    data: ImageData | null;
};
