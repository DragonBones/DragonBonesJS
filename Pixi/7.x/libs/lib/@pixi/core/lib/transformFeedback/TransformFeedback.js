"use strict";
var runner = require("@pixi/runner");
class TransformFeedback {
  constructor() {
    this._glTransformFeedbacks = {}, this.buffers = [], this.disposeRunner = new runner.Runner("disposeTransformFeedback");
  }
  /**
   * Bind buffer to TransformFeedback
   * @param index - index to bind
   * @param buffer - buffer to bind
   */
  bindBuffer(index, buffer) {
    this.buffers[index] = buffer;
  }
  /** Destroy WebGL resources that are connected to this TransformFeedback. */
  destroy() {
    this.disposeRunner.emit(this, !1);
  }
}
exports.TransformFeedback = TransformFeedback;
//# sourceMappingURL=TransformFeedback.js.map
