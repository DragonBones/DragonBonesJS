"use strict";
var core = require("@pixi/core");
const cacheTextureArray = {
  extension: core.ExtensionType.CacheParser,
  test: (asset) => Array.isArray(asset) && asset.every((t) => t instanceof core.Texture),
  getCacheableAssets: (keys, asset) => {
    const out = {};
    return keys.forEach((key) => {
      asset.forEach((item, i) => {
        out[key + (i === 0 ? "" : i + 1)] = item;
      });
    }), out;
  }
};
core.extensions.add(cacheTextureArray);
exports.cacheTextureArray = cacheTextureArray;
//# sourceMappingURL=cacheTextureArray.js.map
