import { BaseImageResource } from "./BaseImageResource.mjs";
class VideoFrameResource extends BaseImageResource {
  /**
   * @param source - Image element to use
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(source) {
    super(source);
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if source is an VideoFrame
   */
  static test(source) {
    return !!globalThis.VideoFrame && source instanceof globalThis.VideoFrame;
  }
}
export {
  VideoFrameResource
};
//# sourceMappingURL=VideoFrameResource.mjs.map
