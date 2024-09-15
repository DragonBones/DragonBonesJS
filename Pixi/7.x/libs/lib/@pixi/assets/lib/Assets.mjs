import { utils, extensions, ExtensionType } from "@pixi/core";
import { BackgroundLoader } from "./BackgroundLoader.mjs";
import { Cache } from "./cache/Cache.mjs";
import { Loader } from "./loader/Loader.mjs";
import "./loader/parsers/index.mjs";
import { Resolver } from "./resolver/Resolver.mjs";
import { convertToList } from "./utils/convertToList.mjs";
import { isSingleItem } from "./utils/isSingleItem.mjs";
import { loadTextures } from "./loader/parsers/textures/loadTextures.mjs";
class AssetsClass {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Resolver(), this.loader = new Loader(), this.cache = Cache, this._backgroundLoader = new BackgroundLoader(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Asset class to work, only if you want to set any initial properties
   * @param options - options to initialize the Asset manager with
   */
  async init(options = {}) {
    if (this._initialized) {
      console.warn("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, options.defaultSearchParams && this.resolver.setDefaultSearchParams(options.defaultSearchParams), options.basePath && (this.resolver.basePath = options.basePath), options.bundleIdentifier && this.resolver.setBundleIdentifier(options.bundleIdentifier), options.manifest) {
      let manifest = options.manifest;
      typeof manifest == "string" && (manifest = await this.load(manifest)), this.resolver.addManifest(manifest);
    }
    const resolutionPref = options.texturePreference?.resolution ?? 1, resolution = typeof resolutionPref == "number" ? [resolutionPref] : resolutionPref, formats = await this._detectFormats({
      preferredFormats: options.texturePreference?.format,
      skipDetections: options.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: formats,
        resolution
      }
    }), options.preferences && this.setPreferences(options.preferences);
  }
  add(aliases, srcs, data, format, loadParser) {
    this.resolver.add(aliases, srcs, data, format, loadParser);
  }
  async load(urls, onProgress) {
    this._initialized || await this.init();
    const singleAsset = isSingleItem(urls), urlArray = convertToList(urls).map((url) => {
      if (typeof url != "string") {
        const aliases = this.resolver.getAlias(url);
        return aliases.some((alias) => !this.resolver.hasKey(alias)) && this.add(url), Array.isArray(aliases) ? aliases[0] : aliases;
      }
      return this.resolver.hasKey(url) || this.add({ alias: url, src: url }), url;
    }), resolveResults = this.resolver.resolve(urlArray), out = await this._mapLoadToResolve(resolveResults, onProgress);
    return singleAsset ? out[urlArray[0]] : out;
  }
  /**
   * This adds a bundle of assets in one go so that you can load them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const assets = await Assets.loadBundle('animals');
   * @param bundleId - the id of the bundle to add
   * @param assets - a record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(bundleId, assets) {
    this.resolver.addBundle(bundleId, assets);
  }
  /**
   * Bundles are a way to load multiple assets at once.
   * If a manifest has been provided to the init function then you can load a bundle, or bundles.
   * you can also add bundles via `addBundle`
   * @example
   * import { Assets } from 'pixi.js';
   *
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
   * await Assets.init({ manifest });
   *
   * // Load a bundle...
   * loadScreenAssets = await Assets.loadBundle('load-screen');
   * // Load another bundle...
   * gameScreenAssets = await Assets.loadBundle('game-screen');
   * @param bundleIds - the bundle id or ids to load
   * @param onProgress - Optional function that is called when progress on asset loading is made.
   * The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0)
   * of the assets loaded. Do not use this function to detect when assets are complete and available,
   * instead use the Promise returned by this function.
   * @returns all the bundles assets or a hash of assets for each bundle specified
   */
  async loadBundle(bundleIds, onProgress) {
    this._initialized || await this.init();
    let singleAsset = !1;
    typeof bundleIds == "string" && (singleAsset = !0, bundleIds = [bundleIds]);
    const resolveResults = this.resolver.resolveBundle(bundleIds), out = {}, keys = Object.keys(resolveResults);
    let count = 0, total = 0;
    const _onProgress = () => {
      onProgress?.(++count / total);
    }, promises = keys.map((bundleId) => {
      const resolveResult = resolveResults[bundleId];
      return total += Object.keys(resolveResult).length, this._mapLoadToResolve(resolveResult, _onProgress).then((resolveResult2) => {
        out[bundleId] = resolveResult2;
      });
    });
    return await Promise.all(promises), singleAsset ? out[bundleIds[0]] : out;
  }
  /**
   * Initiate a background load of some assets. It will passively begin to load these assets in the background.
   * So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately
   *
   * An example of this might be that you would background load game assets after your inital load.
   * then when you got to actually load your game screen assets when a player goes to the game - the loading
   * would already have stared or may even be complete, saving you having to show an interim load bar.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.backgroundLoad('bunny.png');
   *
   * // later on in your app...
   * await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
   * @param urls - the url / urls you want to background load
   */
  async backgroundLoad(urls) {
    this._initialized || await this.init(), typeof urls == "string" && (urls = [urls]);
    const resolveResults = this.resolver.resolve(urls);
    this._backgroundLoader.add(Object.values(resolveResults));
  }
  /**
   * Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
   * this can only be used if the loader has been initiated with a manifest
   * @example
   * import { Assets } from 'pixi.js';
   *
   * await Assets.init({
   *     manifest: {
   *         bundles: [
   *             {
   *                 name: 'load-screen',
   *                 assets: [...],
   *             },
   *             ...
   *         ],
   *     },
   * });
   *
   * Assets.backgroundLoadBundle('load-screen');
   *
   * // Later on in your app...
   * await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
   * @param bundleIds - the bundleId / bundleIds you want to background load
   */
  async backgroundLoadBundle(bundleIds) {
    this._initialized || await this.init(), typeof bundleIds == "string" && (bundleIds = [bundleIds]);
    const resolveResults = this.resolver.resolveBundle(bundleIds);
    Object.values(resolveResults).forEach((resolveResult) => {
      this._backgroundLoader.add(Object.values(resolveResult));
    });
  }
  /**
   * Only intended for development purposes.
   * This will wipe the resolver and caches.
   * You will need to reinitialize the Asset
   */
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
  }
  get(keys) {
    if (typeof keys == "string")
      return Cache.get(keys);
    const assets = {};
    for (let i = 0; i < keys.length; i++)
      assets[i] = Cache.get(keys[i]);
    return assets;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param onProgress - the progress callback
   */
  async _mapLoadToResolve(resolveResults, onProgress) {
    const resolveArray = Object.values(resolveResults), resolveKeys = Object.keys(resolveResults);
    this._backgroundLoader.active = !1;
    const loadedAssets = await this.loader.load(resolveArray, onProgress);
    this._backgroundLoader.active = !0;
    const out = {};
    return resolveArray.forEach((resolveResult, i) => {
      const asset = loadedAssets[resolveResult.src], keys = [resolveResult.src];
      resolveResult.alias && keys.push(...resolveResult.alias), out[resolveKeys[i]] = asset, Cache.set(keys, asset);
    }), out;
  }
  /**
   * Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
   * this will make sure to destroy any assets and release them from memory.
   * Once unloaded, you will need to load the asset again.
   *
   * Use this to help manage assets if you find that you have a large app and you want to free up memory.
   *
   * - it's up to you as the developer to make sure that textures are not actively being used when you unload them,
   * Pixi won't break but you will end up with missing assets. Not a good look for the user!
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Load a URL:
   * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
   *
   * await Assets.unload('http://some.url.com/image.png')
   *
   * // myImageTexture will be destroyed now.
   *
   * // Unload multiple assets:
   * const textures = await Assets.unload(['thumper', 'chicko']);
   * @param urls - the urls to unload
   */
  async unload(urls) {
    this._initialized || await this.init();
    const urlArray = convertToList(urls).map((url) => typeof url != "string" ? url.src : url), resolveResults = this.resolver.resolve(urlArray);
    await this._unloadFromResolved(resolveResults);
  }
  /**
   * Bundles are a way to manage multiple assets at once.
   * this will unload all files in a bundle.
   *
   * once a bundle has been unloaded, you need to load it again to have access to the assets.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle({
   *     'thumper': 'http://some.url.com/thumper.png',
   * })
   *
   * const assets = await Assets.loadBundle('thumper');
   *
   * // Now to unload...
   *
   * await Assets.unloadBundle('thumper');
   *
   * // All assets in the assets object will now have been destroyed and purged from the cache
   * @param bundleIds - the bundle id or ids to unload
   */
  async unloadBundle(bundleIds) {
    this._initialized || await this.init(), bundleIds = convertToList(bundleIds);
    const resolveResults = this.resolver.resolveBundle(bundleIds), promises = Object.keys(resolveResults).map((bundleId) => this._unloadFromResolved(resolveResults[bundleId]));
    await Promise.all(promises);
  }
  async _unloadFromResolved(resolveResult) {
    const resolveArray = Object.values(resolveResult);
    resolveArray.forEach((resolveResult2) => {
      Cache.remove(resolveResult2.src);
    }), await this.loader.unload(resolveArray);
  }
  /**
   * Detects the supported formats for the browser, and returns an array of supported formats, respecting
   * the users preferred formats order.
   * @param options - the options to use when detecting formats
   * @param options.preferredFormats - the preferred formats to use
   * @param options.skipDetections - if we should skip the detections altogether
   * @param options.detections - the detections to use
   * @returns - the detected formats
   */
  async _detectFormats(options) {
    let formats = [];
    options.preferredFormats && (formats = Array.isArray(options.preferredFormats) ? options.preferredFormats : [options.preferredFormats]);
    for (const detection of options.detections)
      options.skipDetections || await detection.test() ? formats = await detection.add(formats) : options.skipDetections || (formats = await detection.remove(formats));
    return formats = formats.filter((format, index) => formats.indexOf(format) === index), formats;
  }
  /** All the detection parsers currently added to the Assets class. */
  get detections() {
    return this._detections;
  }
  /**
   * @deprecated since 7.2.0
   * @see {@link Assets.setPreferences}
   */
  get preferWorkers() {
    return loadTextures.config.preferWorkers;
  }
  set preferWorkers(value) {
    utils.deprecation("7.2.0", "Assets.prefersWorkers is deprecated, use Assets.setPreferences({ preferWorkers: true }) instead."), this.setPreferences({ preferWorkers: value });
  }
  /**
   * General setter for preferences. This is a helper function to set preferences on all parsers.
   * @param preferences - the preferences to set
   */
  setPreferences(preferences) {
    this.loader.parsers.forEach((parser) => {
      parser.config && Object.keys(parser.config).filter((key) => key in preferences).forEach((key) => {
        parser.config[key] = preferences[key];
      });
    });
  }
}
const Assets = new AssetsClass();
extensions.handleByList(ExtensionType.LoadParser, Assets.loader.parsers).handleByList(ExtensionType.ResolveParser, Assets.resolver.parsers).handleByList(ExtensionType.CacheParser, Assets.cache.parsers).handleByList(ExtensionType.DetectionParser, Assets.detections);
export {
  Assets,
  AssetsClass
};
//# sourceMappingURL=Assets.mjs.map
