"use strict";
var extensions = require("@pixi/extensions");
const renderers = [];
extensions.extensions.handleByList(extensions.ExtensionType.Renderer, renderers);
function autoDetectRenderer(options) {
  for (const RendererType of renderers)
    if (RendererType.test(options))
      return new RendererType(options);
  throw new Error("Unable to auto-detect a suitable renderer.");
}
exports.autoDetectRenderer = autoDetectRenderer;
//# sourceMappingURL=autoDetectRenderer.js.map
