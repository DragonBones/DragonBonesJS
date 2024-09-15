import type { IBaseTextureOptions, Texture } from '@pixi/core';
import type { LoaderParser } from '../LoaderParser';
/**
 * Configuration for the `loadTextures` loader plugin.
 * @memberof PIXI
 * @see PIXI.loadTextures
 */
export interface LoadTextureConfig {
    /**
     * When set to `true`, loading and decoding images will happen with Worker thread,
     * if available on the browser. This is much more performant as network requests
     * and decoding can be expensive on the CPU. However, not all environments support
     * Workers, in some cases it can be helpful to disable by setting to `false`.
     * @default true
     */
    preferWorkers: boolean;
    /**
     * When set to `true`, loading and decoding images will happen with `createImageBitmap`,
     * otherwise it will use `new Image()`.
     * @default true
     */
    preferCreateImageBitmap: boolean;
    /**
     * The crossOrigin value to use for images when `preferCreateImageBitmap` is `false`.
     * @default 'anonymous'
     */
    crossOrigin: HTMLImageElement['crossOrigin'];
}
/**
 * Returns a promise that resolves an ImageBitmaps.
 * This function is designed to be used by a worker.
 * Part of WorkerManager!
 * @param url - The image to load an image bitmap for
 */
export declare function loadImageBitmap(url: string): Promise<ImageBitmap>;
/**
 * Loads our textures!
 * this makes use of imageBitmaps where available.
 * We load the ImageBitmap on a different thread using the WorkerManager
 * We can then use the ImageBitmap as a source for a Pixi Texture
 *
 * You can customize the behavior of this loader by setting the `config` property.
 * ```js
 * // Set the config
 * import { loadTextures } from '@pixi/assets';
 * loadTextures.config = {
 *    // If true we will use a worker to load the ImageBitmap
 *    preferWorkers: true,
 *    // If false we will use new Image() instead of createImageBitmap
 *    // If false then this will also disable the use of workers as it requires createImageBitmap
 *    preferCreateImageBitmap: true,
 *    crossOrigin: 'anonymous',
 * };
 * ```
 * @memberof PIXI
 */
export declare const loadTextures: LoaderParser<Texture<import("@pixi/core").Resource>, IBaseTextureOptions<any>, LoadTextureConfig>;
