import { ExtensionType, settings, extensions } from "@pixi/core";
import { checkDataUrl } from "../../utils/checkDataUrl.mjs";
import { checkExtension } from "../../utils/checkExtension.mjs";
import { LoaderParserPriority } from "./LoaderParser.mjs";
const validJSONExtension = ".json", validJSONMIME = "application/json", loadJson = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadJson",
  test(url) {
    return checkDataUrl(url, validJSONMIME) || checkExtension(url, validJSONExtension);
  },
  async load(url) {
    return await (await settings.ADAPTER.fetch(url)).json();
  }
};
extensions.add(loadJson);
export {
  loadJson
};
//# sourceMappingURL=loadJson.mjs.map
