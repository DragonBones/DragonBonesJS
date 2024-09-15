import type { Loader } from './loader/Loader';
import type { ResolvedAsset } from './types';
/**
 * Quietly Loads assets in the background.
 * @memberof PIXI
 */
export declare class BackgroundLoader {
    /** Whether or not the loader should continue loading. */
    private _isActive;
    /** Assets to load. */
    private readonly _assetList;
    /** Whether or not the loader is loading. */
    private _isLoading;
    /** Number of assets to load at a time. */
    private readonly _maxConcurrent;
    /** Should the loader log to the console. */
    verbose: boolean;
    private readonly _loader;
    /**
     * @param loader
     * @param verbose - should the loader log to the console
     */
    constructor(loader: Loader, verbose?: boolean);
    /**
     * Adds an array of assets to load.
     * @param assetUrls - assets to load
     */
    add(assetUrls: ResolvedAsset[]): void;
    /**
     * Loads the next set of assets. Will try to load as many assets as it can at the same time.
     *
     * The max assets it will try to load at one time will be 4.
     */
    private _next;
    /**
     * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
     * @returns whether the class is active
     */
    get active(): boolean;
    set active(value: boolean);
}
