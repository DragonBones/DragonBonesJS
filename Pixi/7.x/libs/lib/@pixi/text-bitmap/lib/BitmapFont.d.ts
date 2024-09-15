import { ALPHA_MODES, MIPMAP_MODES, Texture, utils } from '@pixi/core';
import { TextStyle } from '@pixi/text';
import { BitmapFontData } from './BitmapFontData';
import type { IBaseTextureOptions, SCALE_MODES } from '@pixi/core';
import type { ITextStyle } from '@pixi/text';
export interface IBitmapFontCharacter {
    xOffset: number;
    yOffset: number;
    xAdvance: number;
    texture: Texture;
    page: number;
    kerning: utils.Dict<number>;
}
type BaseOptions = Pick<IBaseTextureOptions, 'scaleMode' | 'mipmap' | 'anisotropicLevel' | 'alphaMode'>;
/** @memberof PIXI */
export interface IBitmapFontOptions extends BaseOptions {
    /**
     * Characters included in the font set. You can also use ranges.
     * For example, `[['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[] "]`.
     * Don't forget to include spaces ' ' in your character set!
     * @default PIXI.BitmapFont.ALPHANUMERIC
     */
    chars?: string | (string | string[])[];
    /**
     * Render resolution for glyphs.
     * @default 1
     */
    resolution?: number;
    /**
     * Padding between glyphs on texture atlas. Lower values could mean more visual artifacts
     * and bleeding from other glyphs, larger values increase the space required on the texture.
     * @default 4
     */
    padding?: number;
    /**
     * Optional width of atlas, smaller values to reduce memory.
     * @default 512
     */
    textureWidth?: number;
    /**
     * Optional height of atlas, smaller values to reduce memory.
     * @default 512
     */
    textureHeight?: number;
    /**
     * If mipmapping is enabled for texture. For instance, by default PixiJS only enables mipmapping
     * on Power-of-Two textures. If your textureWidth or textureHeight are not power-of-two, you
     * may consider enabling mipmapping to get better quality with lower font sizes. Note:
     * for MSDF/SDF fonts, mipmapping is not supported.
     * @default PIXI.BaseTexture.defaultOptions.mipmap
     */
    mipmap?: MIPMAP_MODES;
    /**
     * Anisotropic filtering level of texture.
     * @default PIXI.BaseTexture.defaultOptions.anisotropicLevel
     */
    anisotropicLevel?: number;
    /**
     * Default scale mode, linear, nearest. Nearest can be helpful for bitmap-style fonts.
     * @default PIXI.BaseTexture.defaultOptions.scaleMode
     */
    scaleMode?: SCALE_MODES;
    /**
     * Pre multiply the image alpha.  Note: for MSDF/SDF fonts, alphaMode is not supported.
     * @default PIXI.BaseTexture.defaultOptions.alphaMode
     */
    alphaMode?: ALPHA_MODES;
    /**
     * Skip generation of kerning information for the BitmapFont.
     * If true, this could potentially increase the performance, but may impact the rendered text appearance.
     * @default false
     */
    skipKerning?: boolean;
}
/**
 * BitmapFont represents a typeface available for use with the BitmapText class. Use the `install`
 * method for adding a font to be used.
 * @memberof PIXI
 */
export declare class BitmapFont {
    /**
     * This character set includes all the letters in the alphabet (both lower- and upper- case).
     * @type {string[][]}
     * @example
     * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.ALPHA })
     */
    static readonly ALPHA: (string | string[])[];
    /**
     * This character set includes all decimal digits (from 0 to 9).
     * @type {string[][]}
     * @example
     * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
     */
    static readonly NUMERIC: string[][];
    /**
     * This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
     * @type {string[][]}
     */
    static readonly ALPHANUMERIC: (string | string[])[];
    /**
     * This character set consists of all the ASCII table.
     * @member {string[][]}
     * @see http://www.asciitable.com/
     */
    static readonly ASCII: string[][];
    /**
     * Collection of default options when using `BitmapFont.from`.
     * @property {number} [resolution=1] -
     * @property {number} [textureWidth=512] -
     * @property {number} [textureHeight=512] -
     * @property {number} [padding=4] -
     * @property {string|string[]|string[][]} chars = PIXI.BitmapFont.ALPHANUMERIC
     */
    static readonly defaultOptions: IBitmapFontOptions;
    /** Collection of available/installed fonts. */
    static readonly available: utils.Dict<BitmapFont>;
    /** The name of the font face. */
    readonly font: string;
    /** The size of the font face in pixels. */
    readonly size: number;
    /** The line-height of the font face in pixels. */
    readonly lineHeight: number;
    /** The map of characters by character code. */
    readonly chars: utils.Dict<IBitmapFontCharacter>;
    /** The map of base page textures (i.e., sheets of glyphs). */
    readonly pageTextures: utils.Dict<Texture>;
    /** The range of the distance field in pixels. */
    readonly distanceFieldRange: number;
    /** The kind of distance field for this font or "none". */
    readonly distanceFieldType: string;
    private _ownsTextures;
    /**
     * @param data
     * @param textures
     * @param ownsTextures - Setting to `true` will destroy page textures
     *        when the font is uninstalled.
     */
    constructor(data: BitmapFontData, textures: Texture[] | utils.Dict<Texture>, ownsTextures?: boolean);
    /** Remove references to created glyph textures. */
    destroy(): void;
    /**
     * Register a new bitmap font.
     * @param data - The
     *        characters map that could be provided as xml or raw string.
     * @param textures - List of textures for each page.
     * @param ownsTextures - Set to `true` to destroy page textures
     *        when the font is uninstalled. By default fonts created with
     *        `BitmapFont.from` or from the `BitmapFontLoader` are `true`.
     * @returns {PIXI.BitmapFont} Result font object with font, size, lineHeight
     *         and char fields.
     */
    static install(data: string | XMLDocument | BitmapFontData, textures: Texture | Texture[] | utils.Dict<Texture>, ownsTextures?: boolean): BitmapFont;
    /**
     * Remove bitmap font by name.
     * @param name - Name of the font to uninstall.
     */
    static uninstall(name: string): void;
    /**
     * Generates a bitmap-font for the given style and character set. This does not support
     * kernings yet. With `style` properties, only the following non-layout properties are used:
     *
     * - {@link PIXI.TextStyle#dropShadow|dropShadow}
     * - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
     * - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
     * - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
     * - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
     * - {@link PIXI.TextStyle#fill|fill}
     * - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
     * - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
     * - {@link PIXI.TextStyle#fontFamily|fontFamily}
     * - {@link PIXI.TextStyle#fontSize|fontSize}
     * - {@link PIXI.TextStyle#fontVariant|fontVariant}
     * - {@link PIXI.TextStyle#fontWeight|fontWeight}
     * - {@link PIXI.TextStyle#lineJoin|lineJoin}
     * - {@link PIXI.TextStyle#miterLimit|miterLimit}
     * - {@link PIXI.TextStyle#stroke|stroke}
     * - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
     * - {@link PIXI.TextStyle#textBaseline|textBaseline}
     * @param name - The name of the custom font to use with BitmapText.
     * @param textStyle - Style options to render with BitmapFont.
     * @param options - Setup options for font or name of the font.
     * @returns Font generated by style options.
     * @example
     * import { BitmapFont, BitmapText } from 'pixi.js';
     *
     * BitmapFont.from('TitleFont', {
     *     fontFamily: 'Arial',
     *     fontSize: 12,
     *     strokeThickness: 2,
     *     fill: 'purple',
     * });
     *
     * const title = new BitmapText('This is the title', { fontName: 'TitleFont' });
     */
    static from(name: string, textStyle?: TextStyle | Partial<ITextStyle>, options?: IBitmapFontOptions): BitmapFont;
}
export {};
