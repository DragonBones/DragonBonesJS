import { ExtensionType, extensions } from "@pixi/core";
import { testImageFormat } from "../utils/testImageFormat.mjs";
const detectWebp = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testImageFormat(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (formats) => [...formats, "webp"],
  remove: async (formats) => formats.filter((f) => f !== "webp")
};
extensions.add(detectWebp);
export {
  detectWebp
};
//# sourceMappingURL=detectWebp.mjs.map
