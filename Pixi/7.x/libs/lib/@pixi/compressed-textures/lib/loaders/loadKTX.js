"use strict";
var assets = require("@pixi/assets"), core = require("@pixi/core");
require("../parsers/index.js");
var parseKTX = require("../parsers/parseKTX.js");
const loadKTX = {
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: assets.LoaderParserPriority.High
  },
  name: "loadKTX",
  test(url) {
    return assets.checkExtension(url, ".ktx");
  },
  async load(url, asset, loader) {
    const arrayBuffer = await (await core.settings.ADAPTER.fetch(url)).arrayBuffer(), { compressed, uncompressed, kvData } = parseKTX.parseKTX(url, arrayBuffer), resources = compressed ?? uncompressed, options = {
      mipmap: core.MIPMAP_MODES.OFF,
      alphaMode: core.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
      resolution: core.utils.getResolutionOfUrl(url),
      ...asset.data
    }, textures = resources.map((resource) => {
      resources === uncompressed && Object.assign(options, {
        type: resource.type,
        format: resource.format
      });
      const res = resource.resource ?? resource, base = new core.BaseTexture(res, options);
      return base.ktxKeyValueData = kvData, assets.createTexture(base, loader, url);
    });
    return textures.length === 1 ? textures[0] : textures;
  },
  unload(texture) {
    Array.isArray(texture) ? texture.forEach((t) => t.destroy(!0)) : texture.destroy(!0);
  }
};
core.extensions.add(loadKTX);
exports.loadKTX = loadKTX;
//# sourceMappingURL=loadKTX.js.map
