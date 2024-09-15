import { Color } from "@pixi/color";
import { BLEND_MODES } from "@pixi/constants";
import { deprecation } from "../logging/deprecation.mjs";
function mapPremultipliedBlendModes() {
  const pm = [], npm = [];
  for (let i = 0; i < 32; i++)
    pm[i] = i, npm[i] = i;
  pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL, pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD, pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN, npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM, npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM, npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
  const array = [];
  return array.push(npm), array.push(pm), array;
}
const premultiplyBlendMode = mapPremultipliedBlendModes();
function correctBlendMode(blendMode, premultiplied) {
  return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
}
function premultiplyRgba(rgb, alpha, out, premultiply = !0) {
  return deprecation("7.2.0", "utils.premultiplyRgba has moved to Color.premultiply"), Color.shared.setValue(rgb).premultiply(alpha, premultiply).toArray(out ?? new Float32Array(4));
}
function premultiplyTint(tint, alpha) {
  return deprecation("7.2.0", "utils.premultiplyTint has moved to Color.toPremultiplied"), Color.shared.setValue(tint).toPremultiplied(alpha);
}
function premultiplyTintToRgba(tint, alpha, out, premultiply = !0) {
  return deprecation("7.2.0", "utils.premultiplyTintToRgba has moved to Color.premultiply"), Color.shared.setValue(tint).premultiply(alpha, premultiply).toArray(out ?? new Float32Array(4));
}
export {
  correctBlendMode,
  premultiplyBlendMode,
  premultiplyRgba,
  premultiplyTint,
  premultiplyTintToRgba
};
//# sourceMappingURL=premultiply.mjs.map
