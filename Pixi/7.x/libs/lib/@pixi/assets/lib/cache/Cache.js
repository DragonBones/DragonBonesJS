"use strict";
var core = require("@pixi/core");
require("../utils/index.js");
var convertToList = require("../utils/convertToList.js");
class CacheClass {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(key) {
    return this._cache.has(key);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(key) {
    const result = this._cache.get(key);
    return result || console.warn(`[Assets] Asset id ${key} was not found in the Cache`), result;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(key, value) {
    const keys = convertToList.convertToList(key);
    let cacheableAssets;
    for (let i = 0; i < this.parsers.length; i++) {
      const parser = this.parsers[i];
      if (parser.test(value)) {
        cacheableAssets = parser.getCacheableAssets(keys, value);
        break;
      }
    }
    cacheableAssets || (cacheableAssets = {}, keys.forEach((key2) => {
      cacheableAssets[key2] = value;
    }));
    const cacheKeys = Object.keys(cacheableAssets), cachedAssets = {
      cacheKeys,
      keys
    };
    if (keys.forEach((key2) => {
      this._cacheMap.set(key2, cachedAssets);
    }), cacheKeys.forEach((key2) => {
      this._cache.has(key2) && this._cache.get(key2) !== value && console.warn("[Cache] already has key:", key2), this._cache.set(key2, cacheableAssets[key2]);
    }), value instanceof core.Texture) {
      const texture = value;
      keys.forEach((key2) => {
        texture.baseTexture !== core.Texture.EMPTY.baseTexture && core.BaseTexture.addToCache(texture.baseTexture, key2), core.Texture.addToCache(texture, key2);
      });
    }
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(key) {
    if (!this._cacheMap.has(key)) {
      console.warn(`[Assets] Asset id ${key} was not found in the Cache`);
      return;
    }
    const cacheMap = this._cacheMap.get(key);
    cacheMap.cacheKeys.forEach((key2) => {
      this._cache.delete(key2);
    }), cacheMap.keys.forEach((key2) => {
      this._cacheMap.delete(key2);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const Cache = new CacheClass();
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map
