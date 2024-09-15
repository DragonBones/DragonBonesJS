"use strict";
var settings = require("@pixi/settings");
settings.settings.RETINA_PREFIX = /@([0-9\.]+)x/;
settings.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
Object.defineProperty(exports, "settings", {
  enumerable: !0,
  get: function() {
    return settings.settings;
  }
});
//# sourceMappingURL=settings.js.map
