"use strict";
var extensions = require("@pixi/extensions");
class StartupSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  /**
   * It all starts here! This initiates every system, passing in the options for any system by name.
   * @param options - the config for the renderer and all its systems
   */
  run(options) {
    const { renderer } = this;
    renderer.runners.init.emit(renderer.options), options.hello && console.log(`PixiJS 7.4.2 - ${renderer.rendererLogId} - https://pixijs.com`), renderer.resize(renderer.screen.width, renderer.screen.height);
  }
  destroy() {
  }
}
StartupSystem.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.hello}
   * @default false
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  hello: !1
}, /** @ignore */
StartupSystem.extension = {
  type: [
    extensions.ExtensionType.RendererSystem,
    extensions.ExtensionType.CanvasRendererSystem
  ],
  name: "startup"
};
extensions.extensions.add(StartupSystem);
exports.StartupSystem = StartupSystem;
//# sourceMappingURL=StartupSystem.js.map
