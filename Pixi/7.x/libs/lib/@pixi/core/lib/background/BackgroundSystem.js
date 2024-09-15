"use strict";
var color = require("@pixi/color"), extensions = require("@pixi/extensions");
class BackgroundSystem {
  constructor() {
    this.clearBeforeRender = !0, this._backgroundColor = new color.Color(0), this.alpha = 1;
  }
  /**
   * initiates the background system
   * @param {PIXI.IRendererOptions} options - the options for the background colors
   */
  init(options) {
    this.clearBeforeRender = options.clearBeforeRender;
    const { backgroundColor, background, backgroundAlpha } = options, color2 = background ?? backgroundColor;
    color2 !== void 0 && (this.color = color2), this.alpha = backgroundAlpha;
  }
  /**
   * The background color to fill if not transparent.
   * @member {PIXI.ColorSource}
   */
  get color() {
    return this._backgroundColor.value;
  }
  set color(value) {
    this._backgroundColor.setValue(value);
  }
  /**
   * The background color alpha. Setting this to 0 will make the canvas transparent.
   * @member {number}
   */
  get alpha() {
    return this._backgroundColor.alpha;
  }
  set alpha(value) {
    this._backgroundColor.setAlpha(value);
  }
  /** The background color object. */
  get backgroundColor() {
    return this._backgroundColor;
  }
  destroy() {
  }
}
BackgroundSystem.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.backgroundAlpha}
   * @default 1
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  backgroundAlpha: 1,
  /**
   * {@link PIXI.IRendererOptions.backgroundColor}
   * @default 0x000000
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  backgroundColor: 0,
  /**
   * {@link PIXI.IRendererOptions.clearBeforeRender}
   * @default true
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  clearBeforeRender: !0
}, /** @ignore */
BackgroundSystem.extension = {
  type: [
    extensions.ExtensionType.RendererSystem,
    extensions.ExtensionType.CanvasRendererSystem
  ],
  name: "background"
};
extensions.extensions.add(BackgroundSystem);
exports.BackgroundSystem = BackgroundSystem;
//# sourceMappingURL=BackgroundSystem.js.map
