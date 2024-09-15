"use strict";
var core = require("@pixi/core"), BasePrepare = require("./BasePrepare.js");
Object.defineProperties(core.settings, {
  /**
   * Default number of uploads per frame using prepare plugin.
   * @static
   * @memberof PIXI.settings
   * @name UPLOADS_PER_FRAME
   * @deprecated since 7.1.0
   * @see PIXI.BasePrepare.uploadsPerFrame
   * @type {number}
   */
  UPLOADS_PER_FRAME: {
    get() {
      return BasePrepare.BasePrepare.uploadsPerFrame;
    },
    set(value) {
      core.utils.deprecation("7.1.0", "settings.UPLOADS_PER_FRAME is deprecated, use prepare.BasePrepare.uploadsPerFrame"), BasePrepare.BasePrepare.uploadsPerFrame = value;
    }
  }
});
Object.defineProperty(exports, "settings", {
  enumerable: !0,
  get: function() {
    return core.settings;
  }
});
//# sourceMappingURL=settings.js.map
