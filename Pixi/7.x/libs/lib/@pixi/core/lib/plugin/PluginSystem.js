"use strict";
var extensions = require("@pixi/extensions"), utils = require("@pixi/utils");
class PluginSystem {
  constructor(renderer) {
    this.renderer = renderer, this.plugins = {}, Object.defineProperties(this.plugins, {
      extract: {
        enumerable: !1,
        get() {
          return utils.deprecation("7.0.0", "renderer.plugins.extract has moved to renderer.extract"), renderer.extract;
        }
      },
      prepare: {
        enumerable: !1,
        get() {
          return utils.deprecation("7.0.0", "renderer.plugins.prepare has moved to renderer.prepare"), renderer.prepare;
        }
      },
      interaction: {
        enumerable: !1,
        get() {
          return utils.deprecation("7.0.0", "renderer.plugins.interaction has been deprecated, use renderer.events"), renderer.events;
        }
      }
    });
  }
  /**
   * Initialize the plugins.
   * @protected
   */
  init() {
    const staticMap = this.rendererPlugins;
    for (const o in staticMap)
      this.plugins[o] = new staticMap[o](this.renderer);
  }
  destroy() {
    for (const o in this.plugins)
      this.plugins[o].destroy(), this.plugins[o] = null;
  }
}
PluginSystem.extension = {
  type: [
    extensions.ExtensionType.RendererSystem,
    extensions.ExtensionType.CanvasRendererSystem
  ],
  name: "_plugin"
};
extensions.extensions.add(PluginSystem);
exports.PluginSystem = PluginSystem;
//# sourceMappingURL=PluginSystem.js.map
