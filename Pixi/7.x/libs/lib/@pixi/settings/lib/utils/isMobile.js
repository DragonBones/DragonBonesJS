"use strict";
var isMobileJs = require("ismobilejs");
const isMobileCall = isMobileJs.default ?? isMobileJs, isMobile = isMobileCall(globalThis.navigator);
exports.isMobile = isMobile;
//# sourceMappingURL=isMobile.js.map
