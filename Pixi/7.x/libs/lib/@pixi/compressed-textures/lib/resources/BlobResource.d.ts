import { BufferResource, ViewableBuffer } from '@pixi/core';
import type { BufferType, IBufferResourceOptions } from '@pixi/core';
/**
 * Constructor options for BlobResource.
 * @memberof PIXI
 */
export interface IBlobResourceOptions extends IBufferResourceOptions {
    autoLoad?: boolean;
}
/**
 * Resource that fetches texture data over the network and stores it in a buffer.
 * @class
 * @extends PIXI.Resource
 * @memberof PIXI
 */
export declare abstract class BlobResource extends BufferResource {
    /** The URL of the texture file. */
    protected origin: string | null;
    /** The viewable buffer on the data. */
    protected buffer: ViewableBuffer | null;
    protected loaded: boolean;
    /**
     * Promise when loading.
     * @default null
     */
    private _load;
    /**
     * @param source - The buffer/URL of the texture file.
     * @param {PIXI.IBlobResourceOptions} [options]
     * @param {boolean} [options.autoLoad=false] - Whether to fetch the data immediately;
     *  you can fetch it later via {@link PIXI.BlobResource#load}.
     * @param {number} [options.width=1] - The width in pixels.
     * @param {number} [options.height=1] - The height in pixels.
     * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
     */
    constructor(source: string | BufferType, options?: IBlobResourceOptions);
    protected onBlobLoaded(_data: ArrayBuffer): void;
    /** Loads the blob */
    load(): Promise<this>;
}
