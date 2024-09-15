import { MSAA_QUALITY } from '@pixi/constants';
import { RenderTexture } from './RenderTexture';
import type { ISize } from '@pixi/math';
import type { IBaseTextureOptions } from '../textures/BaseTexture';
/**
 * Texture pool, used by FilterSystem and plugins.
 *
 * Stores collection of temporary pow2 or screen-sized renderTextures
 *
 * If you use custom RenderTexturePool for your filters, you can use methods
 * `getFilterTexture` and `returnFilterTexture` same as in
 * @memberof PIXI
 */
export declare class RenderTexturePool {
    textureOptions: IBaseTextureOptions;
    /**
     * Allow renderTextures of the same size as screen, not just pow2
     *
     * Automatically sets to true after `setScreenSize`
     * @default false
     */
    enableFullScreen: boolean;
    texturePool: {
        [x in string | number]: RenderTexture[];
    };
    private _pixelsWidth;
    private _pixelsHeight;
    /**
     * @param textureOptions - options that will be passed to BaseRenderTexture constructor
     * @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
     */
    constructor(textureOptions?: IBaseTextureOptions);
    /**
     * Creates texture with params that were specified in pool constructor.
     * @param realWidth - Width of texture in pixels.
     * @param realHeight - Height of texture in pixels.
     * @param multisample - Number of samples of the framebuffer.
     */
    createTexture(realWidth: number, realHeight: number, multisample?: MSAA_QUALITY): RenderTexture;
    /**
     * Gets a Power-of-Two render texture or fullScreen texture
     * @param minWidth - The minimum width of the render texture.
     * @param minHeight - The minimum height of the render texture.
     * @param resolution - The resolution of the render texture.
     * @param multisample - Number of samples of the render texture.
     * @returns The new render texture.
     */
    getOptimalTexture(minWidth: number, minHeight: number, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
    /**
     * Gets extra texture of the same size as input renderTexture
     *
     * `getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`
     * @param input - renderTexture from which size and resolution will be copied
     * @param resolution - override resolution of the renderTexture
     *  It overrides, it does not multiply
     * @param multisample - number of samples of the renderTexture
     */
    getFilterTexture(input: RenderTexture, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
    /**
     * Place a render texture back into the pool.
     * @param renderTexture - The renderTexture to free
     */
    returnTexture(renderTexture: RenderTexture): void;
    /**
     * Alias for returnTexture, to be compliant with FilterSystem interface.
     * @param renderTexture - The renderTexture to free
     */
    returnFilterTexture(renderTexture: RenderTexture): void;
    /**
     * Clears the pool.
     * @param destroyTextures - Destroy all stored textures.
     */
    clear(destroyTextures?: boolean): void;
    /**
     * If screen size was changed, drops all screen-sized textures,
     * sets new screen size, sets `enableFullScreen` to true
     *
     * Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`
     * @param size - Initial size of screen.
     */
    setScreenSize(size: ISize): void;
    /**
     * Key that is used to store fullscreen renderTextures in a pool
     * @readonly
     */
    static SCREEN_KEY: number;
}
