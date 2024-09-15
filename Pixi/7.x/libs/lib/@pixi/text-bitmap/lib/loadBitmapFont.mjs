import { LoaderParserPriority, copySearchParams } from "@pixi/assets";
import { ExtensionType, utils, settings, extensions } from "@pixi/core";
import { BitmapFont } from "./BitmapFont.mjs";
import "./formats/index.mjs";
import { TextFormat } from "./formats/TextFormat.mjs";
import { XMLStringFormat } from "./formats/XMLStringFormat.mjs";
const validExtensions = [".xml", ".fnt"], loadBitmapFont = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Normal
  },
  name: "loadBitmapFont",
  test(url) {
    return validExtensions.includes(utils.path.extname(url).toLowerCase());
  },
  async testParse(data) {
    return TextFormat.test(data) || XMLStringFormat.test(data);
  },
  async parse(asset, data, loader) {
    const fontData = TextFormat.test(asset) ? TextFormat.parse(asset) : XMLStringFormat.parse(asset), { src } = data, { page: pages } = fontData, textureUrls = [];
    for (let i = 0; i < pages.length; ++i) {
      const pageFile = pages[i].file;
      let imagePath = utils.path.join(utils.path.dirname(src), pageFile);
      imagePath = copySearchParams(imagePath, src), textureUrls.push(imagePath);
    }
    const loadedTextures = await loader.load(textureUrls), textures = textureUrls.map((url) => loadedTextures[url]);
    return BitmapFont.install(fontData, textures, !0);
  },
  async load(url, _options) {
    return (await settings.ADAPTER.fetch(url)).text();
  },
  unload(bitmapFont) {
    bitmapFont.destroy();
  }
};
extensions.add(loadBitmapFont);
export {
  loadBitmapFont
};
//# sourceMappingURL=loadBitmapFont.mjs.map
