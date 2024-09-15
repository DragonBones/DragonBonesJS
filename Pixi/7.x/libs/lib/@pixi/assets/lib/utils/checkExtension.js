"use strict";
var core = require("@pixi/core");
function checkExtension(url, extension) {
  const tempURL = url.split("?")[0], ext = core.utils.path.extname(tempURL).toLowerCase();
  return Array.isArray(extension) ? extension.includes(ext) : ext === extension;
}
exports.checkExtension = checkExtension;
//# sourceMappingURL=checkExtension.js.map
