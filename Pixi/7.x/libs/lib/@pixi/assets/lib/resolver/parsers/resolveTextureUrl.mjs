import { ExtensionType, settings, utils, extensions } from "@pixi/core";
import "../../loader/index.mjs";
import { loadTextures } from "../../loader/parsers/textures/loadTextures.mjs";
const resolveTextureUrl = {
  extension: ExtensionType.ResolveParser,
  test: loadTextures.test,
  parse: (value) => ({
    resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
    format: utils.path.extname(value).slice(1),
    src: value
  })
};
extensions.add(resolveTextureUrl);
export {
  resolveTextureUrl
};
//# sourceMappingURL=resolveTextureUrl.mjs.map
