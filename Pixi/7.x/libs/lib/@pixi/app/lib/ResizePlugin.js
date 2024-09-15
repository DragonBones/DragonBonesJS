"use strict";
var core = require("@pixi/core");
class ResizePlugin {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(options) {
    Object.defineProperty(
      this,
      "resizeTo",
      /**
       * The HTML element or window to automatically resize the
       * renderer's view element to match width and height.
       * @member {Window|HTMLElement}
       * @name resizeTo
       * @memberof PIXI.Application#
       */
      {
        set(dom) {
          globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = dom, dom && (globalThis.addEventListener("resize", this.queueResize), this.resize());
        },
        get() {
          return this._resizeTo;
        }
      }
    ), this.queueResize = () => {
      this._resizeTo && (this.cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this.cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo)
        return;
      this.cancelResize();
      let width, height;
      if (this._resizeTo === globalThis.window)
        width = globalThis.innerWidth, height = globalThis.innerHeight;
      else {
        const { clientWidth, clientHeight } = this._resizeTo;
        width = clientWidth, height = clientHeight;
      }
      this.renderer.resize(width, height), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = options.resizeTo || null;
  }
  /**
   * Clean up the ticker, scoped to application
   * @static
   * @private
   */
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
ResizePlugin.extension = core.ExtensionType.Application;
core.extensions.add(ResizePlugin);
exports.ResizePlugin = ResizePlugin;
//# sourceMappingURL=ResizePlugin.js.map
