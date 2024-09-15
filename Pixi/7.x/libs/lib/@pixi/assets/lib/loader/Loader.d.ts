import type { ResolvedAsset } from '../types';
import type { LoaderParser } from './parsers/LoaderParser';
import type { PromiseAndParser } from './types';
/**
 * The Loader is responsible for loading all assets, such as images, spritesheets, audio files, etc.
 * It does not do anything clever with URLs - it just loads stuff!
 * Behind the scenes all things are cached using promises. This means it's impossible to load an asset more than once.
 * Through the use of LoaderParsers, the loader can understand how to load any kind of file!
 *
 * It is not intended that this class is created by developers - its part of the Asset class
 * This is the second major system of PixiJS' main Assets class
 * @memberof PIXI
 * @class AssetLoader
 */
export declare class Loader {
    private _parsers;
    private _parserHash;
    private _parsersValidated;
    /** All loader parsers registered */
    parsers: LoaderParser<any, any, Record<string, any>>[];
    /** Cache loading promises that ae currently active */
    promiseCache: Record<string, PromiseAndParser>;
    /** function used for testing */
    reset(): void;
    /**
     * Used internally to generate a promise for the asset to be loaded.
     * @param url - The URL to be loaded
     * @param data - any custom additional information relevant to the asset being loaded
     * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
     */
    private _getLoadPromiseAndParser;
    /**
     * Loads one or more assets using the parsers added to the Loader.
     * @example
     * // Single asset:
     * const asset = await Loader.load('cool.png');
     * console.log(asset);
     *
     * // Multiple assets:
     * const assets = await Loader.load(['cool.png', 'cooler.png']);
     * console.log(assets);
     * @param assetsToLoadIn - urls that you want to load, or a single one!
     * @param onProgress - For multiple asset loading only, an optional function that is called
     * when progress on asset loading is made. The function is passed a single parameter, `progress`,
     * which represents the percentage (0.0 - 1.0) of the assets loaded. Do not use this function
     * to detect when assets are complete and available, instead use the Promise returned by this function.
     */
    load<T = any>(assetsToLoadIn: string | ResolvedAsset, onProgress?: (progress: number) => void): Promise<T>;
    load<T = any>(assetsToLoadIn: string[] | ResolvedAsset[], onProgress?: (progress: number) => void): Promise<Record<string, T>>;
    /**
     * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
     * The parser that created the asset, will be the one that unloads it.
     * @example
     * // Single asset:
     * const asset = await Loader.load('cool.png');
     *
     * await Loader.unload('cool.png');
     *
     * console.log(asset.destroyed); // true
     * @param assetsToUnloadIn - urls that you want to unload, or a single one!
     */
    unload(assetsToUnloadIn: string | string[] | ResolvedAsset | ResolvedAsset[]): Promise<void>;
    /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
    private _validateParsers;
}
