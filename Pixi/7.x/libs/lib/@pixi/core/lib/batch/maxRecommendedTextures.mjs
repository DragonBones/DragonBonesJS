import { settings, isMobile } from "@pixi/settings";
function maxRecommendedTextures(max) {
  let allowMax = !0;
  const navigator = settings.ADAPTER.getNavigator();
  if (isMobile.tablet || isMobile.phone) {
    if (isMobile.apple.device) {
      const match = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      match && parseInt(match[1], 10) < 11 && (allowMax = !1);
    }
    if (isMobile.android.device) {
      const match = navigator.userAgent.match(/Android\s([0-9.]*)/);
      match && parseInt(match[1], 10) < 7 && (allowMax = !1);
    }
  }
  return allowMax ? max : 4;
}
export {
  maxRecommendedTextures
};
//# sourceMappingURL=maxRecommendedTextures.mjs.map
