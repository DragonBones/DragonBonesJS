"use strict";
var TextFormat = require("./TextFormat.js"), XMLFormat = require("./XMLFormat.js"), XMLStringFormat = require("./XMLStringFormat.js");
const formats = [
  TextFormat.TextFormat,
  XMLFormat.XMLFormat,
  XMLStringFormat.XMLStringFormat
];
function autoDetectFormat(data) {
  for (let i = 0; i < formats.length; i++)
    if (formats[i].test(data))
      return formats[i];
  return null;
}
exports.TextFormat = TextFormat.TextFormat;
exports.XMLFormat = XMLFormat.XMLFormat;
exports.XMLStringFormat = XMLStringFormat.XMLStringFormat;
exports.autoDetectFormat = autoDetectFormat;
//# sourceMappingURL=index.js.map
