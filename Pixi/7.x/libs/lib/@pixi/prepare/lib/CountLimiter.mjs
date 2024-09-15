class CountLimiter {
  /**
   * @param maxItemsPerFrame - The maximum number of items that can be prepared each frame.
   */
  constructor(maxItemsPerFrame) {
    this.maxItemsPerFrame = maxItemsPerFrame, this.itemsLeft = 0;
  }
  /** Resets any counting properties to start fresh on a new frame. */
  beginFrame() {
    this.itemsLeft = this.maxItemsPerFrame;
  }
  /**
   * Checks to see if another item can be uploaded. This should only be called once per item.
   * @returns If the item is allowed to be uploaded.
   */
  allowedToUpload() {
    return this.itemsLeft-- > 0;
  }
}
export {
  CountLimiter
};
//# sourceMappingURL=CountLimiter.mjs.map
