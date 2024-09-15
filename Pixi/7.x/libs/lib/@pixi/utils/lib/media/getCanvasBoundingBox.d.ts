import { BoundingBox } from './BoundingBox';
import type { ICanvas } from '@pixi/settings';
/**
 * Measuring the bounds of a canvas' visible (non-transparent) pixels.
 * @memberof PIXI.utils
 * @param {PIXI.ICanvas} canvas - The canvas to measure.
 * @returns {PIXI.utils.BoundingBox} The bounding box of the canvas' visible pixels.
 * @since 7.1.0
 */
export declare function getCanvasBoundingBox(canvas: ICanvas): BoundingBox;
