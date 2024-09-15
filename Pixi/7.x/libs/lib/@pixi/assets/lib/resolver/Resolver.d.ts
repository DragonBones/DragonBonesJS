import type { ArrayOr, AssetsBundle, AssetsManifest, AssetSrc, LoadParserName, ResolvedAsset, UnresolvedAsset } from '../types';
import type { PreferOrder, ResolveURLParser } from './types';
export interface BundleIdentifierOptions {
    /** The character that is used to connect the bundleId and the assetId when generating a bundle asset id key */
    connector?: string;
    /**
     * A function that generates a bundle asset id key from a bundleId and an assetId
     * @param bundleId - the bundleId
     * @param assetId  - the assetId
     * @returns the bundle asset id key
     */
    createBundleAssetId?: (bundleId: string, assetId: string) => string;
    /**
     * A function that generates an assetId from a bundle asset id key. This is the reverse of generateBundleAssetId
     * @param bundleId - the bundleId
     * @param assetBundleId - the bundle asset id key
     * @returns the assetId
     */
    extractAssetIdFromBundle?: (bundleId: string, assetBundleId: string) => string;
}
/**
 * A class that is responsible for resolving mapping asset URLs to keys.
 * At its most basic it can be used for Aliases:
 *
 * ```js
 * resolver.add('foo', 'bar');
 * resolver.resolveUrl('foo') // => 'bar'
 * ```
 *
 * It can also be used to resolve the most appropriate asset for a given URL:
 *
 * ```js
 * resolver.prefer({
 *     params: {
 *         format: 'webp',
 *         resolution: 2,
 *     }
 * });
 *
 * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
 *
 * resolver.resolveUrl('foo') // => 'bar@2x.webp'
 * ```
 * Other features include:
 * - Ability to process a manifest file to get the correct understanding of how to resolve all assets
 * - Ability to add custom parsers for specific file types
 * - Ability to add custom prefer rules
 *
 * This class only cares about the URL, not the loading of the asset itself.
 *
 * It is not intended that this class is created by developers - its part of the Asset class
 * This is the third major system of PixiJS' main Assets class
 * @memberof PIXI
 */
export declare class Resolver {
    private _defaultBundleIdentifierOptions;
    /** The character that is used to connect the bundleId and the assetId when generating a bundle asset id key */
    private _bundleIdConnector;
    /**
     * A function that generates a bundle asset id key from a bundleId and an assetId
     * @param bundleId - the bundleId
     * @param assetId  - the assetId
     * @returns the bundle asset id key
     */
    private _createBundleAssetId;
    /**
     * A function that generates an assetId from a bundle asset id key. This is the reverse of generateBundleAssetId
     * @param bundleId - the bundleId
     * @param assetBundleId - the bundle asset id key
     * @returns the assetId
     */
    private _extractAssetIdFromBundle;
    private _assetMap;
    private _preferredOrder;
    private _parsers;
    private _resolverHash;
    private _rootPath;
    private _basePath;
    private _manifest;
    private _bundles;
    private _defaultSearchParams;
    /**
     * Override how the resolver deals with generating bundle ids.
     * must be called before any bundles are added
     * @param bundleIdentifier - the bundle identifier options
     */
    setBundleIdentifier(bundleIdentifier: BundleIdentifierOptions): void;
    /**
     * Let the resolver know which assets you prefer to use when resolving assets.
     * Multiple prefer user defined rules can be added.
     * @example
     * resolver.prefer({
     *     // first look for something with the correct format, and then then correct resolution
     *     priority: ['format', 'resolution'],
     *     params:{
     *         format:'webp', // prefer webp images
     *         resolution: 2, // prefer a resolution of 2
     *     }
     * })
     * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
     * resolver.resolveUrl('foo') // => 'bar@2x.webp'
     * @param preferOrders - the prefer options
     */
    prefer(...preferOrders: PreferOrder[]): void;
    /**
     * Set the base path to prepend to all urls when resolving
     * @example
     * resolver.basePath = 'https://home.com/';
     * resolver.add('foo', 'bar.ong');
     * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
     * @param basePath - the base path to use
     */
    set basePath(basePath: string);
    get basePath(): string;
    /**
     * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
     * default value for browsers is `window.location.origin`
     * @example
     * // Application hosted on https://home.com/some-path/index.html
     * resolver.basePath = 'https://home.com/some-path/';
     * resolver.rootPath = 'https://home.com/';
     * resolver.add('foo', '/bar.png');
     * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
     * @param rootPath - the root path to use
     */
    set rootPath(rootPath: string);
    get rootPath(): string;
    /**
     * All the active URL parsers that help the parser to extract information and create
     * an asset object-based on parsing the URL itself.
     *
     * Can be added using the extensions API
     * @example
     * resolver.add('foo', [
     *     {
     *         resolution: 2,
     *         format: 'png',
     *         src: 'image@2x.png',
     *     },
     *     {
     *         resolution:1,
     *         format:'png',
     *         src: 'image.png',
     *     },
     * ]);
     *
     * // With a url parser the information such as resolution and file format could extracted from the url itself:
     * extensions.add({
     *     extension: ExtensionType.ResolveParser,
     *     test: loadTextures.test, // test if url ends in an image
     *     parse: (value: string) =>
     *     ({
     *         resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
     *         format: value.split('.').pop(),
     *         src: value,
     *     }),
     * });
     *
     * // Now resolution and format can be extracted from the url
     * resolver.add('foo', [
     *     'image@2x.png',
     *     'image.png',
     * ]);
     */
    get parsers(): ResolveURLParser[];
    /** Used for testing, this resets the resolver to its initial state */
    reset(): void;
    /**
     * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
     * @param searchParams - the default url parameters to append when resolving urls
     */
    setDefaultSearchParams(searchParams: string | Record<string, unknown>): void;
    /**
     * Returns the aliases for a given asset
     * @param asset - the asset to get the aliases for
     */
    getAlias(asset: UnresolvedAsset): string[];
    /**
     * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
     * generally a manifest would be built using a tool.
     * @param manifest - the manifest to add to the resolver
     */
    addManifest(manifest: AssetsManifest): void;
    /**
     * This adds a bundle of assets in one go so that you can resolve them as a group.
     * For example you could add a bundle for each screen in you pixi app
     * @example
     * resolver.addBundle('animals', {
     *     bunny: 'bunny.png',
     *     chicken: 'chicken.png',
     *     thumper: 'thumper.png',
     * });
     *
     * const resolvedAssets = await resolver.resolveBundle('animals');
     * @param bundleId - The id of the bundle to add
     * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
     */
    addBundle(bundleId: string, assets: AssetsBundle['assets']): void;
    /** @deprecated */
    add(a: ArrayOr<string>, s?: AssetSrc, d?: unknown, f?: string, lp?: LoadParserName): void;
    /**
     * Tells the resolver what keys are associated with witch asset.
     * The most important thing the resolver does
     * @example
     * // Single key, single asset:
     * resolver.add({alias: 'foo', src: 'bar.png');
     * resolver.resolveUrl('foo') // => 'bar.png'
     *
     * // Multiple keys, single asset:
     * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
     * resolver.resolveUrl('foo') // => 'bar.png'
     * resolver.resolveUrl('boo') // => 'bar.png'
     *
     * // Multiple keys, multiple assets:
     * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
     * resolver.resolveUrl('foo') // => 'bar.png'
     *
     * // Add custom data attached to the resolver
     * Resolver.add({
     *     alias: 'bunnyBooBooSmooth',
     *     src: 'bunny{png,webp}',
     *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
     * });
     *
     * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
     * @param data - the data to add to the resolver
     * @param data.aliases - the key or keys that you will reference when loading this asset
     * @param data.srcs - the asset or assets that will be chosen from when loading via the specified key
     * @param data.data - asset-specific data that will be passed to the loaders
     * - Useful if you want to initiate loaded objects with specific data
     * @param data.format - the format of the asset
     * @param data.loadParser - the name of the load parser to use
     */
    add(data: (ArrayOr<UnresolvedAsset>)): void;
    /**
     * If the resolver has had a manifest set via setManifest, this will return the assets urls for
     * a given bundleId or bundleIds.
     * @example
     * // Manifest Example
     * const manifest = {
     *     bundles: [
     *         {
     *             name: 'load-screen',
     *             assets: [
     *                 {
     *                     alias: 'background',
     *                     src: 'sunset.png',
     *                 },
     *                 {
     *                     alias: 'bar',
     *                     src: 'load-bar.{png,webp}',
     *                 },
     *             ],
     *         },
     *         {
     *             name: 'game-screen',
     *             assets: [
     *                 {
     *                     alias: 'character',
     *                     src: 'robot.png',
     *                 },
     *                 {
     *                     alias: 'enemy',
     *                     src: 'bad-guy.png',
     *                 },
     *             ],
     *         },
     *     ]
     * };
     *
     * resolver.setManifest(manifest);
     * const resolved = resolver.resolveBundle('load-screen');
     * @param bundleIds - The bundle ids to resolve
     * @returns All the bundles assets or a hash of assets for each bundle specified
     */
    resolveBundle(bundleIds: ArrayOr<string>): Record<string, ResolvedAsset> | Record<string, Record<string, ResolvedAsset>>;
    /**
     * Does exactly what resolve does, but returns just the URL rather than the whole asset object
     * @param key - The key or keys to resolve
     * @returns - The URLs associated with the key(s)
     */
    resolveUrl(key: ArrayOr<string>): string | Record<string, string>;
    /**
     * Resolves each key in the list to an asset object.
     * Another key function of the resolver! After adding all the various key/asset pairs. this will run the logic
     * of finding which asset to return based on any preferences set using the `prefer` function
     * by default the same key passed in will be returned if nothing is matched by the resolver.
     * @example
     * resolver.add('boo', 'bunny.png');
     *
     * resolver.resolve('boo') // => { src: 'bunny.png' }
     *
     * // Will return the same string as no key was added for this value..
     * resolver.resolve('another-thing.png') // => { src: 'another-thing.png' }
     * @param keys - key or keys to resolve
     * @returns - the resolve asset or a hash of resolve assets for each key specified
     */
    resolve(keys: string): ResolvedAsset;
    resolve(keys: string[]): Record<string, ResolvedAsset>;
    /**
     * Checks if an asset with a given key exists in the resolver
     * @param key - The key of the asset
     */
    hasKey(key: string): boolean;
    /**
     * Checks if a bundle with the given key exists in the resolver
     * @param key - The key of the bundle
     */
    hasBundle(key: string): boolean;
    /**
     * Internal function for figuring out what prefer criteria an asset should use.
     * @param assets
     */
    private _getPreferredOrder;
    /**
     * Appends the default url parameters to the url
     * @param url - The url to append the default parameters to
     * @returns - The url with the default parameters appended
     */
    private _appendDefaultSearchParams;
    private buildResolvedAsset;
}
