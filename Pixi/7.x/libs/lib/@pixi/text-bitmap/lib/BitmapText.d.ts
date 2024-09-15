import { Color, ObservablePoint } from '@pixi/core';
import { Container } from '@pixi/display';
import { Mesh } from '@pixi/mesh';
import { BitmapFont } from './BitmapFont';
import type { ColorSource, Rectangle, Renderer } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
import type { TextStyleAlign } from '@pixi/text';
import type { IBitmapTextStyle } from './BitmapTextStyle';
interface PageMeshData {
    index: number;
    indexCount: number;
    vertexCount: number;
    uvsCount: number;
    total: number;
    mesh: Mesh;
    vertices?: Float32Array;
    uvs?: Float32Array;
    indices?: Uint16Array;
}
/**
 * A BitmapText object will create a line or multiple lines of text using bitmap font.
 *
 * The primary advantage of this class over Text is that all of your textures are pre-generated and loading,
 * meaning that rendering is fast, and changing text has no performance implications.
 *
 * Supporting character sets other than latin, such as CJK languages, may be impractical due to the number of characters.
 *
 * To split a line you can use '\n', '\r' or '\r\n' in your string.
 *
 * PixiJS can auto-generate fonts on-the-fly using BitmapFont or use fnt files provided by:
 * http://www.angelcode.com/products/bmfont/ for Windows or
 * http://www.bmglyph.com/ for Mac.
 *
 * You can also use SDF, MSDF and MTSDF BitmapFonts for vector-like scaling appearance provided by:
 * https://github.com/soimy/msdf-bmfont-xml for SDF and MSDF fnt files or
 * https://github.com/Chlumsky/msdf-atlas-gen for SDF, MSDF and MTSDF json files
 *
 * A BitmapText can only be created when the font is loaded.
 * @example
 * import { BitmapText } from 'pixi.js';
 *
 * // in this case the font is in a file called 'desyrel.fnt'
 * const bitmapText = new BitmapText('text using a fancy font!', {
 *     fontName: 'Desyrel',
 *     fontSize: 35,
 *     align: 'right',
 * });
 * @memberof PIXI
 */
export declare class BitmapText extends Container {
    static styleDefaults: Partial<IBitmapTextStyle>;
    /** Set to `true` if the BitmapText needs to be redrawn. */
    dirty: boolean;
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default PIXI.settings.RESOLUTION
     */
    _resolution: number;
    _autoResolution: boolean;
    /**
     * Private tracker for the width of the overall text.
     * @private
     */
    protected _textWidth: number;
    /**
     * Private tracker for the height of the overall text.
     * @private
     */
    protected _textHeight: number;
    /**
     * Private tracker for the current text.
     * @private
     */
    protected _text: string;
    /**
     * The max width of this bitmap text in pixels. If the text provided is longer than the
     * value provided, line breaks will be automatically inserted in the last whitespace.
     * Disable by setting value to 0
     * @private
     */
    protected _maxWidth: number;
    /**
     * The max line height. This is useful when trying to use the total height of the Text,
     * ie: when trying to vertically align. (Internally used)
     * @private
     */
    protected _maxLineHeight: number;
    /**
     * Letter spacing. This is useful for setting the space between characters.
     * @private
     */
    protected _letterSpacing: number;
    /**
     * Text anchor.
     * @readonly
     * @private
     */
    protected _anchor: ObservablePoint;
    /**
     * Private tracker for the current font.
     * @private
     */
    protected _font?: BitmapFont;
    /**
     * Private tracker for the current font name.
     * @private
     */
    protected _fontName: string;
    /**
     * Private tracker for the current font size.
     * @private
     */
    protected _fontSize?: number;
    /**
     * Private tracker for the current text align.
     * @type {string}
     * @private
     */
    protected _align: TextStyleAlign;
    /** Collection of page mesh data. */
    protected _activePagesMeshData: PageMeshData[];
    /**
     * Private tracker for the current tint.
     * @private
     */
    protected _tintColor: Color;
    /**
     * If true PixiJS will Math.floor() x/y values when rendering.
     * @default PIXI.settings.ROUND_PIXELS
     */
    protected _roundPixels: boolean;
    /** Cached char texture is destroyed when BitmapText is destroyed. */
    private _textureCache;
    /**
     * @param text - A string that you would like the text to display.
     * @param style - The style parameters.
     * @param {string} style.fontName - The installed BitmapFont name.
     * @param {number} [style.fontSize] - The size of the font in pixels, e.g. 24. If undefined,
     *.     this will default to the BitmapFont size.
     * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center', 'right' or 'justify'),
     *      does not affect single line text.
     * @param {PIXI.ColorSource} [style.tint=0xFFFFFF] - The tint color.
     * @param {number} [style.letterSpacing=0] - The amount of spacing between letters.
     * @param {number} [style.maxWidth=0] - The max width of the text before line wrapping.
     */
    constructor(text: string, style?: Partial<IBitmapTextStyle>);
    /** Renders text and updates it when needed. This should only be called if the BitmapFont is regenerated. */
    updateText(): void;
    updateTransform(): void;
    _render(renderer: Renderer): void;
    /**
     * Validates text before calling parent's getLocalBounds
     * @returns - The rectangular bounding area
     */
    getLocalBounds(): Rectangle;
    /**
     * Updates text when needed
     * @private
     */
    protected validate(): void;
    /**
     * The tint of the BitmapText object.
     * @default 0xffffff
     */
    get tint(): ColorSource;
    set tint(value: ColorSource);
    /**
     * The alignment of the BitmapText object.
     * @member {string}
     * @default 'left'
     */
    get align(): TextStyleAlign;
    set align(value: TextStyleAlign);
    /** The name of the BitmapFont. */
    get fontName(): string;
    set fontName(value: string);
    /** The size of the font to display. */
    get fontSize(): number;
    set fontSize(value: number | undefined);
    /**
     * The anchor sets the origin point of the text.
     *
     * The default is `(0,0)`, this means the text's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
     */
    get anchor(): ObservablePoint;
    set anchor(value: ObservablePoint);
    /** The text of the BitmapText object. */
    get text(): string;
    set text(text: string);
    /**
     * The max width of this bitmap text in pixels. If the text provided is longer than the
     * value provided, line breaks will be automatically inserted in the last whitespace.
     * Disable by setting the value to 0.
     */
    get maxWidth(): number;
    set maxWidth(value: number);
    /**
     * The max line height. This is useful when trying to use the total height of the Text,
     * i.e. when trying to vertically align.
     * @readonly
     */
    get maxLineHeight(): number;
    /**
     * The width of the overall text, different from fontSize,
     * which is defined in the style object.
     * @readonly
     */
    get textWidth(): number;
    /** Additional space between characters. */
    get letterSpacing(): number;
    set letterSpacing(value: number);
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
     * @default PIXI.settings.ROUND_PIXELS
     */
    get roundPixels(): boolean;
    set roundPixels(value: boolean);
    /**
     * The height of the overall text, different from fontSize,
     * which is defined in the style object.
     * @readonly
     */
    get textHeight(): number;
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default 1
     */
    get resolution(): number;
    set resolution(value: number);
    destroy(options?: boolean | IDestroyOptions): void;
}
export {};
