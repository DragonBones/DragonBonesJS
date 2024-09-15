import type { Buffer, TextureMatrix } from '@pixi/core';
/**
 * Class controls cache for UV mapping from Texture normal space to BaseTexture normal space.
 * @memberof PIXI
 */
export declare class MeshBatchUvs {
    /** UV Buffer data. */
    readonly data: Float32Array;
    /** Buffer with normalized UV's. */
    uvBuffer: Buffer;
    /** Material UV matrix. */
    uvMatrix: TextureMatrix;
    private _bufferUpdateId;
    private _textureUpdateId;
    _updateID: number;
    /**
     * @param uvBuffer - Buffer with normalized uv's
     * @param uvMatrix - Material UV matrix
     */
    constructor(uvBuffer: Buffer, uvMatrix: TextureMatrix);
    /**
     * Updates
     * @param forceUpdate - force the update
     */
    update(forceUpdate?: boolean): void;
}
