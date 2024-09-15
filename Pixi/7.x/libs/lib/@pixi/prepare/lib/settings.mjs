import { settings, utils } from "@pixi/core";
import { settings as settings2 } from "@pixi/core";
import { BasePrepare } from "./BasePrepare.mjs";
Object.defineProperties(settings, {
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
      return BasePrepare.uploadsPerFrame;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.UPLOADS_PER_FRAME is deprecated, use prepare.BasePrepare.uploadsPerFrame"), BasePrepare.uploadsPerFrame = value;
    }
  }
});
export {
  settings2 as settings
};
//# sourceMappingURL=settings.mjs.map
