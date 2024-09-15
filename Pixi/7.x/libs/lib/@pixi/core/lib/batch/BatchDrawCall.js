"use strict";
var constants = require("@pixi/constants");
class BatchDrawCall {
  constructor() {
    this.texArray = null, this.blend = 0, this.type = constants.DRAW_MODES.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
  }
}
exports.BatchDrawCall = BatchDrawCall;
//# sourceMappingURL=BatchDrawCall.js.map
