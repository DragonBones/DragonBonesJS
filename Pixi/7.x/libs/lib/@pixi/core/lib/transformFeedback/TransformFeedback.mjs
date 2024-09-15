import { Runner } from "@pixi/runner";
class TransformFeedback {
  constructor() {
    this._glTransformFeedbacks = {}, this.buffers = [], this.disposeRunner = new Runner("disposeTransformFeedback");
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
export {
  TransformFeedback
};
//# sourceMappingURL=TransformFeedback.mjs.map
