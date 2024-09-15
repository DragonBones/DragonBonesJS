"use strict";
class TimeLimiter {
  /** @param maxMilliseconds - The maximum milliseconds that can be spent preparing items each frame. */
  constructor(maxMilliseconds) {
    this.maxMilliseconds = maxMilliseconds, this.frameStart = 0;
  }
  /** Resets any counting properties to start fresh on a new frame. */
  beginFrame() {
    this.frameStart = Date.now();
  }
  /**
   * Checks to see if another item can be uploaded. This should only be called once per item.
   * @returns - If the item is allowed to be uploaded.
   */
  allowedToUpload() {
    return Date.now() - this.frameStart < this.maxMilliseconds;
  }
}
exports.TimeLimiter = TimeLimiter;
//# sourceMappingURL=TimeLimiter.js.map
