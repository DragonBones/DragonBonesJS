"use strict";
var settings = require("@pixi/settings");
function maxRecommendedTextures(max) {
  let allowMax = !0;
  const navigator = settings.settings.ADAPTER.getNavigator();
  if (settings.isMobile.tablet || settings.isMobile.phone) {
    if (settings.isMobile.apple.device) {
      const match = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      match && parseInt(match[1], 10) < 11 && (allowMax = !1);
    }
    if (settings.isMobile.android.device) {
      const match = navigator.userAgent.match(/Android\s([0-9.]*)/);
      match && parseInt(match[1], 10) < 7 && (allowMax = !1);
    }
  }
  return allowMax ? max : 4;
}
exports.maxRecommendedTextures = maxRecommendedTextures;
//# sourceMappingURL=maxRecommendedTextures.js.map
