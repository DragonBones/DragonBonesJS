import { Color } from "@pixi/color";
import { deprecation } from "../logging/deprecation.mjs";
function hex2rgb(hex, out = []) {
  return deprecation("7.2.0", "utils.hex2rgb is deprecated, use Color#toRgbArray instead"), Color.shared.setValue(hex).toRgbArray(out);
}
function hex2string(hex) {
  return deprecation("7.2.0", "utils.hex2string is deprecated, use Color#toHex instead"), Color.shared.setValue(hex).toHex();
}
function string2hex(string) {
  return deprecation("7.2.0", "utils.string2hex is deprecated, use Color#toNumber instead"), Color.shared.setValue(string).toNumber();
}
function rgb2hex(rgb) {
  return deprecation("7.2.0", "utils.rgb2hex is deprecated, use Color#toNumber instead"), Color.shared.setValue(rgb).toNumber();
}
export {
  hex2rgb,
  hex2string,
  rgb2hex,
  string2hex
};
//# sourceMappingURL=hex.mjs.map
