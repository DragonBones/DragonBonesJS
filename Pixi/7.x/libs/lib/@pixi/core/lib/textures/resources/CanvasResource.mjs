import { BaseImageResource } from "./BaseImageResource.mjs";
class CanvasResource extends BaseImageResource {
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
export {
  CanvasResource
};
//# sourceMappingURL=CanvasResource.mjs.map
