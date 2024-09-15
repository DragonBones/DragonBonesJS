"use strict";
var core = require("@pixi/core"), display = require("@pixi/display");
display.DisplayObject.prototype.getGlobalPosition = function(point = new core.Point(), skipUpdate = !1) {
  return this.parent ? this.parent.toGlobal(this.position, point, skipUpdate) : (point.x = this.position.x, point.y = this.position.y), point;
};
//# sourceMappingURL=index.js.map
