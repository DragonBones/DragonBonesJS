import { GC_MODES } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Renderer } from '../Renderer';
import type { RenderTexture } from '../renderTexture/RenderTexture';
import type { ISystem } from '../system/ISystem';
import type { Texture } from './Texture';
export interface IUnloadableTexture {
    _texture: Texture | RenderTexture;
    children: IUnloadableTexture[];
}
/**
 * System plugin to the renderer to manage texture garbage collection on the GPU,
 * ensuring that it does not get clogged up with textures that are no longer being used.
 * @memberof PIXI
 */
export declare class TextureGCSystem implements ISystem {
    /**
     * Default garbage collection mode.
     * @static
     * @type {PIXI.GC_MODES}
     * @default PIXI.GC_MODES.AUTO
     * @see PIXI.TextureGCSystem#mode
     */
    static defaultMode: GC_MODES;
    /**
     * Default maximum idle frames before a texture is destroyed by garbage collection.
     * @static
     * @default 3600
     * @see PIXI.TextureGCSystem#maxIdle
     */
    static defaultMaxIdle: number;
    /**
     * Default frames between two garbage collections.
     * @static
     * @default 600
     * @see PIXI.TextureGCSystem#checkCountMax
     */
    static defaultCheckCountMax: number;
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * Frame count since started.
     * @readonly
     */
    count: number;
    /**
     * Frame count since last garbage collection.
     * @readonly
     */
    checkCount: number;
    /**
     * Maximum idle frames before a texture is destroyed by garbage collection.
     * @see PIXI.TextureGCSystem.defaultMaxIdle
     */
    maxIdle: number;
    /**
     * Frames between two garbage collections.
     * @see PIXI.TextureGCSystem.defaultCheckCountMax
     */
    checkCountMax: number;
    /**
     * Current garbage collection mode.
     * @see PIXI.TextureGCSystem.defaultMode
     */
    mode: GC_MODES;
    private renderer;
    /** @param renderer - The renderer this System works for. */
    constructor(renderer: Renderer);
    /**
     * Checks to see when the last time a texture was used.
     * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
     */
    protected postrender(): void;
    /**
     * Checks to see when the last time a texture was used.
     * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
     */
    run(): void;
    /**
     * Removes all the textures within the specified displayObject and its children from the GPU.
     * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
     */
    unload(displayObject: IUnloadableTexture): void;
    destroy(): void;
}
