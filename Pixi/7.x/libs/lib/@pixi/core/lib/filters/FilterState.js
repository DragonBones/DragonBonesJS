"use strict";
var constants = require("@pixi/constants"), math = require("@pixi/math");
class FilterState {
  constructor() {
    this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.multisample = constants.MSAA_QUALITY.NONE, this.sourceFrame = new math.Rectangle(), this.destinationFrame = new math.Rectangle(), this.bindingSourceFrame = new math.Rectangle(), this.bindingDestinationFrame = new math.Rectangle(), this.filters = [], this.transform = null;
  }
  /** Clears the state */
  clear() {
    this.target = null, this.filters = null, this.renderTexture = null;
  }
}
exports.FilterState = FilterState;
//# sourceMappingURL=FilterState.js.map
