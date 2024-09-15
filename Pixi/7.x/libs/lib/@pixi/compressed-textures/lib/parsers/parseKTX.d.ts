import { BufferResource, FORMATS, TYPES } from '@pixi/core';
import { CompressedTextureResource } from '../resources';
/**
 * Maps {@link PIXI.TYPES} to the bytes taken per component, excluding those ones that are bit-fields.
 * @ignore
 */
export declare const TYPES_TO_BYTES_PER_COMPONENT: {
    [id: number]: number;
};
/**
 * Number of components in each {@link PIXI.FORMATS}
 * @ignore
 */
export declare const FORMATS_TO_COMPONENTS: {
    [id: number]: number;
};
/**
 * Number of bytes per pixel in bit-field types in {@link PIXI.TYPES}
 * @ignore
 */
export declare const TYPES_TO_BYTES_PER_PIXEL: {
    [id: number]: number;
};
export declare function parseKTX(url: string, arrayBuffer: ArrayBuffer, loadKeyValueData?: boolean): {
    compressed?: CompressedTextureResource[];
    uncompressed?: {
        resource: BufferResource;
        type: TYPES;
        format: FORMATS;
    }[];
    kvData: Map<string, DataView> | null;
};
