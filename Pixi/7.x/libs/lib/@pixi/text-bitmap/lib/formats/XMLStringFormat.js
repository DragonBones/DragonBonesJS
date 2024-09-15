"use strict";
var core = require("@pixi/core"), XMLFormat = require("./XMLFormat.js");
class XMLStringFormat {
  /**
   * Check if resource refers to text xml font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(data) {
    return typeof data == "string" && data.includes("<font>") ? XMLFormat.XMLFormat.test(core.settings.ADAPTER.parseXML(data)) : !1;
  }
  /**
   * Convert the text XML into BitmapFontData that we can use.
   * @param xmlTxt
   * @returns - Data to use for BitmapFont
   */
  static parse(xmlTxt) {
    return XMLFormat.XMLFormat.parse(core.settings.ADAPTER.parseXML(xmlTxt));
  }
}
exports.XMLStringFormat = XMLStringFormat;
//# sourceMappingURL=XMLStringFormat.js.map
