import { ALPHA_MODES } from '@pixi/constants';
import { BaseImageResource } from './BaseImageResource';
import type { Renderer } from '../../Renderer';
import type { BaseTexture } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
/**
 * Options for ImageBitmapResource.
 * @memberof PIXI
 */
export interface IImageBitmapResourceOptions {
    /** Start loading process automatically when constructed. */
    autoLoad?: boolean;
    /** Load image using cross origin. */
    crossOrigin?: boolean;
    /** Alpha mode used when creating the ImageBitmap. */
    alphaMode?: ALPHA_MODES;
    /**
     * Whether the underlying ImageBitmap is owned by the {@link PIXI.ImageBitmapResource}. When set to `true`,
     * the underlying ImageBitmap will be disposed automatically when disposing {@link PIXI.ImageBitmapResource}.
     * If this option is not set, whether it owns the underlying ImageBitmap is determained by the type of `source`
     * used when constructing {@link PIXI.ImageBitmapResource}:
     * - When `source` is `ImageBitmap`, the underlying ImageBitmap is not owned by default.
     * - When `source` is `string` (a URL), the underlying ImageBitmap is owned by default.
     * @see PIXI.ImageBitmapResource.ownsImageBitmap
     */
    ownsImageBitmap?: boolean;
}
/**
 * Resource type for ImageBitmap.
 * @memberof PIXI
 */
export declare class ImageBitmapResource extends BaseImageResource {
    /** URL of the image source. */
    url: string | null;
    /**
     * Load image using cross origin.
     * @default false
     */
    crossOrigin: boolean;
    /**
     * Controls texture alphaMode field
     * Copies from options
     * Default is `null`, copies option from baseTexture
     * @readonly
     */
    alphaMode: ALPHA_MODES | null;
    /**
     * Whether the underlying ImageBitmap is owned by the ImageBitmapResource.
     * @see PIXI.IImageBitmapResourceOptions.ownsImageBitmap
     */
    private ownsImageBitmap;
    /**
     * Promise when loading.
     * @default null
     */
    private _load;
    /**
     * @param source - ImageBitmap or URL to use.
     * @param options - Options to use.
     */
    constructor(source: ImageBitmap | string, options?: IImageBitmapResourceOptions);
    load(): Promise<this>;
    /**
     * Upload the image bitmap resource to GPU.
     * @param renderer - Renderer to upload to
     * @param baseTexture - BaseTexture for this resource
     * @param glTexture - GLTexture to use
     * @returns {boolean} true is success
     */
    upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
    /** Destroys this resource. */
    dispose(): void;
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @returns {boolean} `true` if current environment support ImageBitmap, and source is string or ImageBitmap
     */
    static test(source: unknown): source is string | ImageBitmap;
    /**
     * Cached empty placeholder canvas.
     * @see EMPTY
     */
    private static _EMPTY;
    /**
     * ImageBitmap cannot be created synchronously, so a empty placeholder canvas is needed when loading from URLs.
     * Only for internal usage.
     * @returns The cached placeholder canvas.
     */
    private static get EMPTY();
}
