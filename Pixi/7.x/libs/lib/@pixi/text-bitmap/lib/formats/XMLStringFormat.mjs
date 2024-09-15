import { settings } from "@pixi/core";
import { XMLFormat } from "./XMLFormat.mjs";
class XMLStringFormat {
  /**
   * Check if resource refers to text xml font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(data) {
    return typeof data == "string" && data.includes("<font>") ? XMLFormat.test(settings.ADAPTER.parseXML(data)) : !1;
  }
  /**
   * Convert the text XML into BitmapFontData that we can use.
   * @param xmlTxt
   * @returns - Data to use for BitmapFont
   */
  static parse(xmlTxt) {
    return XMLFormat.parse(settings.ADAPTER.parseXML(xmlTxt));
  }
}
export {
  XMLStringFormat
};
//# sourceMappingURL=XMLStringFormat.mjs.map
