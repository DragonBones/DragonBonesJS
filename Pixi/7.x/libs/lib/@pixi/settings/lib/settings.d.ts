import type { IAdapter } from './adapter';
interface ISettings {
    ADAPTER: IAdapter;
    RESOLUTION: number;
    CREATE_IMAGE_BITMAP: boolean;
    ROUND_PIXELS: boolean;
}
/**
 * User's customizable globals for overriding the default PIXI settings, such
 * as a renderer's default resolution, framerate, float precision, etc.
 * @example
 * import { settings, ENV } from 'pixi.js';
 *
 * // Use the native window resolution as the default resolution
 * // will support high-density displays when rendering
 * settings.RESOLUTION = window.devicePixelRatio;
 *
 * // Used for older v1 WebGL devices for backwards compatibility
 * settings.PREFER_ENV = ENV.WEBGL_LEGACY;
 * @namespace PIXI.settings
 */
export declare const settings: ISettings & Partial<GlobalMixins.Settings>;
export {};
