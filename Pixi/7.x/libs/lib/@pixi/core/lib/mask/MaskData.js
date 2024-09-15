"use strict";
var constants = require("@pixi/constants"), Filter = require("../filters/Filter.js");
class MaskData {
  /**
   * Create MaskData
   * @param {PIXI.DisplayObject} [maskObject=null] - object that describes the mask
   */
  constructor(maskObject = null) {
    this.type = constants.MASK_TYPES.NONE, this.autoDetect = !0, this.maskObject = maskObject || null, this.pooled = !1, this.isMaskData = !0, this.resolution = null, this.multisample = Filter.Filter.defaultMultisample, this.enabled = !0, this.colorMask = 15, this._filters = null, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._scissorRectLocal = null, this._colorMask = 15, this._target = null;
  }
  /**
   * The sprite mask filter.
   * If set to `null`, the default sprite mask filter is used.
   * @default null
   */
  get filter() {
    return this._filters ? this._filters[0] : null;
  }
  set filter(value) {
    value ? this._filters ? this._filters[0] = value : this._filters = [value] : this._filters = null;
  }
  /** Resets the mask data after popMask(). */
  reset() {
    this.pooled && (this.maskObject = null, this.type = constants.MASK_TYPES.NONE, this.autoDetect = !0), this._target = null, this._scissorRectLocal = null;
  }
  /**
   * Copies counters from maskData above, called from pushMask().
   * @param maskAbove
   */
  copyCountersOrReset(maskAbove) {
    maskAbove ? (this._stencilCounter = maskAbove._stencilCounter, this._scissorCounter = maskAbove._scissorCounter, this._scissorRect = maskAbove._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
  }
}
exports.MaskData = MaskData;
//# sourceMappingURL=MaskData.js.map
