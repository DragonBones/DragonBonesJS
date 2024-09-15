"use strict";
var core = require("@pixi/core"), testVideoFormat = require("../utils/testVideoFormat.js");
const detectOgv = {
  extension: {
    type: core.ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat.testVideoFormat("video/ogg"),
  add: async (formats) => [...formats, "ogv"],
  remove: async (formats) => formats.filter((f) => f !== "ogv")
};
core.extensions.add(detectOgv);
exports.detectOgv = detectOgv;
//# sourceMappingURL=detectOgv.js.map
