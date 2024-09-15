"use strict";
var BitmapFont = require("./BitmapFont.js"), BitmapFontData = require("./BitmapFontData.js"), BitmapText = require("./BitmapText.js");
require("./BitmapTextStyle.js");
var index = require("./formats/index.js"), loadBitmapFont = require("./loadBitmapFont.js"), TextFormat = require("./formats/TextFormat.js"), XMLFormat = require("./formats/XMLFormat.js"), XMLStringFormat = require("./formats/XMLStringFormat.js");
exports.BitmapFont = BitmapFont.BitmapFont;
exports.BitmapFontData = BitmapFontData.BitmapFontData;
exports.BitmapText = BitmapText.BitmapText;
exports.autoDetectFormat = index.autoDetectFormat;
exports.loadBitmapFont = loadBitmapFont.loadBitmapFont;
exports.TextFormat = TextFormat.TextFormat;
exports.XMLFormat = XMLFormat.XMLFormat;
exports.XMLStringFormat = XMLStringFormat.XMLStringFormat;
//# sourceMappingURL=index.js.map
