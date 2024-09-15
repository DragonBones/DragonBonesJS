import { BaseImageResource } from './BaseImageResource';
import type { Dict } from '@pixi/utils';
export interface IVideoResourceOptions {
    autoLoad?: boolean;
    autoPlay?: boolean;
    updateFPS?: number;
    crossorigin?: boolean | string;
    loop?: boolean;
    muted?: boolean;
    playsinline?: boolean;
}
export interface IVideoResourceOptionsElement {
    src: string;
    mime: string;
}
/**
 * Resource type for {@link HTMLVideoElement}.
 * @memberof PIXI
 */
export declare class VideoResource extends BaseImageResource {
    /** Override the source to be the video element. */
    source: HTMLVideoElement;
    /**
     * `true` to use Ticker.shared to auto update the base texture.
     * @default true
     */
    protected _autoUpdate: boolean;
    /**
     * `true` if the instance is currently connected to PIXI.Ticker.shared to auto update the base texture.
     * @default false
     */
    protected _isConnectedToTicker: boolean;
    protected _updateFPS: number;
    protected _msToNextUpdate: number;
    private _videoFrameRequestCallbackHandle;
    /**
     * When set to true will automatically play videos used by this texture once
     * they are loaded. If false, it will not modify the playing state.
     * @default true
     */
    protected autoPlay: boolean;
    /**
     * Promise when loading.
     * @default null
     */
    private _load;
    /** Callback when completed with load. */
    private _resolve;
    private _reject;
    /**
     * @param {HTMLVideoElement|object|string|Array<string|object>} source - Video element to use.
     * @param {object} [options] - Options to use
     * @param {boolean} [options.autoLoad=true] - Start loading the video immediately
     * @param {boolean} [options.autoPlay=true] - Start playing video immediately
     * @param {number} [options.updateFPS=0] - How many times a second to update the texture from the video.
     * If 0, `requestVideoFrameCallback` is used to update the texture.
     * If `requestVideoFrameCallback` is not available, the texture is updated every render.
     * @param {boolean} [options.crossorigin=true] - Load image using cross origin
     * @param {boolean} [options.loop=false] - Loops the video
     * @param {boolean} [options.muted=false] - Mutes the video audio, useful for autoplay
     * @param {boolean} [options.playsinline=true] - Prevents opening the video on mobile devices
     */
    constructor(source?: HTMLVideoElement | Array<string | IVideoResourceOptionsElement> | string, options?: IVideoResourceOptions);
    /**
     * Trigger updating of the texture.
     * @param _deltaTime - time delta since last tick
     */
    update(_deltaTime?: number): void;
    private _videoFrameRequestCallback;
    /**
     * Start preloading the video resource.
     * @returns {Promise<void>} Handle the validate event
     */
    load(): Promise<this>;
    /**
     * Handle video error events.
     * @param event
     */
    private _onError;
    /**
     * Returns true if the underlying source is playing.
     * @returns - True if playing.
     */
    private _isSourcePlaying;
    /**
     * Returns true if the underlying source is ready for playing.
     * @returns - True if ready.
     */
    private _isSourceReady;
    /** Runs the update loop when the video is ready to play. */
    private _onPlayStart;
    /** Fired when a pause event is triggered, stops the update loop. */
    private _onPlayStop;
    /** Fired when the video is completed seeking to the current playback position. */
    private _onSeeked;
    /** Fired when the video is loaded and ready to play. */
    private _onCanPlay;
    /** Destroys this texture. */
    dispose(): void;
    /** Should the base texture automatically update itself, set to true by default. */
    get autoUpdate(): boolean;
    set autoUpdate(value: boolean);
    /**
     * How many times a second to update the texture from the video. If 0, `requestVideoFrameCallback` is used to
     * update the texture. If `requestVideoFrameCallback` is not available, the texture is updated every render.
     * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
     */
    get updateFPS(): number;
    set updateFPS(value: number);
    private _configureAutoUpdate;
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @param {string} extension - The extension of source, if set
     * @returns {boolean} `true` if video source
     */
    static test(source: unknown, extension?: string): source is HTMLVideoElement;
    /**
     * List of common video file extensions supported by VideoResource.
     * @readonly
     */
    static TYPES: Array<string>;
    /**
     * Map of video MIME types that can't be directly derived from file extensions.
     * @readonly
     */
    static MIME_TYPES: Dict<string>;
}
