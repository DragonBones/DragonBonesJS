"use strict";
var core = require("@pixi/core"), checkDataUrl = require("../../utils/checkDataUrl.js"), checkExtension = require("../../utils/checkExtension.js"), LoaderParser = require("./LoaderParser.js");
const validTXTExtension = ".txt", validTXTMIME = "text/plain", loadTxt = {
  name: "loadTxt",
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Low
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validTXTMIME) || checkExtension.checkExtension(url, validTXTExtension);
  },
  async load(url) {
    return await (await core.settings.ADAPTER.fetch(url)).text();
  }
};
core.extensions.add(loadTxt);
exports.loadTxt = loadTxt;
//# sourceMappingURL=loadTxt.js.map
