import { Rectangle, RenderTexture } from '@pixi/core';
import type { ExtensionMetadata, ICanvas, ISystem, Renderer } from '@pixi/core';
import type { DisplayObject } from '@pixi/display';
export interface IExtract {
    image(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<HTMLImageElement>;
    base64(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<string>;
    canvas(target?: DisplayObject | RenderTexture, frame?: Rectangle): ICanvas;
    pixels(target?: DisplayObject | RenderTexture, frame?: Rectangle): Uint8Array | Uint8ClampedArray;
}
/**
 * This class provides renderer-specific plugins for exporting content from a renderer.
 * For instance, these plugins can be used for saving an Image, Canvas element or for exporting the raw image data (pixels).
 *
 * Do not instantiate these plugins directly. It is available from the `renderer.extract` property.
 * @example
 * import { Application, Graphics } from 'pixi.js';
 *
 * // Create a new application (extract will be auto-added to renderer)
 * const app = new Application();
 *
 * // Draw a red circle
 * const graphics = new Graphics()
 *     .beginFill(0xFF0000)
 *     .drawCircle(0, 0, 50);
 *
 * // Render the graphics as an HTMLImageElement
 * const image = await app.renderer.extract.image(graphics);
 * document.body.appendChild(image);
 * @memberof PIXI
 */
export declare class Extract implements ISystem, IExtract {
    /** @ignore */
    static extension: ExtensionMetadata;
    private renderer;
    /** Does the renderer have alpha and are its color channels stored premultipled by the alpha channel? */
    private _rendererPremultipliedAlpha;
    /**
     * @param renderer - A reference to the current renderer
     */
    constructor(renderer: Renderer);
    protected contextChange(): void;
    /**
     * Will return a HTML Image of the target
     * @param target - A displayObject or renderTexture
     *  to convert. If left empty will use the main renderer
     * @param format - Image format, e.g. "image/jpeg" or "image/webp".
     * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
     * @param frame - The frame the extraction is restricted to.
     * @returns - HTML Image of the target
     */
    image(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<HTMLImageElement>;
    /**
     * Will return a base64 encoded string of this target. It works by calling
     *  `Extract.canvas` and then running toDataURL on that.
     * @param target - A displayObject or renderTexture
     *  to convert. If left empty will use the main renderer
     * @param format - Image format, e.g. "image/jpeg" or "image/webp".
     * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
     * @param frame - The frame the extraction is restricted to.
     * @returns - A base64 encoded string of the texture.
     */
    base64(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<string>;
    /**
     * Creates a Canvas element, renders this target to it and then returns it.
     * @param target - A displayObject or renderTexture
     *  to convert. If left empty will use the main renderer
     * @param frame - The frame the extraction is restricted to.
     * @returns - A Canvas element with the texture rendered on.
     */
    canvas(target?: DisplayObject | RenderTexture, frame?: Rectangle): ICanvas;
    /**
     * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
     * order, with integer values between 0 and 255 (included).
     * @param target - A displayObject or renderTexture
     *  to convert. If left empty will use the main renderer
     * @param frame - The frame the extraction is restricted to.
     * @returns - One-dimensional array containing the pixel data of the entire texture
     */
    pixels(target?: DisplayObject | RenderTexture, frame?: Rectangle): Uint8Array;
    private _rawPixels;
    /** Destroys the extract. */
    destroy(): void;
    private static _flipY;
    private static _unpremultiplyAlpha;
}
