import { LoaderParserPriority, checkExtension, createTexture } from "@pixi/assets";
import { ExtensionType, settings, BaseTexture, MIPMAP_MODES, ALPHA_MODES, utils, extensions } from "@pixi/core";
import "../parsers/index.mjs";
import { parseDDS } from "../parsers/parseDDS.mjs";
const loadDDS = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  name: "loadDDS",
  test(url) {
    return checkExtension(url, ".dds");
  },
  async load(url, asset, loader) {
    const arrayBuffer = await (await settings.ADAPTER.fetch(url)).arrayBuffer(), textures = parseDDS(arrayBuffer).map((resource) => {
      const base = new BaseTexture(resource, {
        mipmap: MIPMAP_MODES.OFF,
        alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
        resolution: utils.getResolutionOfUrl(url),
        ...asset.data
      });
      return createTexture(base, loader, url);
    });
    return textures.length === 1 ? textures[0] : textures;
  },
  unload(texture) {
    Array.isArray(texture) ? texture.forEach((t) => t.destroy(!0)) : texture.destroy(!0);
  }
};
extensions.add(loadDDS);
export {
  loadDDS
};
//# sourceMappingURL=loadDDS.mjs.map
