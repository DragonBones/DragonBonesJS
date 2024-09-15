import { BlobResource } from './BlobResource';
import type { BaseTexture, BufferType, GLTexture, Renderer } from '@pixi/core';
import type { INTERNAL_FORMATS } from '../const';
/**
 * Used in parseKTX
 * @ignore
 */
export type CompressedLevelBuffer = {
    levelID: number;
    levelWidth: number;
    levelHeight: number;
    levelBuffer: Uint8Array;
};
/**
 * @ignore
 */
export interface ICompressedTextureResourceOptions {
    format: INTERNAL_FORMATS;
    width: number;
    height: number;
    levels?: number;
    levelBuffers?: CompressedLevelBuffer[];
}
/**
 * Resource for compressed texture formats, as follows: S3TC/DXTn (& their sRGB formats), ATC, ASTC, ETC 1/2, PVRTC,
 * BPTC (BC6H, BC7).
 *
 * Compressed textures improve performance when rendering is texture-bound. The texture data stays compressed in
 * graphics memory, increasing memory locality and speeding up texture fetches. These formats can also be used to store
 * more detail in the same amount of memory.
 *
 * For most developers, container file formats are a better abstraction instead of directly handling raw texture
 * data. PixiJS provides native support for the following texture file formats
 * (via {@link PIXI.loadBasis}, {@link PIXI.loadKTX}, and {@link PIXI.loadDDS}):
 *
 * **.dds** - the DirectDraw Surface file format stores DXTn (DXT-1,3,5) data or BCn (BC6H, BC7). See {@link PIXI.parseDDS}
 * **.ktx** - the Khronos Texture Container file format supports storing all the supported WebGL compression formats.
 *  See {@link PIXI.parseKTX}.
 * **.basis** - the BASIS supercompressed file format stores texture data in an internal format that is transcoded
 *  to the compression format supported on the device at _runtime_. It also supports transcoding into a uncompressed
 *  format as a fallback; you must install the `@pixi/basis-loader`, `@pixi/basis-transcoder` packages separately to
 *  use these files. See {@link PIXI.BasisParser}.
 *
 * The loaders for the aforementioned formats use `CompressedTextureResource` internally. It is strongly suggested that
 * they be used instead.
 *
 * ## Working directly with CompressedTextureResource
 *
 * Since `CompressedTextureResource` inherits `BlobResource`, you can provide it a URL pointing to a file containing
 * the raw texture data (with no file headers!):
 * @example
 * import { CompressedTextureResource, INTERNAL_FORMATS } from '@pixi/compressed-textures';
 * import { BaseTexture, Texture, ALPHA_MODES } from 'pixi.js';
 *
 * // The resource backing the texture data for your textures.
 * // NOTE: You can also provide a ArrayBufferView instead of a URL. This is used when loading data from a container file
 * //   format such as KTX, DDS, or BASIS.
 * const compressedResource = new CompressedTextureResource('bunny.dxt5', {
 *     format: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
 *     width: 256,
 *     height: 256,
 * });
 *
 * // You can create a base-texture to the cache, so that future `Texture`s can be created using the `Texture.from` API.
 * const baseTexture = new BaseTexture(compressedResource, { pmaMode: ALPHA_MODES.NPM });
 *
 * // Create a Texture to add to the TextureCache
 * const texture = new Texture(baseTexture);
 *
 * // Add baseTexture & texture to the global texture cache
 * BaseTexture.addToCache(baseTexture, 'bunny.dxt5');
 * Texture.addToCache(texture, 'bunny.dxt5');
 * @memberof PIXI
 */
export declare class CompressedTextureResource extends BlobResource {
    /** The compression format */
    format: INTERNAL_FORMATS;
    /**
     * The number of mipmap levels stored in the resource buffer.
     * @default 1
     */
    levels: number;
    private _extension;
    private _levelBuffers;
    /**
     * @param source - the buffer/URL holding the compressed texture data
     * @param options
     * @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
     * @param {number} options.width - the image width in pixels.
     * @param {number} options.height - the image height in pixels.
     * @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
     * @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
     *      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
     */
    constructor(source: string | BufferType, options: ICompressedTextureResourceOptions);
    /**
     * @override
     * @param renderer - A reference to the current renderer
     * @param _texture - the texture
     * @param _glTexture - texture instance for this webgl context
     */
    upload(renderer: Renderer, _texture: BaseTexture, _glTexture: GLTexture): boolean;
    /** @protected */
    protected onBlobLoaded(): void;
    /**
     * Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
     * @private
     * @param format - the compression format to get the extension for.
     */
    private static _formatToExtension;
    /**
     * Pre-creates buffer views for each mipmap level
     * @private
     * @param buffer -
     * @param format - compression formats
     * @param levels - mipmap levels
     * @param blockWidth -
     * @param blockHeight -
     * @param imageWidth - width of the image in pixels
     * @param imageHeight - height of the image in pixels
     */
    private static _createLevelBuffers;
}
