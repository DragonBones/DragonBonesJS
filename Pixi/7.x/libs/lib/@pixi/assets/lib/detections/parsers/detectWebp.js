"use strict";
var core = require("@pixi/core"), testImageFormat = require("../utils/testImageFormat.js");
const detectWebp = {
  extension: {
    type: core.ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testImageFormat.testImageFormat(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (formats) => [...formats, "webp"],
  remove: async (formats) => formats.filter((f) => f !== "webp")
};
core.extensions.add(detectWebp);
exports.detectWebp = detectWebp;
//# sourceMappingURL=detectWebp.js.map
