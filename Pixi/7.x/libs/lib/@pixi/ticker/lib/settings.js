"use strict";
var settings = require("@pixi/settings"), utils = require("@pixi/utils"), Ticker = require("./Ticker.js");
Object.defineProperties(settings.settings, {
  /**
   * Target frames per millisecond.
   * @static
   * @name TARGET_FPMS
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.Ticker.targetFPMS
   */
  TARGET_FPMS: {
    get() {
      return Ticker.Ticker.targetFPMS;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.TARGET_FPMS is deprecated, use Ticker.targetFPMS"), Ticker.Ticker.targetFPMS = value;
    }
  }
});
Object.defineProperty(exports, "settings", {
  enumerable: !0,
  get: function() {
    return settings.settings;
  }
});
//# sourceMappingURL=settings.js.map
