"use strict";
var color = require("@pixi/color"), constants = require("@pixi/constants"), deprecation = require("../logging/deprecation.js");
function mapPremultipliedBlendModes() {
  const pm = [], npm = [];
  for (let i = 0; i < 32; i++)
    pm[i] = i, npm[i] = i;
  pm[constants.BLEND_MODES.NORMAL_NPM] = constants.BLEND_MODES.NORMAL, pm[constants.BLEND_MODES.ADD_NPM] = constants.BLEND_MODES.ADD, pm[constants.BLEND_MODES.SCREEN_NPM] = constants.BLEND_MODES.SCREEN, npm[constants.BLEND_MODES.NORMAL] = constants.BLEND_MODES.NORMAL_NPM, npm[constants.BLEND_MODES.ADD] = constants.BLEND_MODES.ADD_NPM, npm[constants.BLEND_MODES.SCREEN] = constants.BLEND_MODES.SCREEN_NPM;
  const array = [];
  return array.push(npm), array.push(pm), array;
}
const premultiplyBlendMode = mapPremultipliedBlendModes();
function correctBlendMode(blendMode, premultiplied) {
  return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
}
function premultiplyRgba(rgb, alpha, out, premultiply = !0) {
  return deprecation.deprecation("7.2.0", "utils.premultiplyRgba has moved to Color.premultiply"), color.Color.shared.setValue(rgb).premultiply(alpha, premultiply).toArray(out ?? new Float32Array(4));
}
function premultiplyTint(tint, alpha) {
  return deprecation.deprecation("7.2.0", "utils.premultiplyTint has moved to Color.toPremultiplied"), color.Color.shared.setValue(tint).toPremultiplied(alpha);
}
function premultiplyTintToRgba(tint, alpha, out, premultiply = !0) {
  return deprecation.deprecation("7.2.0", "utils.premultiplyTintToRgba has moved to Color.premultiply"), color.Color.shared.setValue(tint).premultiply(alpha, premultiply).toArray(out ?? new Float32Array(4));
}
exports.correctBlendMode = correctBlendMode;
exports.premultiplyBlendMode = premultiplyBlendMode;
exports.premultiplyRgba = premultiplyRgba;
exports.premultiplyTint = premultiplyTint;
exports.premultiplyTintToRgba = premultiplyTintToRgba;
//# sourceMappingURL=premultiply.js.map
