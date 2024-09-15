import { settings } from "@pixi/settings";
import { settings as settings2 } from "@pixi/settings";
import { deprecation } from "@pixi/utils";
import { Ticker } from "./Ticker.mjs";
Object.defineProperties(settings, {
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
      return Ticker.targetFPMS;
    },
    set(value) {
      deprecation("7.1.0", "settings.TARGET_FPMS is deprecated, use Ticker.targetFPMS"), Ticker.targetFPMS = value;
    }
  }
});
export {
  settings2 as settings
};
//# sourceMappingURL=settings.mjs.map
