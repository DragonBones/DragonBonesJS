import "../settings.mjs";
import { settings } from "@pixi/settings";
function getResolutionOfUrl(url, defaultValue = 1) {
  const resolution = settings.RETINA_PREFIX?.exec(url);
  return resolution ? parseFloat(resolution[1]) : defaultValue;
}
export {
  getResolutionOfUrl
};
//# sourceMappingURL=getResolutionOfUrl.mjs.map
