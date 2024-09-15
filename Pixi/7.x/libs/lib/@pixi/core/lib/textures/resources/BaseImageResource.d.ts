import { Resource } from './Resource';
import type { Renderer } from '../../Renderer';
import type { BaseTexture, ImageSource } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
/**
 * Base for all the image/canvas resources.
 * @memberof PIXI
 */
export declare class BaseImageResource extends Resource {
    /**
     * The source element.
     * @member {PIXI.ImageSourcee}
     * @readonly
     */
    source: ImageSource;
    /**
     * If set to `true`, will force `texImage2D` over `texSubImage2D` for uploading.
     * Certain types of media (e.g. video) using `texImage2D` is more performant.
     * @default false
     * @private
     */
    noSubImage: boolean;
    /**
     * @param {PIXI.ImageSourcee} source
     */
    constructor(source: ImageSource);
    /**
     * Set cross origin based detecting the url and the crossorigin
     * @param element - Element to apply crossOrigin
     * @param url - URL to check
     * @param crossorigin - Cross origin value to use
     */
    static crossOrigin(element: HTMLImageElement | HTMLVideoElement, url: string, crossorigin?: boolean | string): void;
    /**
     * Upload the texture to the GPU.
     * @param renderer - Upload to the renderer
     * @param baseTexture - Reference to parent texture
     * @param glTexture
     * @param {PIXI.ImageSourcee} [source] - (optional)
     * @returns - true is success
     */
    upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture, source?: ImageSource): boolean;
    /**
     * Checks if source width/height was changed, resize can cause extra baseTexture update.
     * Triggers one update in any case.
     */
    update(): void;
    /** Destroy this {@link PIXI.BaseImageResource} */
    dispose(): void;
}
