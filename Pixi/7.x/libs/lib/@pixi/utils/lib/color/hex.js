"use strict";
var color = require("@pixi/color"), deprecation = require("../logging/deprecation.js");
function hex2rgb(hex, out = []) {
  return deprecation.deprecation("7.2.0", "utils.hex2rgb is deprecated, use Color#toRgbArray instead"), color.Color.shared.setValue(hex).toRgbArray(out);
}
function hex2string(hex) {
  return deprecation.deprecation("7.2.0", "utils.hex2string is deprecated, use Color#toHex instead"), color.Color.shared.setValue(hex).toHex();
}
function string2hex(string) {
  return deprecation.deprecation("7.2.0", "utils.string2hex is deprecated, use Color#toNumber instead"), color.Color.shared.setValue(string).toNumber();
}
function rgb2hex(rgb) {
  return deprecation.deprecation("7.2.0", "utils.rgb2hex is deprecated, use Color#toNumber instead"), color.Color.shared.setValue(rgb).toNumber();
}
exports.hex2rgb = hex2rgb;
exports.hex2string = hex2string;
exports.rgb2hex = rgb2hex;
exports.string2hex = string2hex;
//# sourceMappingURL=hex.js.map
