"use strict";
var core = require("@pixi/core"), display = require("@pixi/display");
const _Application = class _Application2 {
  /**
   * @param options - The optional application and renderer parameters.
   */
  constructor(options) {
    this.stage = new display.Container(), options = Object.assign({
      forceCanvas: !1
    }, options), this.renderer = core.autoDetectRenderer(options), _Application2._plugins.forEach((plugin) => {
      plugin.init.call(this, options);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render(this.stage);
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {PIXI.ICanvas}
   * @readonly
   */
  get view() {
    return this.renderer?.view;
  }
  /**
   * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
   * @member {PIXI.Rectangle}
   * @readonly
   */
  get screen() {
    return this.renderer?.screen;
  }
  /**
   * Destroy and don't use after this.
   * @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
   * @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'stageOptions' will be passed on to those calls.
   * @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
   *  to true. Should it destroy the texture of the child sprite
   * @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
   *  to true. Should it destroy the base texture of the child sprite
   */
  destroy(removeView, stageOptions) {
    const plugins = _Application2._plugins.slice(0);
    plugins.reverse(), plugins.forEach((plugin) => {
      plugin.destroy.call(this);
    }), this.stage.destroy(stageOptions), this.stage = null, this.renderer.destroy(removeView), this.renderer = null;
  }
};
_Application._plugins = [];
let Application = _Application;
core.extensions.handleByList(core.ExtensionType.Application, Application._plugins);
exports.Application = Application;
//# sourceMappingURL=Application.js.map
