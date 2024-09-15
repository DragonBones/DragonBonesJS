import { BaseImageResource } from './BaseImageResource';
import type { ICanvas } from '@pixi/settings';
/**
 * Resource type for HTMLCanvasElement and OffscreenCanvas.
 * @memberof PIXI
 */
export declare class CanvasResource extends BaseImageResource {
    /**
     * @param source - Canvas element to use
     */
    constructor(source: ICanvas);
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @returns {boolean} `true` if source is HTMLCanvasElement or OffscreenCanvas
     */
    static test(source: unknown): source is OffscreenCanvas | HTMLCanvasElement;
}
