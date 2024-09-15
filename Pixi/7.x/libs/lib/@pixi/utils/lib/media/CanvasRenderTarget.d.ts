import type { ICanvas, ICanvasRenderingContext2D } from '@pixi/settings';
/**
 * Creates a Canvas element of the given size to be used as a target for rendering to.
 * @class
 * @memberof PIXI.utils
 */
export declare class CanvasRenderTarget {
    protected _canvas: ICanvas | null;
    protected _context: ICanvasRenderingContext2D | null;
    /**
     * The resolution / device pixel ratio of the canvas
     * @default 1
     */
    resolution: number;
    /**
     * @param width - the width for the newly created canvas
     * @param height - the height for the newly created canvas
     * @param {number} [resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the canvas
     */
    constructor(width: number, height: number, resolution?: number);
    /**
     * Clears the canvas that was created by the CanvasRenderTarget class.
     * @private
     */
    clear(): void;
    /**
     * Resizes the canvas to the specified width and height.
     * @param desiredWidth - the desired width of the canvas
     * @param desiredHeight - the desired height of the canvas
     */
    resize(desiredWidth: number, desiredHeight: number): void;
    /** Destroys this canvas. */
    destroy(): void;
    /**
     * The width of the canvas buffer in pixels.
     * @member {number}
     */
    get width(): number;
    set width(val: number);
    /**
     * The height of the canvas buffer in pixels.
     * @member {number}
     */
    get height(): number;
    set height(val: number);
    /** The Canvas object that belongs to this CanvasRenderTarget. */
    get canvas(): ICanvas;
    /** A CanvasRenderingContext2D object representing a two-dimensional rendering context. */
    get context(): ICanvasRenderingContext2D;
    private _checkDestroyed;
}
