import { ExtensionType, extensions } from "@pixi/core";
import { testVideoFormat } from "../utils/testVideoFormat.mjs";
const detectMp4 = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat("video/mp4"),
  add: async (formats) => [...formats, "mp4", "m4v"],
  remove: async (formats) => formats.filter((f) => f !== "mp4" && f !== "m4v")
};
extensions.add(detectMp4);
export {
  detectMp4
};
//# sourceMappingURL=detectMp4.mjs.map
