"use strict";
var LoaderParser = require("./LoaderParser.js"), loadJson = require("./loadJson.js"), loadTxt = require("./loadTxt.js"), loadWebFont = require("./loadWebFont.js");
require("./textures/index.js");
exports.LoaderParserPriority = LoaderParser.LoaderParserPriority;
exports.loadJson = loadJson.loadJson;
exports.loadTxt = loadTxt.loadTxt;
exports.getFontFamilyName = loadWebFont.getFontFamilyName;
exports.loadWebFont = loadWebFont.loadWebFont;
//# sourceMappingURL=index.js.map
