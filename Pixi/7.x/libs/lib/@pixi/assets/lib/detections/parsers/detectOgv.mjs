import { ExtensionType, extensions } from "@pixi/core";
import { testVideoFormat } from "../utils/testVideoFormat.mjs";
const detectOgv = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat("video/ogg"),
  add: async (formats) => [...formats, "ogv"],
  remove: async (formats) => formats.filter((f) => f !== "ogv")
};
extensions.add(detectOgv);
export {
  detectOgv
};
//# sourceMappingURL=detectOgv.mjs.map
