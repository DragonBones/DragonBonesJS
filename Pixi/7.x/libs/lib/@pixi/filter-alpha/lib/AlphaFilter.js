"use strict";
var core = require("@pixi/core"), alpha = require("./alpha.frag.js");
class AlphaFilter extends core.Filter {
  /**
   * @param alpha - Amount of alpha from 0 to 1, where 0 is transparent
   */
  constructor(alpha$1 = 1) {
    super(core.defaultVertex, alpha.default, { uAlpha: 1 }), this.alpha = alpha$1;
  }
  /**
   * Coefficient for alpha multiplication
   * @default 1
   */
  get alpha() {
    return this.uniforms.uAlpha;
  }
  set alpha(value) {
    this.uniforms.uAlpha = value;
  }
}
exports.AlphaFilter = AlphaFilter;
//# sourceMappingURL=AlphaFilter.js.map
