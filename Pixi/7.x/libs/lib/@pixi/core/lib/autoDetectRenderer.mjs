import { extensions, ExtensionType } from "@pixi/extensions";
const renderers = [];
extensions.handleByList(ExtensionType.Renderer, renderers);
function autoDetectRenderer(options) {
  for (const RendererType of renderers)
    if (RendererType.test(options))
      return new RendererType(options);
  throw new Error("Unable to auto-detect a suitable renderer.");
}
export {
  autoDetectRenderer
};
//# sourceMappingURL=autoDetectRenderer.mjs.map
