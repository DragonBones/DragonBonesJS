import { ExtensionType, extensions } from "@pixi/core";
import { testVideoFormat } from "../utils/testVideoFormat.mjs";
const detectWebm = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat("video/webm"),
  add: async (formats) => [...formats, "webm"],
  remove: async (formats) => formats.filter((f) => f !== "webm")
};
extensions.add(detectWebm);
export {
  detectWebm
};
//# sourceMappingURL=detectWebm.mjs.map
