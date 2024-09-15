import { ALPHA_MODES } from '@pixi/constants';
import { BaseImageResource } from './BaseImageResource';
import type { Renderer } from '../../Renderer';
import type { BaseTexture } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
export interface IImageResourceOptions {
    /** Start loading process automatically when constructed. */
    autoLoad?: boolean;
    /** Whether its required to create a bitmap before upload. */
    createBitmap?: boolean;
    /** Load image using cross origin. */
    crossorigin?: boolean | string;
    /** Premultiply image alpha in bitmap. */
    alphaMode?: ALPHA_MODES;
}
/**
 * Resource type for HTMLImageElement.
 * @memberof PIXI
 */
export declare class ImageResource extends BaseImageResource {
    /** URL of the image source */
    url: string;
    /**
     * If the image should be disposed after upload
     * @default false
     */
    preserveBitmap: boolean;
    /**
     * If capable, convert the image using createImageBitmap API.
     * @default PIXI.settings.CREATE_IMAGE_BITMAP
     */
    createBitmap: boolean;
    /**
     * Controls texture alphaMode field
     * Copies from options
     * Default is `null`, copies option from baseTexture
     * @readonly
     */
    alphaMode: ALPHA_MODES;
    /**
     * The ImageBitmap element created for a {@link HTMLImageElement}.
     * @default null
     */
    bitmap: ImageBitmap;
    /**
     * Promise when loading.
     * @default null
     */
    private _load;
    /** When process is completed */
    private _process;
    /**
     * @param source - image source or URL
     * @param options
     * @param {boolean} [options.autoLoad=true] - start loading process
     * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - whether its required to create
     *        a bitmap before upload
     * @param {boolean} [options.crossorigin=true] - Load image using cross origin
     * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Premultiply image alpha in bitmap
     */
    constructor(source: HTMLImageElement | string, options?: IImageResourceOptions);
    /**
     * Returns a promise when image will be loaded and processed.
     * @param createBitmap - whether process image into bitmap
     */
    load(createBitmap?: boolean): Promise<this>;
    /**
     * Called when we need to convert image into BitmapImage.
     * Can be called multiple times, real promise is cached inside.
     * @returns - Cached promise to fill that bitmap
     */
    process(): Promise<this>;
    /**
     * Upload the image resource to GPU.
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
     * @returns {boolean} `true` if current environment support HTMLImageElement, and source is string or HTMLImageElement
     */
    static test(source: unknown): source is string | HTMLImageElement;
}
