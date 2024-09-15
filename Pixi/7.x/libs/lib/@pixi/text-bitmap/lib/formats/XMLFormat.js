"use strict";
var BitmapFontData = require("../BitmapFontData.js");
class XMLFormat {
  /**
   * Check if resource refers to xml font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(data) {
    const xml = data;
    return typeof data != "string" && "getElementsByTagName" in data && xml.getElementsByTagName("page").length && xml.getElementsByTagName("info")[0].getAttribute("face") !== null;
  }
  /**
   * Convert the XML into BitmapFontData that we can use.
   * @param xml
   * @returns - Data to use for BitmapFont
   */
  static parse(xml) {
    const data = new BitmapFontData.BitmapFontData(), info = xml.getElementsByTagName("info"), common = xml.getElementsByTagName("common"), page = xml.getElementsByTagName("page"), char = xml.getElementsByTagName("char"), kerning = xml.getElementsByTagName("kerning"), distanceField = xml.getElementsByTagName("distanceField");
    for (let i = 0; i < info.length; i++)
      data.info.push({
        face: info[i].getAttribute("face"),
        size: parseInt(info[i].getAttribute("size"), 10)
      });
    for (let i = 0; i < common.length; i++)
      data.common.push({
        lineHeight: parseInt(common[i].getAttribute("lineHeight"), 10)
      });
    for (let i = 0; i < page.length; i++)
      data.page.push({
        id: parseInt(page[i].getAttribute("id"), 10) || 0,
        file: page[i].getAttribute("file")
      });
    for (let i = 0; i < char.length; i++) {
      const letter = char[i];
      data.char.push({
        id: parseInt(letter.getAttribute("id"), 10),
        page: parseInt(letter.getAttribute("page"), 10) || 0,
        x: parseInt(letter.getAttribute("x"), 10),
        y: parseInt(letter.getAttribute("y"), 10),
        width: parseInt(letter.getAttribute("width"), 10),
        height: parseInt(letter.getAttribute("height"), 10),
        xoffset: parseInt(letter.getAttribute("xoffset"), 10),
        yoffset: parseInt(letter.getAttribute("yoffset"), 10),
        xadvance: parseInt(letter.getAttribute("xadvance"), 10)
      });
    }
    for (let i = 0; i < kerning.length; i++)
      data.kerning.push({
        first: parseInt(kerning[i].getAttribute("first"), 10),
        second: parseInt(kerning[i].getAttribute("second"), 10),
        amount: parseInt(kerning[i].getAttribute("amount"), 10)
      });
    for (let i = 0; i < distanceField.length; i++)
      data.distanceField.push({
        fieldType: distanceField[i].getAttribute("fieldType"),
        distanceRange: parseInt(distanceField[i].getAttribute("distanceRange"), 10)
      });
    return data;
  }
}
exports.XMLFormat = XMLFormat;
//# sourceMappingURL=XMLFormat.js.map
