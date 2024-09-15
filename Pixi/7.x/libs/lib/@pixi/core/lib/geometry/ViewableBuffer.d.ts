import type { ITypedArray } from './Buffer';
/**
 * Flexible wrapper around `ArrayBuffer` that also provides typed array views on demand.
 * @memberof PIXI
 */
export declare class ViewableBuffer {
    size: number;
    /** Underlying `ArrayBuffer` that holds all the data and is of capacity `this.size`. */
    rawBinaryData: ArrayBuffer;
    /** View on the raw binary data as a `Uint32Array`. */
    uint32View: Uint32Array;
    /** View on the raw binary data as a `Float32Array`. */
    float32View: Float32Array;
    private _int8View;
    private _uint8View;
    private _int16View;
    private _uint16View;
    private _int32View;
    /**
     * @param length - The size of the buffer in bytes.
     */
    constructor(length: number);
    /**
     * @param arrayBuffer - The source array buffer.
     */
    constructor(arrayBuffer: ArrayBuffer);
    /** View on the raw binary data as a `Int8Array`. */
    get int8View(): Int8Array;
    /** View on the raw binary data as a `Uint8Array`. */
    get uint8View(): Uint8Array;
    /**  View on the raw binary data as a `Int16Array`. */
    get int16View(): Int16Array;
    /** View on the raw binary data as a `Uint16Array`. */
    get uint16View(): Uint16Array;
    /** View on the raw binary data as a `Int32Array`. */
    get int32View(): Int32Array;
    /**
     * Returns the view of the given type.
     * @param type - One of `int8`, `uint8`, `int16`,
     *    `uint16`, `int32`, `uint32`, and `float32`.
     * @returns - typed array of given type
     */
    view(type: string): ITypedArray;
    /** Destroys all buffer references. Do not use after calling this. */
    destroy(): void;
    static sizeOf(type: string): number;
}
