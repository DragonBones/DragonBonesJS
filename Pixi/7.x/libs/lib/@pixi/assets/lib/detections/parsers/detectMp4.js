"use strict";
var core = require("@pixi/core"), testVideoFormat = require("../utils/testVideoFormat.js");
const detectMp4 = {
  extension: {
    type: core.ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => testVideoFormat.testVideoFormat("video/mp4"),
  add: async (formats) => [...formats, "mp4", "m4v"],
  remove: async (formats) => formats.filter((f) => f !== "mp4" && f !== "m4v")
};
core.extensions.add(detectMp4);
exports.detectMp4 = detectMp4;
//# sourceMappingURL=detectMp4.js.map
