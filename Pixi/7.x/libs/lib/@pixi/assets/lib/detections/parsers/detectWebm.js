"use strict";
var core = require("@pixi/core"), testVideoFormat = require("../utils/testVideoFormat.js");
const detectWebm = {
  extension: {
    type: core.ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat.testVideoFormat("video/webm"),
  add: async (formats) => [...formats, "webm"],
  remove: async (formats) => formats.filter((f) => f !== "webm")
};
core.extensions.add(detectWebm);
exports.detectWebm = detectWebm;
//# sourceMappingURL=detectWebm.js.map
