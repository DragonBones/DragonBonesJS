"use strict";
var core = require("@pixi/core"), fxaa$1 = require("./fxaa.frag.js"), fxaa = require("./fxaa.vert.js");
class FXAAFilter extends core.Filter {
  constructor() {
    super(fxaa.default, fxaa$1.default);
  }
}
exports.FXAAFilter = FXAAFilter;
//# sourceMappingURL=FXAAFilter.js.map
