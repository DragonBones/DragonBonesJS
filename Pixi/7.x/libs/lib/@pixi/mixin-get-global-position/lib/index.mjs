import { Point } from "@pixi/core";
import { DisplayObject } from "@pixi/display";
DisplayObject.prototype.getGlobalPosition = function(point = new Point(), skipUpdate = !1) {
  return this.parent ? this.parent.toGlobal(this.position, point, skipUpdate) : (point.x = this.position.x, point.y = this.position.y), point;
};
//# sourceMappingURL=index.mjs.map
