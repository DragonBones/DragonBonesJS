import { BitmapFontData } from "../BitmapFontData.mjs";
class TextFormat {
  /**
   * Check if resource refers to txt font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(data) {
    return typeof data == "string" && data.startsWith("info face=");
  }
  /**
   * Convert text font data to a javascript object.
   * @param txt - Raw string data to be converted
   * @returns - Parsed font data
   */
  static parse(txt) {
    const items = txt.match(/^[a-z]+\s+.+$/gm), rawData = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const i in items) {
      const name = items[i].match(/^[a-z]+/gm)[0], attributeList = items[i].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), itemData = {};
      for (const i2 in attributeList) {
        const split = attributeList[i2].split("="), key = split[0], strValue = split[1].replace(/"/gm, ""), floatValue = parseFloat(strValue), value = isNaN(floatValue) ? strValue : floatValue;
        itemData[key] = value;
      }
      rawData[name].push(itemData);
    }
    const font = new BitmapFontData();
    return rawData.info.forEach((info) => font.info.push({
      face: info.face,
      size: parseInt(info.size, 10)
    })), rawData.common.forEach((common) => font.common.push({
      lineHeight: parseInt(common.lineHeight, 10)
    })), rawData.page.forEach((page) => font.page.push({
      id: parseInt(page.id, 10),
      file: page.file
    })), rawData.char.forEach((char) => font.char.push({
      id: parseInt(char.id, 10),
      page: parseInt(char.page, 10),
      x: parseInt(char.x, 10),
      y: parseInt(char.y, 10),
      width: parseInt(char.width, 10),
      height: parseInt(char.height, 10),
      xoffset: parseInt(char.xoffset, 10),
      yoffset: parseInt(char.yoffset, 10),
      xadvance: parseInt(char.xadvance, 10)
    })), rawData.kerning.forEach((kerning) => font.kerning.push({
      first: parseInt(kerning.first, 10),
      second: parseInt(kerning.second, 10),
      amount: parseInt(kerning.amount, 10)
    })), rawData.distanceField.forEach((df) => font.distanceField.push({
      distanceRange: parseInt(df.distanceRange, 10),
      fieldType: df.fieldType
    })), font;
  }
}
export {
  TextFormat
};
//# sourceMappingURL=TextFormat.mjs.map
