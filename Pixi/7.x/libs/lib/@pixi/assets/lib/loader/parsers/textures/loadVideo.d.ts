import type { IBaseTextureOptions, IVideoResourceOptions, Texture } from '@pixi/core';
import type { LoaderParser } from '../LoaderParser';
/**
 * Configuration for the `loadVideo` loader parser.
 * @memberof PIXI
 * @see PIXI.loadVideo
 */
export interface LoadVideoConfig {
    /**
     * When set to `true`, the video will start playing automatically after being loaded,
     * otherwise it will not start playing automatically.
     * @default true
     */
    defaultAutoPlay: boolean;
    /**
     * How many times a second to update the texture of the loaded video by default.
     * If 0, `requestVideoFrameCallback` is used to update the texture.
     * If `requestVideoFrameCallback` is not available, the texture is updated every render.
     * @default 0
     */
    defaultUpdateFPS: number;
    /**
     * When set to `true`, the loaded video will loop by default.
     * @default false
     */
    defaultLoop: boolean;
    /**
     * When set to `true`, the loaded video will be muted.
     * @default false
     */
    defaultMuted: boolean;
    /**
     * When set to `true`, opening the video on mobile devices is prevented.
     * @default true
     */
    defaultPlaysinline: boolean;
}
/**
 * Loads videos into Textures.
 * @memberof PIXI
 */
export declare const loadVideo: LoaderParser<Texture<import("@pixi/core").Resource>, IBaseTextureOptions<IVideoResourceOptions>, LoadVideoConfig>;
