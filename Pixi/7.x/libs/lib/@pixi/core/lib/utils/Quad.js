"use strict";
var Geometry = require("../geometry/Geometry.js");
class Quad extends Geometry.Geometry {
  constructor() {
    super(), this.addAttribute("aVertexPosition", new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ])).addIndex([0, 1, 3, 2]);
  }
}
exports.Quad = Quad;
//# sourceMappingURL=Quad.js.map
