"use strict";
class BatchPart {
  constructor() {
    this.reset();
  }
  /**
   * Begin batch part.
   * @param style
   * @param startIndex
   * @param attribStart
   */
  begin(style, startIndex, attribStart) {
    this.reset(), this.style = style, this.start = startIndex, this.attribStart = attribStart;
  }
  /**
   * End batch part.
   * @param endIndex
   * @param endAttrib
   */
  end(endIndex, endAttrib) {
    this.attribSize = endAttrib - this.attribStart, this.size = endIndex - this.start;
  }
  reset() {
    this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
  }
}
exports.BatchPart = BatchPart;
//# sourceMappingURL=BatchPart.js.map
