"use strict";
var settings = require("@pixi/settings");
function canUploadSameBuffer() {
  return !settings.isMobile.apple.device;
}
exports.canUploadSameBuffer = canUploadSameBuffer;
//# sourceMappingURL=canUploadSameBuffer.js.map
