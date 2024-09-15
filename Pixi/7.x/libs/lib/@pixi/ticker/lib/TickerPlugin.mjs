import { ExtensionType, extensions } from "@pixi/extensions";
import { UPDATE_PRIORITY } from "./const.mjs";
import { Ticker } from "./Ticker.mjs";
class TickerPlugin {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(options) {
    options = Object.assign({
      autoStart: !0,
      sharedTicker: !1
    }, options), Object.defineProperty(
      this,
      "ticker",
      {
        set(ticker) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = ticker, ticker && ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = options.sharedTicker ? Ticker.shared : new Ticker(), options.autoStart && this.start();
  }
  /**
   * Clean up the ticker, scoped to application.
   * @static
   * @private
   */
  static destroy() {
    if (this._ticker) {
      const oldTicker = this._ticker;
      this.ticker = null, oldTicker.destroy();
    }
  }
}
TickerPlugin.extension = ExtensionType.Application;
extensions.add(TickerPlugin);
export {
  TickerPlugin
};
//# sourceMappingURL=TickerPlugin.mjs.map
