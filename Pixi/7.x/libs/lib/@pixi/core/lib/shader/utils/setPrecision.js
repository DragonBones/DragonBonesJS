"use strict";
var constants = require("@pixi/constants");
function setPrecision(src, requestedPrecision, maxSupportedPrecision) {
  if (src.substring(0, 9) !== "precision") {
    let precision = requestedPrecision;
    return requestedPrecision === constants.PRECISION.HIGH && maxSupportedPrecision !== constants.PRECISION.HIGH && (precision = constants.PRECISION.MEDIUM), `precision ${precision} float;
${src}`;
  } else if (maxSupportedPrecision !== constants.PRECISION.HIGH && src.substring(0, 15) === "precision highp")
    return src.replace("precision highp", "precision mediump");
  return src;
}
exports.setPrecision = setPrecision;
//# sourceMappingURL=setPrecision.js.map
