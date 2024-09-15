import { ObjectRenderer } from './ObjectRenderer';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { BaseTexture } from '../textures/BaseTexture';
import type { BatchTextureArray } from './BatchTextureArray';
/**
 * System plugin to the renderer to manage batching.
 * @memberof PIXI
 */
export declare class BatchSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /** An empty renderer. */
    readonly emptyRenderer: ObjectRenderer;
    /** The currently active ObjectRenderer. */
    currentRenderer: ObjectRenderer;
    private renderer;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    /**
     * Changes the current renderer to the one given in parameter
     * @param objectRenderer - The object renderer to use.
     */
    setObjectRenderer(objectRenderer: ObjectRenderer): void;
    /**
     * This should be called if you wish to do some custom rendering
     * It will basically render anything that may be batched up such as sprites
     */
    flush(): void;
    /** Reset the system to an empty renderer */
    reset(): void;
    /**
     * Handy function for batch renderers: copies bound textures in first maxTextures locations to array
     * sets actual _batchLocation for them
     * @param arr - arr copy destination
     * @param maxTextures - number of copied elements
     */
    copyBoundTextures(arr: BaseTexture[], maxTextures: number): void;
    /**
     * Assigns batch locations to textures in array based on boundTextures state.
     * All textures in texArray should have `_batchEnabled = _batchId`,
     * and their count should be less than `maxTextures`.
     * @param texArray - textures to bound
     * @param boundTextures - current state of bound textures
     * @param batchId - marker for _batchEnabled param of textures in texArray
     * @param maxTextures - number of texture locations to manipulate
     */
    boundArray(texArray: BatchTextureArray, boundTextures: Array<BaseTexture>, batchId: number, maxTextures: number): void;
    /**
     * @ignore
     */
    destroy(): void;
}
