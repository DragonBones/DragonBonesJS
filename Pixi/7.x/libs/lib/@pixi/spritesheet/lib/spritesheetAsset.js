"use strict";
var assets = require("@pixi/assets"), core = require("@pixi/core"), Spritesheet = require("./Spritesheet.js");
const validImages = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "s3tc",
  "s3tc_sRGB",
  "etc",
  "etc1",
  "pvrtc",
  "atc",
  "astc",
  "bptc"
];
function getCacheableAssets(keys, asset, ignoreMultiPack) {
  const out = {};
  if (keys.forEach((key) => {
    out[key] = asset;
  }), Object.keys(asset.textures).forEach((key) => {
    out[`${asset.cachePrefix}${key}`] = asset.textures[key];
  }), !ignoreMultiPack) {
    const basePath = core.utils.path.dirname(keys[0]);
    asset.linkedSheets.forEach((item, i) => {
      Object.assign(out, getCacheableAssets(
        [`${basePath}/${asset.data.meta.related_multi_packs[i]}`],
        item,
        !0
      ));
    });
  }
  return out;
}
const spritesheetAsset = {
  extension: core.ExtensionType.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (asset) => asset instanceof Spritesheet.Spritesheet,
    getCacheableAssets: (keys, asset) => getCacheableAssets(keys, asset, !1)
  },
  /** Resolve the the resolution of the asset. */
  resolver: {
    test: (value) => {
      const split = value.split("?")[0].split("."), extension = split.pop(), format = split.pop();
      return extension === "json" && validImages.includes(format);
    },
    parse: (value) => {
      const split = value.split(".");
      return {
        resolution: parseFloat(core.settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
        format: split[split.length - 2],
        src: value
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into PIXI.Spritesheet
   * All textures in the sprite sheet are then added to the cache
   * @ignore
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: core.ExtensionType.LoadParser,
      priority: assets.LoaderParserPriority.Normal
    },
    async testParse(asset, options) {
      return core.utils.path.extname(options.src).toLowerCase() === ".json" && !!asset.frames;
    },
    async parse(asset, options, loader) {
      const {
        texture: imageTexture,
        // if user need to use preloaded texture
        imageFilename,
        // if user need to use custom filename (not from jsonFile.meta.image)
        cachePrefix
        // if user need to use custom cache prefix
      } = options?.data ?? {};
      let basePath = core.utils.path.dirname(options.src);
      basePath && basePath.lastIndexOf("/") !== basePath.length - 1 && (basePath += "/");
      let texture;
      if (imageTexture && imageTexture.baseTexture)
        texture = imageTexture;
      else {
        const imagePath = assets.copySearchParams(basePath + (imageFilename ?? asset.meta.image), options.src);
        texture = (await loader.load([imagePath]))[imagePath];
      }
      const spritesheet = new Spritesheet.Spritesheet({
        texture: texture.baseTexture,
        data: asset,
        resolutionFilename: options.src,
        cachePrefix
      });
      await spritesheet.parse();
      const multiPacks = asset?.meta?.related_multi_packs;
      if (Array.isArray(multiPacks)) {
        const promises = [];
        for (const item of multiPacks) {
          if (typeof item != "string")
            continue;
          let itemUrl = basePath + item;
          options.data?.ignoreMultiPack || (itemUrl = assets.copySearchParams(itemUrl, options.src), promises.push(loader.load({
            src: itemUrl,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const res = await Promise.all(promises);
        spritesheet.linkedSheets = res, res.forEach((item) => {
          item.linkedSheets = [spritesheet].concat(spritesheet.linkedSheets.filter((sp) => sp !== item));
        });
      }
      return spritesheet;
    },
    unload(spritesheet) {
      spritesheet.destroy(!0);
    }
  }
};
core.extensions.add(spritesheetAsset);
exports.spritesheetAsset = spritesheetAsset;
//# sourceMappingURL=spritesheetAsset.js.map
