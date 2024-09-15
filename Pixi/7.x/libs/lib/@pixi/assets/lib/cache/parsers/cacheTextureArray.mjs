import { ExtensionType, Texture, extensions } from "@pixi/core";
const cacheTextureArray = {
  extension: ExtensionType.CacheParser,
  test: (asset) => Array.isArray(asset) && asset.every((t) => t instanceof Texture),
  getCacheableAssets: (keys, asset) => {
    const out = {};
    return keys.forEach((key) => {
      asset.forEach((item, i) => {
        out[key + (i === 0 ? "" : i + 1)] = item;
      });
    }), out;
  }
};
extensions.add(cacheTextureArray);
export {
  cacheTextureArray
};
//# sourceMappingURL=cacheTextureArray.mjs.map
