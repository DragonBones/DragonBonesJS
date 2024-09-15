import { LoaderParserPriority, checkExtension, createTexture } from "@pixi/assets";
import { ExtensionType, settings, MIPMAP_MODES, ALPHA_MODES, utils, BaseTexture, extensions } from "@pixi/core";
import "../parsers/index.mjs";
import { parseKTX } from "../parsers/parseKTX.mjs";
const loadKTX = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  name: "loadKTX",
  test(url) {
    return checkExtension(url, ".ktx");
  },
  async load(url, asset, loader) {
    const arrayBuffer = await (await settings.ADAPTER.fetch(url)).arrayBuffer(), { compressed, uncompressed, kvData } = parseKTX(url, arrayBuffer), resources = compressed ?? uncompressed, options = {
      mipmap: MIPMAP_MODES.OFF,
      alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
      resolution: utils.getResolutionOfUrl(url),
      ...asset.data
    }, textures = resources.map((resource) => {
      resources === uncompressed && Object.assign(options, {
        type: resource.type,
        format: resource.format
      });
      const res = resource.resource ?? resource, base = new BaseTexture(res, options);
      return base.ktxKeyValueData = kvData, createTexture(base, loader, url);
    });
    return textures.length === 1 ? textures[0] : textures;
  },
  unload(texture) {
    Array.isArray(texture) ? texture.forEach((t) => t.destroy(!0)) : texture.destroy(!0);
  }
};
extensions.add(loadKTX);
export {
  loadKTX
};
//# sourceMappingURL=loadKTX.mjs.map
