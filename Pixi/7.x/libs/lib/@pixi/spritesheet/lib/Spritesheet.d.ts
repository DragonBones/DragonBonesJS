import { BaseTexture, Texture, utils } from '@pixi/core';
import type { IPointData, ITextureBorders } from '@pixi/core';
/**
 * Represents the JSON data for a spritesheet atlas.
 * @memberof PIXI
 */
export interface ISpritesheetFrameData {
    frame: {
        h: number;
        w: number;
        x: number;
        y: number;
    };
    trimmed?: boolean;
    rotated?: boolean;
    sourceSize?: {
        h: number;
        w: number;
    };
    spriteSourceSize?: {
        h?: number;
        w?: number;
        x: number;
        y: number;
    };
    anchor?: IPointData;
    borders?: ITextureBorders;
}
/**
 * Atlas format.
 * @memberof PIXI
 */
export interface ISpritesheetData {
    animations?: utils.Dict<string[]>;
    frames: utils.Dict<ISpritesheetFrameData>;
    meta: {
        app?: string;
        format?: string;
        frameTags?: {
            from: number;
            name: string;
            to: number;
            direction: string;
        }[];
        image?: string;
        layers?: {
            blendMode: string;
            name: string;
            opacity: number;
        }[];
        scale: string | number;
        size?: {
            h: number;
            w: number;
        };
        slices?: {
            color: string;
            name: string;
            keys: {
                frame: number;
                bounds: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                };
            }[];
        }[];
        related_multi_packs?: string[];
        version?: string;
    };
}
/**
 * Options for loading a spritesheet from an atlas.
 * @memberof PIXI
 */
interface SpritesheetOptions<S extends ISpritesheetData = ISpritesheetData> {
    /** Reference to Texture */
    texture: BaseTexture | Texture;
    /** JSON data for the atlas. */
    data: S;
    /** The filename to consider when determining the resolution of the spritesheet. */
    resolutionFilename?: string;
    /**
     * Prefix to add to texture names when adding to global TextureCache,
     * using this option can be helpful if you have multiple texture atlases
     * that share texture names and you need to disambiguate them.
     */
    cachePrefix?: string;
}
/**
 * Utility class for maintaining reference to a collection
 * of Textures on a single Spritesheet.
 *
 * To access a sprite sheet from your code you may pass its JSON data file to Pixi's loader:
 *
 * ```js
 * import { Assets } from 'pixi.js';
 *
 * const sheet = await Assets.load('images/spritesheet.json');
 * ```
 *
 * Alternately, you may circumvent the loader by instantiating the Spritesheet directly:
 *
 * ```js
 * import { Spritesheet } from 'pixi.js';
 *
 * const sheet = new Spritesheet(texture, spritesheetData);
 * await sheet.parse();
 * console.log('Spritesheet ready to use!');
 * ```
 *
 * With the `sheet.textures` you can create Sprite objects, and `sheet.animations` can be used to create an AnimatedSprite.
 *
 * Here's an example of a sprite sheet JSON data file:
 * ```json
 * {
 *     "frames": {
 *         "enemy1.png":
 *         {
 *             "frame": {"x":103,"y":1,"w":32,"h":32},
 *             "spriteSourceSize": {"x":0,"y":0,"w":32,"h":32},
 *             "sourceSize": {"w":32,"h":32},
 *             "anchor": {"x":16,"y":16}
 *         },
 *         "enemy2.png":
 *         {
 *             "frame": {"x":103,"y":35,"w":32,"h":32},
 *             "spriteSourceSize": {"x":0,"y":0,"w":32,"h":32},
 *             "sourceSize": {"w":32,"h":32},
 *             "anchor": {"x":16,"y":16}
 *         },
 *         "button.png":
 *         {
 *             "frame": {"x":1,"y":1,"w":100,"h":100},
 *             "spriteSourceSize": {"x":0,"y":0,"w":100,"h":100},
 *             "sourceSize": {"w":100,"h":100},
 *             "anchor": {"x":0,"y":0},
 *             "borders": {"left":35,"top":35,"right":35,"bottom":35}
 *         }
 *     },
 *
 *     "animations": {
 *         "enemy": ["enemy1.png","enemy2.png"]
 *     },
 *
 *     "meta": {
 *         "image": "sheet.png",
 *         "format": "RGBA8888",
 *         "size": {"w":136,"h":102},
 *         "scale": "1"
 *     }
 * }
 * ```
 * Sprite sheets can be packed using tools like {@link https://codeandweb.com/texturepacker|TexturePacker},
 * {@link https://renderhjs.net/shoebox/|Shoebox} or {@link https://github.com/krzysztof-o/spritesheet.js|Spritesheet.js}.
 * Default anchor points (see {@link PIXI.Texture#defaultAnchor}), default 9-slice borders
 * (see {@link PIXI.Texture#defaultBorders}) and grouping of animation sprites are currently only
 * supported by TexturePacker.
 *
 * Alternative ways for loading spritesheet image if you need more control:
 *
 * ```js
 * import { Assets } from 'pixi.js';
 *
 * const sheetTexture = await Assets.load('images/spritesheet.png');
 * Assets.add({
 *     alias: 'atlas',
 *     src: 'images/spritesheet.json'
 *     data: {texture: sheetTexture} // using of preloaded texture
 * });
 * const sheet = await Assets.load('atlas')
 * ```
 *
 * or:
 *
 * ```js
 * import { Assets } from 'pixi.js';
 *
 * Assets.add({
 *     alias: 'atlas',
 *     src: 'images/spritesheet.json'
 *     data: {imageFilename: 'my-spritesheet.2x.avif'} // using of custom filename located in "images/my-spritesheet.2x.avif"
 * });
 * const sheet = await Assets.load('atlas')
 * ```
 * @memberof PIXI
 */
export declare class Spritesheet<S extends ISpritesheetData = ISpritesheetData> {
    /** The maximum number of Textures to build per process. */
    static readonly BATCH_SIZE = 1000;
    /** For multi-packed spritesheets, this contains a reference to all the other spritesheets it depends on. */
    linkedSheets: Spritesheet<S>[];
    /** Reference to ths source texture. */
    baseTexture: BaseTexture;
    /**
     * A map containing all textures of the sprite sheet.
     * Can be used to create a {@link PIXI.Sprite|Sprite}:
     * @example
     * import { Sprite } from 'pixi.js';
     *
     * new Sprite(sheet.textures['image.png']);
     */
    textures: Record<keyof S['frames'], Texture>;
    /**
     * A map containing the textures for each animation.
     * Can be used to create an {@link PIXI.AnimatedSprite|AnimatedSprite}:
     * @example
     * import { AnimatedSprite } from 'pixi.js';
     *
     * new AnimatedSprite(sheet.animations['anim_name']);
     */
    animations: Record<keyof NonNullable<S['animations']>, Texture[]>;
    /**
     * Reference to the original JSON data.
     * @type {object}
     */
    data: S;
    /** The resolution of the spritesheet. */
    resolution: number;
    /**
     * Reference to original source image from the Loader. This reference is retained so we
     * can destroy the Texture later on. It is never used internally.
     */
    private _texture;
    /**
     * Map of spritesheet frames.
     * @type {object}
     */
    private _frames;
    /** Collection of frame names. */
    private _frameKeys;
    /** Current batch index being processed. */
    private _batchIndex;
    /**
     * Callback when parse is completed.
     * @type {Function}
     */
    private _callback;
    /** Prefix string to add to global cache */
    readonly cachePrefix: string;
    /**
     * @class
     * @param options - Options to use when constructing a new Spritesheet.
     */
    constructor(options: SpritesheetOptions<S>);
    /**
     * @class
     * @param texture - Reference to the source BaseTexture object.
     * @param {object} data - Spritesheet image data.
     * @param resolutionFilename - The filename to consider when determining
     *        the resolution of the spritesheet. If not provided, the imageUrl will
     *        be used on the BaseTexture.
     */
    constructor(texture: BaseTexture | Texture, data: S, resolutionFilename?: string);
    /**
     * Generate the resolution from the filename or fallback
     * to the meta.scale field of the JSON data.
     * @param resolutionFilename - The filename to use for resolving
     *        the default resolution.
     * @returns Resolution to use for spritesheet.
     */
    private _updateResolution;
    /**
     * Parser spritesheet from loaded data. This is done asynchronously
     * to prevent creating too many Texture within a single process.
     * @method PIXI.Spritesheet#parse
     */
    parse(): Promise<utils.Dict<Texture>>;
    /**
     * Process a batch of frames
     * @param initialFrameIndex - The index of frame to start.
     */
    private _processFrames;
    /** Parse animations config. */
    private _processAnimations;
    /** The parse has completed. */
    private _parseComplete;
    /** Begin the next batch of textures. */
    private _nextBatch;
    /**
     * Destroy Spritesheet and don't use after this.
     * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
     */
    destroy(destroyBase?: boolean): void;
}
export {};
