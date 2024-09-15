"use strict";
var assets = require("@pixi/assets"), core = require("@pixi/core");
require("../parsers/index.js");
var parseDDS = require("../parsers/parseDDS.js");
const loadDDS = {
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: assets.LoaderParserPriority.High
  },
  name: "loadDDS",
  test(url) {
    return assets.checkExtension(url, ".dds");
  },
  async load(url, asset, loader) {
    const arrayBuffer = await (await core.settings.ADAPTER.fetch(url)).arrayBuffer(), textures = parseDDS.parseDDS(arrayBuffer).map((resource) => {
      const base = new core.BaseTexture(resource, {
        mipmap: core.MIPMAP_MODES.OFF,
        alphaMode: core.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
        resolution: core.utils.getResolutionOfUrl(url),
        ...asset.data
      });
      return assets.createTexture(base, loader, url);
    });
    return textures.length === 1 ? textures[0] : textures;
  },
  unload(texture) {
    Array.isArray(texture) ? texture.forEach((t) => t.destroy(!0)) : texture.destroy(!0);
  }
};
core.extensions.add(loadDDS);
exports.loadDDS = loadDDS;
//# sourceMappingURL=loadDDS.js.map
