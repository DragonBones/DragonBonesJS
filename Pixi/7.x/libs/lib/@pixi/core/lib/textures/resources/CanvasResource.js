"use strict";
var BaseImageResource = require("./BaseImageResource.js");
class CanvasResource extends BaseImageResource.BaseImageResource {
  /**
   * @param source - Canvas element to use
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(source) {
    super(source);
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if source is HTMLCanvasElement or OffscreenCanvas
   */
  static test(source) {
    const { OffscreenCanvas } = globalThis;
    return OffscreenCanvas && source instanceof OffscreenCanvas ? !0 : globalThis.HTMLCanvasElement && source instanceof HTMLCanvasElement;
  }
}
exports.CanvasResource = CanvasResource;
//# sourceMappingURL=CanvasResource.js.map
