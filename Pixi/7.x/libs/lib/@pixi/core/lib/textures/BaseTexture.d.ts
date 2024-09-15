import { ALPHA_MODES, FORMATS, MIPMAP_MODES, SCALE_MODES, TARGETS, TYPES, WRAP_MODES } from '@pixi/constants';
import { EventEmitter } from '@pixi/utils';
import { BufferResource } from './resources/BufferResource';
import { Resource } from './resources/Resource';
import type { MSAA_QUALITY } from '@pixi/constants';
import type { ICanvas } from '@pixi/settings';
import type { GLTexture } from './GLTexture';
import type { IAutoDetectOptions } from './resources/autoDetectResource';
import type { BufferType, IBufferResourceOptions } from './resources/BufferResource';
/**
 * Value types for the constructor of {@link PIXI.BaseTexture}, including:
 * - `HTMLImageElement`
 * - `HTMLVideoElement`
 * - `ImageBitmap`
 * - {@link PIXI.ICanvas}
 * - `VideoFrame`
 * @memberof PIXI
 */
export type ImageSource = HTMLImageElement | HTMLVideoElement | ImageBitmap | ICanvas | VideoFrame;
export interface IBaseTextureOptions<RO = any> {
    alphaMode?: ALPHA_MODES;
    mipmap?: MIPMAP_MODES;
    anisotropicLevel?: number;
    scaleMode?: SCALE_MODES;
    width?: number;
    height?: number;
    wrapMode?: WRAP_MODES;
    format?: FORMATS;
    type?: TYPES;
    target?: TARGETS;
    resolution?: number;
    multisample?: MSAA_QUALITY;
    resourceOptions?: RO;
    pixiIdPrefix?: string;
}
export interface BaseTexture extends GlobalMixins.BaseTexture, EventEmitter {
}
/**
 * A Texture stores the information that represents an image.
 * All textures have a base texture, which contains information about the source.
 * Therefore you can have many textures all using a single BaseTexture
 * @memberof PIXI
 * @typeParam R - The BaseTexture's Resource type.
 * @typeParam RO - The options for constructing resource.
 */
export declare class BaseTexture<R extends Resource = Resource, RO = IAutoDetectOptions> extends EventEmitter {
    /**
     * The width of the base texture set when the image has loaded
     * @readonly
     */
    width: number;
    /**
     * The height of the base texture set when the image has loaded
     * @readonly
     */
    height: number;
    /**
     * The resolution / device pixel ratio of the texture
     * @readonly
     * @default PIXI.settings.RESOLUTION
     */
    resolution: number;
    /**
     * How to treat premultiplied alpha, see {@link PIXI.ALPHA_MODES}.
     * @member {PIXI.ALPHA_MODES}
     * @default PIXI.ALPHA_MODES.UNPACK
     */
    alphaMode: ALPHA_MODES;
    /**
     * Anisotropic filtering level of texture
     * @member {number}
     * @default 0
     */
    anisotropicLevel: number;
    /**
     * The pixel format of the texture
     * @default PIXI.FORMATS.RGBA
     */
    format: FORMATS;
    /**
     * The type of resource data
     * @default PIXI.TYPES.UNSIGNED_BYTE
     */
    type: TYPES;
    /**
     * The target type
     * @default PIXI.TARGETS.TEXTURE_2D
     */
    target: TARGETS;
    /**
     * Global unique identifier for this BaseTexture
     * @protected
     */
    readonly uid: number;
    /**
     * Used by automatic texture Garbage Collection, stores last GC tick when it was bound
     * @protected
     */
    touched: number;
    /**
     * Whether or not the texture is a power of two, try to use power of two textures as much
     * as you can
     * @readonly
     * @default false
     */
    isPowerOfTwo: boolean;
    /**
     * The map of render context textures where this is bound
     * @private
     */
    _glTextures: {
        [key: number]: GLTexture;
    };
    /**
     * Used by TextureSystem to only update texture to the GPU when needed.
     * Please call `update()` to increment it.
     * @readonly
     */
    dirtyId: number;
    /**
     * Used by TextureSystem to only update texture style when needed.
     * @protected
     */
    dirtyStyleId: number;
    /**
     * Currently default cache ID.
     * @member {string}
     */
    cacheId: string;
    /**
     * Generally speaking means when resource is loaded.
     * @readonly
     * @member {boolean}
     */
    valid: boolean;
    /**
     * The collection of alternative cache ids, since some BaseTextures
     * can have more than one ID, short name and longer full URL
     * @member {Array<string>}
     * @readonly
     */
    textureCacheIds: Array<string>;
    /**
     * Flag if BaseTexture has been destroyed.
     * @member {boolean}
     * @readonly
     */
    destroyed: boolean;
    /**
     * The resource used by this BaseTexture, there can only
     * be one resource per BaseTexture, but textures can share
     * resources.
     * @member {PIXI.Resource}
     * @readonly
     */
    resource: R;
    /**
     * Number of the texture batch, used by multi-texture renderers
     * @member {number}
     */
    _batchEnabled: number;
    /**
     * Location inside texture batch, used by multi-texture renderers
     * @member {number}
     */
    _batchLocation: number;
    /**
     * Whether its a part of another texture, handled by ArrayResource or CubeResource
     * @member {PIXI.BaseTexture}
     */
    parentTextureArray: BaseTexture;
    private _mipmap;
    private _scaleMode;
    private _wrapMode;
    /**
     * Default options used when creating BaseTexture objects.
     * @static
     * @memberof PIXI.BaseTexture
     * @type {PIXI.IBaseTextureOptions}
     */
    static defaultOptions: IBaseTextureOptions;
    /**
     * @param {PIXI.Resource|PIXI.ImageSource|string} [resource=null] -
     *        The current resource to use, for things that aren't Resource objects, will be converted
     *        into a Resource.
     * @param options - Collection of options, default options inherited from {@link PIXI.BaseTexture.defaultOptions}.
     * @param {PIXI.MIPMAP_MODES} [options.mipmap] - If mipmapping is enabled for texture
     * @param {number} [options.anisotropicLevel] - Anisotropic filtering level of texture
     * @param {PIXI.WRAP_MODES} [options.wrapMode] - Wrap mode for textures
     * @param {PIXI.SCALE_MODES} [options.scaleMode] - Default scale mode, linear, nearest
     * @param {PIXI.FORMATS} [options.format] - GL format type
     * @param {PIXI.TYPES} [options.type] - GL data type
     * @param {PIXI.TARGETS} [options.target] - GL texture target
     * @param {PIXI.ALPHA_MODES} [options.alphaMode] - Pre multiply the image alpha
     * @param {number} [options.width=0] - Width of the texture
     * @param {number} [options.height=0] - Height of the texture
     * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - Resolution of the base texture
     * @param {object} [options.resourceOptions] - Optional resource options,
     *        see {@link PIXI.autoDetectResource autoDetectResource}
     */
    constructor(resource?: R | ImageSource | string | any, options?: IBaseTextureOptions<RO>);
    /**
     * Pixel width of the source of this texture
     * @readonly
     */
    get realWidth(): number;
    /**
     * Pixel height of the source of this texture
     * @readonly
     */
    get realHeight(): number;
    /**
     * Mipmap mode of the texture, affects downscaled images
     * @default PIXI.MIPMAP_MODES.POW2
     */
    get mipmap(): MIPMAP_MODES;
    set mipmap(value: MIPMAP_MODES);
    /**
     * The scale mode to apply when scaling this texture
     * @default PIXI.SCALE_MODES.LINEAR
     */
    get scaleMode(): SCALE_MODES;
    set scaleMode(value: SCALE_MODES);
    /**
     * How the texture wraps
     * @default PIXI.WRAP_MODES.CLAMP
     */
    get wrapMode(): WRAP_MODES;
    set wrapMode(value: WRAP_MODES);
    /**
     * Changes style options of BaseTexture
     * @param scaleMode - Pixi scalemode
     * @param mipmap - enable mipmaps
     * @returns - this
     */
    setStyle(scaleMode?: SCALE_MODES, mipmap?: MIPMAP_MODES): this;
    /**
     * Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.
     * @param desiredWidth - Desired visual width
     * @param desiredHeight - Desired visual height
     * @param resolution - Optionally set resolution
     * @returns - this
     */
    setSize(desiredWidth: number, desiredHeight: number, resolution?: number): this;
    /**
     * Sets real size of baseTexture, preserves current resolution.
     * @param realWidth - Full rendered width
     * @param realHeight - Full rendered height
     * @param resolution - Optionally set resolution
     * @returns - this
     */
    setRealSize(realWidth: number, realHeight: number, resolution?: number): this;
    /**
     * Refresh check for isPowerOfTwo texture based on size
     * @private
     */
    protected _refreshPOT(): void;
    /**
     * Changes resolution
     * @param resolution - res
     * @returns - this
     */
    setResolution(resolution: number): this;
    /**
     * Sets the resource if it wasn't set. Throws error if resource already present
     * @param resource - that is managing this BaseTexture
     * @returns - this
     */
    setResource(resource: R): this;
    /** Invalidates the object. Texture becomes valid if width and height are greater than zero. */
    update(): void;
    /**
     * Handle errors with resources.
     * @private
     * @param event - Error event emitted.
     */
    onError(event: ErrorEvent): void;
    /**
     * Destroys this base texture.
     * The method stops if resource doesn't want this texture to be destroyed.
     * Removes texture from all caches.
     * @fires PIXI.BaseTexture#destroyed
     */
    destroy(): void;
    /**
     * Frees the texture from WebGL memory without destroying this texture object.
     * This means you can still use the texture later which will upload it to GPU
     * memory again.
     * @fires PIXI.BaseTexture#dispose
     */
    dispose(): void;
    /** Utility function for BaseTexture|Texture cast. */
    castToBaseTexture(): BaseTexture;
    /**
     * Helper function that creates a base texture based on the source you provide.
     * The source can be - image url, image element, canvas element. If the
     * source is an image url or an image element and not in the base texture
     * cache, it will be created and loaded.
     * @static
     * @param {PIXI.ImageSource|string|string[]} source - The
     *        source to create base texture from.
     * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
     * @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
     * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
     * @returns {PIXI.BaseTexture} The new base texture.
     */
    static from<R extends Resource = Resource, RO = IAutoDetectOptions>(source: ImageSource | string | string[], options?: IBaseTextureOptions<RO>, strict?: boolean): BaseTexture<R>;
    /**
     * Create a new Texture with a BufferResource from a typed array.
     * @param buffer - The optional array to use. If no data is provided, a new Float32Array is created.
     * @param width - Width of the resource
     * @param height - Height of the resource
     * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
     *        Default properties are different from the constructor's defaults.
     * @param {PIXI.FORMATS} [options.format] - The format is not given, the type is inferred from the
     *        type of the buffer: `RGBA` if Float32Array, Int8Array, Uint8Array, or Uint8ClampedArray,
     *        otherwise `RGBA_INTEGER`.
     * @param {PIXI.TYPES} [options.type] - The type is not given, the type is inferred from the
     *        type of the buffer. Maps Float32Array to `FLOAT`, Int32Array to `INT`, Uint32Array to
     *        `UNSIGNED_INT`, Int16Array to `SHORT`, Uint16Array to `UNSIGNED_SHORT`, Int8Array to `BYTE`,
     *        Uint8Array/Uint8ClampedArray to `UNSIGNED_BYTE`.
     * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.NPM]
     * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.SCALE_MODES.NEAREST]
     * @returns - The resulting new BaseTexture
     */
    static fromBuffer(buffer: BufferType, width: number, height: number, options?: IBaseTextureOptions<IBufferResourceOptions>): BaseTexture<BufferResource>;
    /**
     * Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
     * @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
     * @param {string} id - The id that the BaseTexture will be stored against.
     */
    static addToCache(baseTexture: BaseTexture, id: string): void;
    /**
     * Remove a BaseTexture from the global BaseTextureCache.
     * @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
     * @returns {PIXI.BaseTexture|null} The BaseTexture that was removed.
     */
    static removeFromCache(baseTexture: string | BaseTexture): BaseTexture | null;
    /** Global number of the texture batch, used by multi-texture renderers. */
    static _globalBatch: number;
}
