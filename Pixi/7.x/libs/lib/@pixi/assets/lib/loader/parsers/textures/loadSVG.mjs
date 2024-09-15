import { ExtensionType, SVGResource, BaseTexture, utils, settings, extensions } from "@pixi/core";
import { checkDataUrl } from "../../../utils/checkDataUrl.mjs";
import { checkExtension } from "../../../utils/checkExtension.mjs";
import { LoaderParserPriority } from "../LoaderParser.mjs";
import { loadTextures } from "./loadTextures.mjs";
import { createTexture } from "./utils/createTexture.mjs";
const validSVGExtension = ".svg", validSVGMIME = "image/svg+xml", loadSVG = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  name: "loadSVG",
  test(url) {
    return checkDataUrl(url, validSVGMIME) || checkExtension(url, validSVGExtension);
  },
  async testParse(data) {
    return SVGResource.test(data);
  },
  async parse(asset, data, loader) {
    const src = new SVGResource(asset, data?.data?.resourceOptions);
    await src.load();
    const base = new BaseTexture(src, {
      resolution: utils.getResolutionOfUrl(asset),
      ...data?.data
    });
    return base.resource.src = data.src, createTexture(base, loader, data.src);
  },
  async load(url, _options) {
    return (await settings.ADAPTER.fetch(url)).text();
  },
  unload: loadTextures.unload
};
extensions.add(loadSVG);
export {
  loadSVG
};
//# sourceMappingURL=loadSVG.mjs.map
