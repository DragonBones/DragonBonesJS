"use strict";
require("../settings.js");
var settings = require("@pixi/settings");
function getResolutionOfUrl(url, defaultValue = 1) {
  const resolution = settings.settings.RETINA_PREFIX?.exec(url);
  return resolution ? parseFloat(resolution[1]) : defaultValue;
}
exports.getResolutionOfUrl = getResolutionOfUrl;
//# sourceMappingURL=getResolutionOfUrl.js.map
