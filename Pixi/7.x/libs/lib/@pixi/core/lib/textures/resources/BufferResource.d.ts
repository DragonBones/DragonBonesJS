import { Resource } from './Resource';
import type { ISize } from '@pixi/math';
import type { Renderer } from '../../Renderer';
import type { BaseTexture } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
export type BufferType = null | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array;
/**
 * Constructor options for BufferResource.
 * @memberof PIXI
 */
export interface IBufferResourceOptions extends ISize {
    unpackAlignment?: 1 | 2 | 4 | 8;
}
/**
 * Buffer resource with data of typed array.
 * @memberof PIXI
 */
export declare class BufferResource extends Resource {
    /** The data of this resource. */
    data: BufferType;
    /** The alignment of the rows in the data. */
    unpackAlignment: 1 | 2 | 4 | 8;
    /**
     * @param source - Source buffer
     * @param options - Options
     * @param {number} options.width - Width of the texture
     * @param {number} options.height - Height of the texture
     * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
     */
    constructor(source: BufferType, options: IBufferResourceOptions);
    /**
     * Upload the texture to the GPU.
     * @param renderer - Upload to the renderer
     * @param baseTexture - Reference to parent texture
     * @param glTexture - glTexture
     * @returns - true is success
     */
    upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
    /** Destroy and don't use after this. */
    dispose(): void;
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @returns {boolean} `true` if buffer source
     */
    static test(source: unknown): source is BufferType;
}
