"use strict";
var core = require("@pixi/core"), checkDataUrl = require("../../../utils/checkDataUrl.js"), checkExtension = require("../../../utils/checkExtension.js"), LoaderParser = require("../LoaderParser.js"), loadTextures = require("./loadTextures.js"), createTexture = require("./utils/createTexture.js");
const validSVGExtension = ".svg", validSVGMIME = "image/svg+xml", loadSVG = {
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High
  },
  name: "loadSVG",
  test(url) {
    return checkDataUrl.checkDataUrl(url, validSVGMIME) || checkExtension.checkExtension(url, validSVGExtension);
  },
  async testParse(data) {
    return core.SVGResource.test(data);
  },
  async parse(asset, data, loader) {
    const src = new core.SVGResource(asset, data?.data?.resourceOptions);
    await src.load();
    const base = new core.BaseTexture(src, {
      resolution: core.utils.getResolutionOfUrl(asset),
      ...data?.data
    });
    return base.resource.src = data.src, createTexture.createTexture(base, loader, data.src);
  },
  async load(url, _options) {
    return (await core.settings.ADAPTER.fetch(url)).text();
  },
  unload: loadTextures.loadTextures.unload
};
core.extensions.add(loadSVG);
exports.loadSVG = loadSVG;
//# sourceMappingURL=loadSVG.js.map
