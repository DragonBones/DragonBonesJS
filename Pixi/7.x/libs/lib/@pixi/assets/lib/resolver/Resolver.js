"use strict";
var core = require("@pixi/core"), convertToList = require("../utils/convertToList.js"), createStringVariations = require("../utils/createStringVariations.js"), isSingleItem = require("../utils/isSingleItem.js");
class Resolver {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (bundleId, assetId) => `${bundleId}${this._bundleIdConnector}${assetId}`,
      extractAssetIdFromBundle: (bundleId, assetBundleId) => assetBundleId.replace(`${bundleId}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(bundleIdentifier) {
    if (this._bundleIdConnector = bundleIdentifier.connector ?? this._bundleIdConnector, this._createBundleAssetId = bundleIdentifier.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = bundleIdentifier.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
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
  prefer(...preferOrders) {
    preferOrders.forEach((prefer) => {
      this._preferredOrder.push(prefer), prefer.priority || (prefer.priority = Object.keys(prefer.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(basePath) {
    this._basePath = basePath;
  }
  get basePath() {
    return this._basePath;
  }
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
  set rootPath(rootPath) {
    this._rootPath = rootPath;
  }
  get rootPath() {
    return this._rootPath;
  }
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
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(searchParams) {
    if (typeof searchParams == "string")
      this._defaultSearchParams = searchParams;
    else {
      const queryValues = searchParams;
      this._defaultSearchParams = Object.keys(queryValues).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryValues[key])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(asset) {
    const { alias, name, src, srcs } = asset;
    return convertToList.convertToList(
      alias || name || src || srcs,
      (value) => typeof value == "string" ? value : Array.isArray(value) ? value.map((v) => v?.src ?? v?.srcs ?? v) : value?.src || value?.srcs ? value.src ?? value.srcs : value,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(manifest) {
    this._manifest && console.warn("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = manifest, manifest.bundles.forEach((bundle) => {
      this.addBundle(bundle.name, bundle.assets);
    });
  }
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
  addBundle(bundleId, assets) {
    const assetNames = [];
    Array.isArray(assets) ? assets.forEach((asset) => {
      const srcs = asset.src ?? asset.srcs, aliases = asset.alias ?? asset.name;
      let ids;
      if (typeof aliases == "string") {
        const bundleAssetId = this._createBundleAssetId(bundleId, aliases);
        assetNames.push(bundleAssetId), ids = [aliases, bundleAssetId];
      } else {
        const bundleIds = aliases.map((name) => this._createBundleAssetId(bundleId, name));
        assetNames.push(...bundleIds), ids = [...aliases, ...bundleIds];
      }
      this.add({
        ...asset,
        alias: ids,
        src: srcs
      });
    }) : Object.keys(assets).forEach((key) => {
      const aliases = [key, this._createBundleAssetId(bundleId, key)];
      if (typeof assets[key] == "string")
        this.add({
          alias: aliases,
          src: assets[key]
        });
      else if (Array.isArray(assets[key]))
        this.add({
          alias: aliases,
          src: assets[key]
        });
      else {
        const asset = assets[key], assetSrc = asset.src ?? asset.srcs;
        this.add({
          ...asset,
          alias: aliases,
          src: Array.isArray(assetSrc) ? assetSrc : [assetSrc]
        });
      }
      assetNames.push(...aliases);
    }), this._bundles[bundleId] = assetNames;
  }
  add(aliases, srcs, data, format, loadParser) {
    const assets = [];
    typeof aliases == "string" || Array.isArray(aliases) && typeof aliases[0] == "string" ? (core.utils.deprecation("7.2.0", `Assets.add now uses an object instead of individual parameters.
Please use Assets.add({ alias, src, data, format, loadParser }) instead.`), assets.push({ alias: aliases, src: srcs, data, format, loadParser })) : Array.isArray(aliases) ? assets.push(...aliases) : assets.push(aliases);
    let keyCheck;
    keyCheck = (key) => {
      this.hasKey(key) && console.warn(`[Resolver] already has key: ${key} overwriting`);
    }, convertToList.convertToList(assets).forEach((asset) => {
      const { src, srcs: srcs2 } = asset;
      let { data: data2, format: format2, loadParser: loadParser2 } = asset;
      const srcsToUse = convertToList.convertToList(src || srcs2).map((src2) => typeof src2 == "string" ? createStringVariations.createStringVariations(src2) : Array.isArray(src2) ? src2 : [src2]), aliasesToUse = this.getAlias(asset);
      Array.isArray(aliasesToUse) ? aliasesToUse.forEach(keyCheck) : keyCheck(aliasesToUse);
      const resolvedAssets = [];
      srcsToUse.forEach((srcs3) => {
        srcs3.forEach((src2) => {
          let formattedAsset = {};
          if (typeof src2 != "object") {
            formattedAsset.src = src2;
            for (let i = 0; i < this._parsers.length; i++) {
              const parser = this._parsers[i];
              if (parser.test(src2)) {
                formattedAsset = parser.parse(src2);
                break;
              }
            }
          } else
            data2 = src2.data ?? data2, format2 = src2.format ?? format2, loadParser2 = src2.loadParser ?? loadParser2, formattedAsset = {
              ...formattedAsset,
              ...src2
            };
          if (!aliasesToUse)
            throw new Error(`[Resolver] alias is undefined for this asset: ${formattedAsset.src}`);
          formattedAsset = this.buildResolvedAsset(formattedAsset, {
            aliases: aliasesToUse,
            data: data2,
            format: format2,
            loadParser: loadParser2
          }), resolvedAssets.push(formattedAsset);
        });
      }), aliasesToUse.forEach((alias) => {
        this._assetMap[alias] = resolvedAssets;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
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
  resolveBundle(bundleIds) {
    const singleAsset = isSingleItem.isSingleItem(bundleIds);
    bundleIds = convertToList.convertToList(bundleIds);
    const out = {};
    return bundleIds.forEach((bundleId) => {
      const assetNames = this._bundles[bundleId];
      if (assetNames) {
        const results = this.resolve(assetNames), assets = {};
        for (const key in results) {
          const asset = results[key];
          assets[this._extractAssetIdFromBundle(bundleId, key)] = asset;
        }
        out[bundleId] = assets;
      }
    }), singleAsset ? out[bundleIds[0]] : out;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(key) {
    const result = this.resolve(key);
    if (typeof key != "string") {
      const out = {};
      for (const i in result)
        out[i] = result[i].src;
      return out;
    }
    return result.src;
  }
  resolve(keys) {
    const singleAsset = isSingleItem.isSingleItem(keys);
    keys = convertToList.convertToList(keys);
    const result = {};
    return keys.forEach((key) => {
      if (!this._resolverHash[key])
        if (this._assetMap[key]) {
          let assets = this._assetMap[key];
          const bestAsset = assets[0], preferredOrder = this._getPreferredOrder(assets);
          preferredOrder?.priority.forEach((priorityKey) => {
            preferredOrder.params[priorityKey].forEach((value) => {
              const filteredAssets = assets.filter((asset) => asset[priorityKey] ? asset[priorityKey] === value : !1);
              filteredAssets.length && (assets = filteredAssets);
            });
          }), this._resolverHash[key] = assets[0] ?? bestAsset;
        } else
          this._resolverHash[key] = this.buildResolvedAsset({
            alias: [key],
            src: key
          }, {});
      result[key] = this._resolverHash[key];
    }), singleAsset ? result[keys[0]] : result;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(key) {
    return !!this._assetMap[key];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(key) {
    return !!this._bundles[key];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(assets) {
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[0], preferred = this._preferredOrder.find((preference) => preference.params.format.includes(asset.format));
      if (preferred)
        return preferred;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(url) {
    if (!this._defaultSearchParams)
      return url;
    const paramConnector = /\?/.test(url) ? "&" : "?";
    return `${url}${paramConnector}${this._defaultSearchParams}`;
  }
  buildResolvedAsset(formattedAsset, data) {
    const { aliases, data: assetData, loadParser, format } = data;
    return (this._basePath || this._rootPath) && (formattedAsset.src = core.utils.path.toAbsolute(formattedAsset.src, this._basePath, this._rootPath)), formattedAsset.alias = aliases ?? formattedAsset.alias ?? [formattedAsset.src], formattedAsset.src = this._appendDefaultSearchParams(formattedAsset.src), formattedAsset.data = { ...assetData || {}, ...formattedAsset.data }, formattedAsset.loadParser = loadParser ?? formattedAsset.loadParser, formattedAsset.format = format ?? formattedAsset.format ?? core.utils.path.extname(formattedAsset.src).slice(1), formattedAsset.srcs = formattedAsset.src, formattedAsset.name = formattedAsset.alias, formattedAsset;
  }
}
exports.Resolver = Resolver;
//# sourceMappingURL=Resolver.js.map
