"use strict";
var extensions = require("@pixi/extensions"), math = require("@pixi/math"), settings = require("@pixi/settings");
class ViewSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  /**
   * initiates the view system
   * @param {PIXI.ViewOptions} options - the options for the view
   */
  init(options) {
    this.screen = new math.Rectangle(0, 0, options.width, options.height), this.element = options.view || settings.settings.ADAPTER.createCanvas(), this.resolution = options.resolution || settings.settings.RESOLUTION, this.autoDensity = !!options.autoDensity;
  }
  /**
   * Resizes the screen and canvas to the specified dimensions.
   * @param desiredScreenWidth - The new width of the screen.
   * @param desiredScreenHeight - The new height of the screen.
   */
  resizeView(desiredScreenWidth, desiredScreenHeight) {
    this.element.width = Math.round(desiredScreenWidth * this.resolution), this.element.height = Math.round(desiredScreenHeight * this.resolution);
    const screenWidth = this.element.width / this.resolution, screenHeight = this.element.height / this.resolution;
    this.screen.width = screenWidth, this.screen.height = screenHeight, this.autoDensity && (this.element.style.width = `${screenWidth}px`, this.element.style.height = `${screenHeight}px`), this.renderer.emit("resize", screenWidth, screenHeight), this.renderer.runners.resize.emit(this.screen.width, this.screen.height);
  }
  /**
   * Destroys this System and optionally removes the canvas from the dom.
   * @param {boolean} [removeView=false] - Whether to remove the canvas from the DOM.
   */
  destroy(removeView) {
    removeView && this.element.parentNode?.removeChild(this.element), this.renderer = null, this.element = null, this.screen = null;
  }
}
ViewSystem.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.width}
   * @default 800
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  width: 800,
  /**
   * {@link PIXI.IRendererOptions.height}
   * @default 600
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  height: 600,
  /**
   * {@link PIXI.IRendererOptions.resolution}
   * @type {number}
   * @default PIXI.settings.RESOLUTION
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  resolution: void 0,
  /**
   * {@link PIXI.IRendererOptions.autoDensity}
   * @default false
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  autoDensity: !1
}, /** @ignore */
ViewSystem.extension = {
  type: [
    extensions.ExtensionType.RendererSystem,
    extensions.ExtensionType.CanvasRendererSystem
  ],
  name: "_view"
};
extensions.extensions.add(ViewSystem);
exports.ViewSystem = ViewSystem;
//# sourceMappingURL=ViewSystem.js.map
