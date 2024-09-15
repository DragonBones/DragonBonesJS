"use strict";
var core = require("@pixi/core"), checkDataUrl = require("../../utils/checkDataUrl.js"), checkExtension = require("../../utils/checkExtension.js"), LoaderParser = require("./LoaderParser.js");
const validJSONExtension = ".json", validJSONMIME = "application/json", loadJson = {
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Low
  },
  name: "loadJson",
  test(url) {
    return checkDataUrl.checkDataUrl(url, validJSONMIME) || checkExtension.checkExtension(url, validJSONExtension);
  },
  async load(url) {
    return await (await core.settings.ADAPTER.fetch(url)).json();
  }
};
core.extensions.add(loadJson);
exports.loadJson = loadJson;
//# sourceMappingURL=loadJson.js.map
