import { Point, Rectangle } from '@pixi/math';
import { EventEmitter } from '@pixi/utils';
import { BaseTexture } from './BaseTexture';
import { TextureUvs } from './TextureUvs';
import type { IPointData } from '@pixi/math';
import type { IBaseTextureOptions, ImageSource } from './BaseTexture';
import type { BufferResource, BufferType, IBufferResourceOptions } from './resources/BufferResource';
import type { CanvasResource } from './resources/CanvasResource';
import type { Resource } from './resources/Resource';
import type { TextureMatrix } from './TextureMatrix';
export type TextureSource = string | BaseTexture | ImageSource;
/**
 * Stores the width of the non-scalable borders, for example when used with {@link PIXI.NineSlicePlane} texture.
 * @memberof PIXI
 * @since 7.2.0
 */
export interface ITextureBorders {
    /** left border in pixels */
    left: number;
    /** top border in pixels */
    top: number;
    /** right border in pixels */
    right: number;
    /** bottom border in pixels */
    bottom: number;
}
export interface Texture extends GlobalMixins.Texture, EventEmitter {
}
/**
 * A texture stores the information that represents an image or part of an image.
 *
 * It cannot be added to the display list directly; instead use it as the texture for a Sprite.
 * If no frame is provided for a texture, then the whole image is used.
 *
 * You can directly create a texture from an image and then reuse it multiple times like this :
 *
 * ```js
 * import { Sprite, Texture } from 'pixi.js';
 *
 * const texture = Texture.from('assets/image.png');
 * const sprite1 = new Sprite(texture);
 * const sprite2 = new Sprite(texture);
 * ```
 *
 * If you didnt pass the texture frame to constructor, it enables `noFrame` mode:
 * it subscribes on baseTexture events, it automatically resizes at the same time as baseTexture.
 *
 * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
 * You can check for this by checking the sprite's _textureID property.
 *
 * ```js
 * import { Sprite, Texture } from 'pixi.js';
 *
 * const texture = Texture.from('assets/image.svg');
 * const sprite1 = new Sprite(texture);
 * // sprite1._textureID should not be undefined if the texture has finished processing the SVG file
 * ```
 *
 * You can use a ticker or rAF to ensure your sprites load the finished textures after processing.
 * See issue [#3085]{@link https://github.com/pixijs/pixijs/issues/3085}.
 * @memberof PIXI
 * @typeParam R - The BaseTexture's Resource type.
 */
export declare class Texture<R extends Resource = Resource> extends EventEmitter {
    /** The base texture that this texture uses. */
    baseTexture: BaseTexture<R>;
    /** This is the area of original texture, before it was put in atlas. */
    orig: Rectangle;
    /**
     * This is the trimmed area of original texture, before it was put in atlas
     * Please call `updateUvs()` after you change coordinates of `trim` manually.
     */
    trim: Rectangle;
    /** This will let the renderer know if the texture is valid. If it's not then it cannot be rendered. */
    valid: boolean;
    /**
     * Has the texture been destroyed?
     * @readonly
     */
    destroyed: boolean;
    /**
     * Does this Texture have any frame data assigned to it?
     *
     * This mode is enabled automatically if no frame was passed inside constructor.
     *
     * In this mode texture is subscribed to baseTexture events, and fires `update` on any change.
     *
     * Beware, after loading or resize of baseTexture event can fired two times!
     * If you want more control, subscribe on baseTexture itself.
     *
     * Any assignment of `frame` switches off `noFrame` mode.
     * @example
     * texture.on('update', () => {});
     */
    noFrame: boolean;
    /**
     * Anchor point that is used as default if sprite is created with this texture.
     * Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.
     * @default {0,0}
     */
    defaultAnchor: Point;
    /**
     * Default width of the non-scalable border that is used if 9-slice plane is created with this texture.
     * @since 7.2.0
     * @see PIXI.NineSlicePlane
     */
    defaultBorders?: ITextureBorders;
    /** Default TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
    uvMatrix: TextureMatrix;
    protected _rotate: number;
    /**
     * Update ID is observed by sprites and TextureMatrix instances.
     * Call updateUvs() to increment it.
     * @protected
     */
    _updateID: number;
    /**
     * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
     * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
     */
    _frame: Rectangle;
    /**
     * The WebGL UV data cache. Can be used as quad UV.
     * @protected
     */
    _uvs: TextureUvs;
    /**
     * The ids under which this Texture has been added to the texture cache. This is
     * automatically set as long as Texture.addToCache is used, but may not be set if a
     * Texture is added directly to the TextureCache array.
     */
    textureCacheIds: Array<string>;
    /**
     * @param baseTexture - The base texture source to create the texture from
     * @param frame - The rectangle frame of the texture to show
     * @param orig - The area of original texture
     * @param trim - Trimmed rectangle of original texture
     * @param rotate - indicates how the texture was rotated by texture packer. See {@link PIXI.groupD8}
     * @param anchor - Default anchor point used for sprite placement / rotation
     * @param borders - Default borders used for 9-slice scaling. See {@link PIXI.NineSlicePlane}
     */
    constructor(baseTexture: BaseTexture<R>, frame?: Rectangle, orig?: Rectangle, trim?: Rectangle, rotate?: number, anchor?: IPointData, borders?: ITextureBorders);
    /**
     * Updates this texture on the gpu.
     *
     * Calls the TextureResource update.
     *
     * If you adjusted `frame` manually, please call `updateUvs()` instead.
     */
    update(): void;
    /**
     * Called when the base texture is updated
     * @protected
     * @param baseTexture - The base texture.
     */
    onBaseTextureUpdated(baseTexture: BaseTexture): void;
    /**
     * Destroys this texture
     * @param [destroyBase=false] - Whether to destroy the base texture as well
     * @fires PIXI.Texture#destroyed
     */
    destroy(destroyBase?: boolean): void;
    /**
     * Creates a new texture object that acts the same as this one.
     * @returns - The new texture
     */
    clone(): Texture;
    /**
     * Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
     * Call it after changing the frame
     */
    updateUvs(): void;
    /**
     * Helper function that creates a new Texture based on the source you provide.
     * The source can be - frame id, image url, video url, canvas element, video element, base texture
     * @param {string|PIXI.BaseTexture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source -
     *        Source or array of sources to create texture from
     * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
     * @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
     * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
     * @returns {PIXI.Texture} The newly created texture
     */
    static from<R extends Resource = Resource, RO = any>(source: TextureSource | TextureSource[], options?: IBaseTextureOptions<RO>, strict?: boolean): Texture<R>;
    /**
     * Useful for loading textures via URLs. Use instead of `Texture.from` because
     * it does a better job of handling failed URLs more effectively. This also ignores
     * `PIXI.settings.STRICT_TEXTURE_CACHE`. Works for Videos, SVGs, Images.
     * @param url - The remote URL or array of URLs to load.
     * @param options - Optional options to include
     * @returns - A Promise that resolves to a Texture.
     */
    static fromURL<R extends Resource = Resource, RO = any>(url: string | string[], options?: IBaseTextureOptions<RO>): Promise<Texture<R>>;
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
    static fromBuffer(buffer: BufferType, width: number, height: number, options?: IBaseTextureOptions<IBufferResourceOptions>): Texture<BufferResource>;
    /**
     * Create a texture from a source and add to the cache.
     * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas|string} source - The input source.
     * @param imageUrl - File name of texture, for cache and resolving resolution.
     * @param name - Human readable name for the texture cache. If no name is
     *        specified, only `imageUrl` will be used as the cache ID.
     * @param options
     * @returns - Output texture
     */
    static fromLoader<R extends Resource = Resource>(source: ImageSource | string, imageUrl: string, name?: string, options?: IBaseTextureOptions): Promise<Texture<R>>;
    /**
     * Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
     * @param texture - The Texture to add to the cache.
     * @param id - The id that the Texture will be stored against.
     */
    static addToCache(texture: Texture, id: string): void;
    /**
     * Remove a Texture from the global TextureCache.
     * @param texture - id of a Texture to be removed, or a Texture instance itself
     * @returns - The Texture that was removed
     */
    static removeFromCache(texture: string | Texture): Texture | null;
    /**
     * Returns resolution of baseTexture
     * @readonly
     */
    get resolution(): number;
    /**
     * The frame specifies the region of the base texture that this texture uses.
     * Please call `updateUvs()` after you change coordinates of `frame` manually.
     */
    get frame(): Rectangle;
    set frame(frame: Rectangle);
    /**
     * Indicates whether the texture is rotated inside the atlas
     * set to 2 to compensate for texture packer rotation
     * set to 6 to compensate for spine packer rotation
     * can be used to rotate or mirror sprites
     * See {@link PIXI.groupD8} for explanation
     */
    get rotate(): number;
    set rotate(rotate: number);
    /** The width of the Texture in pixels. */
    get width(): number;
    /** The height of the Texture in pixels. */
    get height(): number;
    /** Utility function for BaseTexture|Texture cast. */
    castToBaseTexture(): BaseTexture;
    private static _EMPTY;
    private static _WHITE;
    /** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
    static get EMPTY(): Texture<Resource>;
    /** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
    static get WHITE(): Texture<CanvasResource>;
}
