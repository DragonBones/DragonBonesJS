import { ExtensionType, settings, extensions } from "@pixi/core";
import { checkDataUrl } from "../../utils/checkDataUrl.mjs";
import { checkExtension } from "../../utils/checkExtension.mjs";
import { LoaderParserPriority } from "./LoaderParser.mjs";
const validTXTExtension = ".txt", validTXTMIME = "text/plain", loadTxt = {
  name: "loadTxt",
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  test(url) {
    return checkDataUrl(url, validTXTMIME) || checkExtension(url, validTXTExtension);
  },
  async load(url) {
    return await (await settings.ADAPTER.fetch(url)).text();
  }
};
extensions.add(loadTxt);
export {
  loadTxt
};
//# sourceMappingURL=loadTxt.mjs.map
