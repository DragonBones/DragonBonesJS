const _BoundingBox = class {
  /**
   * @param left - The left coordinate value of the bounding box.
   * @param top - The top coordinate value of the bounding box.
   * @param right - The right coordinate value of the bounding box.
   * @param bottom - The bottom coordinate value of the bounding box.
   */
  constructor(left, top, right, bottom) {
    this.left = left, this.top = top, this.right = right, this.bottom = bottom;
  }
  /** The width of the bounding box. */
  get width() {
    return this.right - this.left;
  }
  /** The height of the bounding box. */
  get height() {
    return this.bottom - this.top;
  }
  /** Determines whether the BoundingBox is empty. */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
};
_BoundingBox.EMPTY = new _BoundingBox(0, 0, 0, 0);
let BoundingBox = _BoundingBox;
export {
  BoundingBox
};
//# sourceMappingURL=BoundingBox.mjs.map
