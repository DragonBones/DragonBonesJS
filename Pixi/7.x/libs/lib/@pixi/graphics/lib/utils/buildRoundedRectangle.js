"use strict";
var buildCircle = require("./buildCircle.js");
const buildRoundedRectangle = {
  build(graphicsData) {
    buildCircle.buildCircle.build(graphicsData);
  },
  triangulate(graphicsData, graphicsGeometry) {
    buildCircle.buildCircle.triangulate(graphicsData, graphicsGeometry);
  }
};
exports.buildRoundedRectangle = buildRoundedRectangle;
//# sourceMappingURL=buildRoundedRectangle.js.map
