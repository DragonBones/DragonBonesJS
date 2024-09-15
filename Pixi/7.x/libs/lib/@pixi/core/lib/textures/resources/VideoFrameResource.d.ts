import { BaseImageResource } from './BaseImageResource';
/**
 * Resource type for VideoFrame.
 * @memberof PIXI
 */
export declare class VideoFrameResource extends BaseImageResource {
    /**
     * @param source - Image element to use
     */
    constructor(source: VideoFrame);
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @returns {boolean} `true` if source is an VideoFrame
     */
    static test(source: unknown): source is VideoFrame;
}
