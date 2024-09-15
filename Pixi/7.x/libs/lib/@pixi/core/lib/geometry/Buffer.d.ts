import { BUFFER_TYPE } from '@pixi/constants';
import { Runner } from '@pixi/runner';
import type { GLBuffer } from './GLBuffer';
/**
 * Marks places in PixiJS where you can pass Float32Array, UInt32Array, any typed arrays, and ArrayBuffer.
 *
 * Same as ArrayBuffer in typescript lib, defined here just for documentation.
 * @memberof PIXI
 */
export interface IArrayBuffer extends ArrayBuffer {
}
/**
 * PixiJS classes use this type instead of ArrayBuffer and typed arrays
 * to support expressions like `geometry.buffers[0].data[0] = position.x`.
 *
 * Gives access to indexing and `length` field.
 * - @popelyshev: If data is actually ArrayBuffer and throws Exception on indexing - its user problem :)
 * @memberof PIXI
 */
export interface ITypedArray extends IArrayBuffer {
    readonly length: number;
    [index: number]: number;
    readonly BYTES_PER_ELEMENT: number;
}
/**
 * A wrapper for data so that it can be used and uploaded by WebGL
 * @memberof PIXI
 */
export declare class Buffer {
    /**
     * The data in the buffer, as a typed array
     * @type {PIXI.IArrayBuffer}
     */
    data: ITypedArray;
    /**
     * The type of buffer this is, one of:
     * + ELEMENT_ARRAY_BUFFER - used as an index buffer
     * + ARRAY_BUFFER - used as an attribute buffer
     * + UNIFORM_BUFFER - used as a uniform buffer (if available)
     */
    type: BUFFER_TYPE;
    static: boolean;
    id: number;
    disposeRunner: Runner;
    /**
     * A map of renderer IDs to webgl buffer
     * @private
     * @type {Record<number, GLBuffer>}
     */
    _glBuffers: {
        [key: number]: GLBuffer;
    };
    _updateID: number;
    /**
     * @param {PIXI.IArrayBuffer} data - the data to store in the buffer.
     * @param _static - `true` for static buffer
     * @param index - `true` for index buffer
     */
    constructor(data?: IArrayBuffer, _static?: boolean, index?: boolean);
    /**
     * Flags this buffer as requiring an upload to the GPU.
     * @param {PIXI.IArrayBuffer|number[]} [data] - the data to update in the buffer.
     */
    update(data?: IArrayBuffer | Array<number>): void;
    /** Disposes WebGL resources that are connected to this geometry. */
    dispose(): void;
    /** Destroys the buffer. */
    destroy(): void;
    /**
     * Flags whether this is an index buffer.
     *
     * Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
     * the buffer of type `ARRAY_BUFFER`.
     *
     * For backwards compatibility.
     */
    set index(value: boolean);
    get index(): boolean;
    /**
     * Helper function that creates a buffer based on an array or TypedArray
     * @param {ArrayBufferView | number[]} data - the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
     * @returns - A new Buffer based on the data provided.
     */
    static from(data: IArrayBuffer | number[]): Buffer;
}
