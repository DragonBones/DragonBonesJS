import { SAMPLER_TYPES } from '@pixi/constants';
import { BaseTexture } from './BaseTexture';
import { GLTexture } from './GLTexture';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { Texture } from './Texture';
/**
 * System plugin to the renderer to manage textures.
 * @memberof PIXI
 */
export declare class TextureSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * Bound textures.
     * @readonly
     */
    boundTextures: BaseTexture[];
    /**
     * List of managed textures.
     * @readonly
     */
    managedTextures: Array<BaseTexture>;
    /** Whether glTexture with int/uint sampler type was uploaded. */
    protected hasIntegerTextures: boolean;
    protected CONTEXT_UID: number;
    protected gl: IRenderingContext;
    protected internalFormats: {
        [type: number]: {
            [format: number]: number;
        };
    };
    protected samplerTypes: Record<number, SAMPLER_TYPES>;
    protected webGLVersion: number;
    /**
     * BaseTexture value that shows that we don't know what is bound.
     * @readonly
     */
    protected unknownTexture: BaseTexture;
    /**
     * Did someone temper with textures state? We'll overwrite them when we need to unbind something.
     * @private
     */
    protected _unknownBoundTextures: boolean;
    /**
     * Current location.
     * @readonly
     */
    currentLocation: number;
    emptyTextures: {
        [key: number]: GLTexture;
    };
    private renderer;
    /**
     * @param renderer - The renderer this system works for.
     */
    constructor(renderer: Renderer);
    /** Sets up the renderer context and necessary buffers. */
    contextChange(): void;
    /**
     * Bind a texture to a specific location
     *
     * If you want to unbind something, please use `unbind(texture)` instead of `bind(null, textureLocation)`
     * @param texture - Texture to bind
     * @param [location=0] - Location to bind at
     */
    bind(texture: Texture | BaseTexture, location?: number): void;
    /** Resets texture location and bound textures Actual `bind(null, i)` calls will be performed at next `unbind()` call */
    reset(): void;
    /**
     * Unbind a texture.
     * @param texture - Texture to bind
     */
    unbind(texture?: BaseTexture): void;
    /**
     * Ensures that current boundTextures all have FLOAT sampler type,
     * see {@link PIXI.SAMPLER_TYPES} for explanation.
     * @param maxTextures - number of locations to check
     */
    ensureSamplerType(maxTextures: number): void;
    /**
     * Initialize a texture
     * @private
     * @param texture - Texture to initialize
     */
    initTexture(texture: BaseTexture): GLTexture;
    initTextureType(texture: BaseTexture, glTexture: GLTexture): void;
    /**
     * Update a texture
     * @private
     * @param {PIXI.BaseTexture} texture - Texture to initialize
     */
    updateTexture(texture: BaseTexture): void;
    /**
     * Deletes the texture from WebGL
     * @private
     * @param texture - the texture to destroy
     * @param [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
     */
    destroyTexture(texture: BaseTexture | Texture, skipRemove?: boolean): void;
    /**
     * Update texture style such as mipmap flag
     * @private
     * @param {PIXI.BaseTexture} texture - Texture to update
     */
    updateTextureStyle(texture: BaseTexture): void;
    /**
     * Set style for texture
     * @private
     * @param texture - Texture to update
     * @param glTexture
     */
    setStyle(texture: BaseTexture, glTexture: GLTexture): void;
    destroy(): void;
}
