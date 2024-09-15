"use strict";
var core = require("@pixi/core");
const imageFormats = ["png", "jpg", "jpeg"], detectDefaults = {
  extension: {
    type: core.ExtensionType.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (formats) => [...formats, ...imageFormats],
  remove: async (formats) => formats.filter((f) => !imageFormats.includes(f))
};
core.extensions.add(detectDefaults);
exports.detectDefaults = detectDefaults;
//# sourceMappingURL=detectDefaults.js.map
