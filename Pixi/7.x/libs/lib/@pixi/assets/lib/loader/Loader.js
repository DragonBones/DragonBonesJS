"use strict";
var core = require("@pixi/core");
require("../utils/index.js");
var isSingleItem = require("../utils/isSingleItem.js"), convertToList = require("../utils/convertToList.js");
class Loader {
  constructor() {
    this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (target, key, value) => (this._parsersValidated = !1, target[key] = value, !0)
    }), this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = !1, this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(url, data) {
    const result = {
      promise: null,
      parser: null
    };
    return result.promise = (async () => {
      let asset = null, parser = null;
      if (data.loadParser && (parser = this._parserHash[data.loadParser], parser || console.warn(`[Assets] specified load parser "${data.loadParser}" not found while loading ${url}`)), !parser) {
        for (let i = 0; i < this.parsers.length; i++) {
          const parserX = this.parsers[i];
          if (parserX.load && parserX.test?.(url, data, this)) {
            parser = parserX;
            break;
          }
        }
        if (!parser)
          return console.warn(`[Assets] ${url} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      asset = await parser.load(url, data, this), result.parser = parser;
      for (let i = 0; i < this.parsers.length; i++) {
        const parser2 = this.parsers[i];
        parser2.parse && parser2.parse && await parser2.testParse?.(asset, data, this) && (asset = await parser2.parse(asset, data, this) || asset, result.parser = parser2);
      }
      return asset;
    })(), result;
  }
  async load(assetsToLoadIn, onProgress) {
    this._parsersValidated || this._validateParsers();
    let count = 0;
    const assets = {}, singleAsset = isSingleItem.isSingleItem(assetsToLoadIn), assetsToLoad = convertToList.convertToList(assetsToLoadIn, (item) => ({
      alias: [item],
      src: item
    })), total = assetsToLoad.length, promises = assetsToLoad.map(async (asset) => {
      const url = core.utils.path.toAbsolute(asset.src);
      if (!assets[asset.src])
        try {
          this.promiseCache[url] || (this.promiseCache[url] = this._getLoadPromiseAndParser(url, asset)), assets[asset.src] = await this.promiseCache[url].promise, onProgress && onProgress(++count / total);
        } catch (e) {
          throw delete this.promiseCache[url], delete assets[asset.src], new Error(`[Loader.load] Failed to load ${url}.
${e}`);
        }
    });
    return await Promise.all(promises), singleAsset ? assets[assetsToLoad[0].src] : assets;
  }
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
  async unload(assetsToUnloadIn) {
    const promises = convertToList.convertToList(assetsToUnloadIn, (item) => ({
      alias: [item],
      src: item
    })).map(async (asset) => {
      const url = core.utils.path.toAbsolute(asset.src), loadPromise = this.promiseCache[url];
      if (loadPromise) {
        const loadedAsset = await loadPromise.promise;
        delete this.promiseCache[url], loadPromise.parser?.unload?.(loadedAsset, asset, this);
      }
    });
    await Promise.all(promises);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((parser) => parser.name).reduce((hash, parser) => (hash[parser.name] && console.warn(`[Assets] loadParser name conflict "${parser.name}"`), { ...hash, [parser.name]: parser }), {});
  }
}
exports.Loader = Loader;
//# sourceMappingURL=Loader.js.map
