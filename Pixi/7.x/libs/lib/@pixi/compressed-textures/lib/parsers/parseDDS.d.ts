import { CompressedTextureResource } from '../resources';
/**
 * Parses the DDS file header, generates base-textures, and puts them into the texture cache.
 * @see https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
 * @param arrayBuffer
 * @memberof PIXI
 */
export declare function parseDDS(arrayBuffer: ArrayBuffer): CompressedTextureResource[];
