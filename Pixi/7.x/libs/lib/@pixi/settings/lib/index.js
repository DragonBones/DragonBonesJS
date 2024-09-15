"use strict";
var adapter = require("./adapter.js");
require("./ICanvas.js");
require("./ICanvasRenderingContext2D.js");
var settings = require("./settings.js"), isMobile = require("./utils/isMobile.js");
exports.BrowserAdapter = adapter.BrowserAdapter;
exports.settings = settings.settings;
exports.isMobile = isMobile.isMobile;
//# sourceMappingURL=index.js.map
