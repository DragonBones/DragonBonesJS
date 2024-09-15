"use strict";
var extensions = require("@pixi/extensions"), _const = require("./const.js"), Ticker = require("./Ticker.js");
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
          this._ticker && this._ticker.remove(this.render, this), this._ticker = ticker, ticker && ticker.add(this.render, this, _const.UPDATE_PRIORITY.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = options.sharedTicker ? Ticker.Ticker.shared : new Ticker.Ticker(), options.autoStart && this.start();
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
TickerPlugin.extension = extensions.ExtensionType.Application;
extensions.extensions.add(TickerPlugin);
exports.TickerPlugin = TickerPlugin;
//# sourceMappingURL=TickerPlugin.js.map
