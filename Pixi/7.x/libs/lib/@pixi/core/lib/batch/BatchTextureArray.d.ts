import type { BaseTexture } from '../textures/BaseTexture';
/**
 * Used by the batcher to build texture batches.
 * Holds list of textures and their respective locations.
 * @memberof PIXI
 */
export declare class BatchTextureArray {
    /** Inside textures array. */
    elements: BaseTexture[];
    /** Respective locations for textures. */
    ids: number[];
    /** Number of filled elements. */
    count: number;
    constructor();
    clear(): void;
}
