import { ExtensionType, extensions } from "@pixi/core";
const imageFormats = ["png", "jpg", "jpeg"], detectDefaults = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (formats) => [...formats, ...imageFormats],
  remove: async (formats) => formats.filter((f) => !imageFormats.includes(f))
};
extensions.add(detectDefaults);
export {
  detectDefaults
};
//# sourceMappingURL=detectDefaults.mjs.map
