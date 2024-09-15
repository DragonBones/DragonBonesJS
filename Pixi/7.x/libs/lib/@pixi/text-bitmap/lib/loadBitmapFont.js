"use strict";
var assets = require("@pixi/assets"), core = require("@pixi/core"), BitmapFont = require("./BitmapFont.js");
require("./formats/index.js");
var TextFormat = require("./formats/TextFormat.js"), XMLStringFormat = require("./formats/XMLStringFormat.js");
const validExtensions = [".xml", ".fnt"], loadBitmapFont = {
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: assets.LoaderParserPriority.Normal
  },
  name: "loadBitmapFont",
  test(url) {
    return validExtensions.includes(core.utils.path.extname(url).toLowerCase());
  },
  async testParse(data) {
    return TextFormat.TextFormat.test(data) || XMLStringFormat.XMLStringFormat.test(data);
  },
  async parse(asset, data, loader) {
    const fontData = TextFormat.TextFormat.test(asset) ? TextFormat.TextFormat.parse(asset) : XMLStringFormat.XMLStringFormat.parse(asset), { src } = data, { page: pages } = fontData, textureUrls = [];
    for (let i = 0; i < pages.length; ++i) {
      const pageFile = pages[i].file;
      let imagePath = core.utils.path.join(core.utils.path.dirname(src), pageFile);
      imagePath = assets.copySearchParams(imagePath, src), textureUrls.push(imagePath);
    }
    const loadedTextures = await loader.load(textureUrls), textures = textureUrls.map((url) => loadedTextures[url]);
    return BitmapFont.BitmapFont.install(fontData, textures, !0);
  },
  async load(url, _options) {
    return (await core.settings.ADAPTER.fetch(url)).text();
  },
  unload(bitmapFont) {
    bitmapFont.destroy();
  }
};
core.extensions.add(loadBitmapFont);
exports.loadBitmapFont = loadBitmapFont;
//# sourceMappingURL=loadBitmapFont.js.map
