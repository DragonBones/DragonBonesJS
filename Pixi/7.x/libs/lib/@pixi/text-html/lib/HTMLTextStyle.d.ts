import { TextStyle } from '@pixi/text';
import type { ITextStyle, TextStyleFontStyle, TextStyleFontWeight, TextStyleLineJoin, TextStyleTextBaseline } from '@pixi/text';
/**
 * HTMLText support more white-space options.
 * @memberof PIXI
 * @since 7.2.0
 * @see PIXI.IHTMLTextStyle
 */
export type HTMLTextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line' | 'nowrap' | 'pre-wrap';
/**
 * FontFace display options.
 * @memberof PIXI
 * @since 7.3.0
 */
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
type ITextStyleIgnore = 'whiteSpace' | 'fillGradientStops' | 'fillGradientType' | 'miterLimit' | 'textBaseline' | 'trim' | 'leading' | 'lineJoin';
/**
 * Modifed versions from ITextStyle.
 * @memberof PIXI
 * @extends PIXI.ITextStyle
 * @since 7.2.0
 */
export interface IHTMLTextStyle extends Omit<ITextStyle, ITextStyleIgnore> {
    /** White-space with expanded options. */
    whiteSpace: HTMLTextStyleWhiteSpace;
}
export interface IHTMLTextFontOptions extends Pick<IHTMLFont, 'weight' | 'style' | 'family'> {
    /** font-display property */
    display: FontDisplay;
}
/**
 * Font information for HTMLText
 * @memberof PIXI
 * @since 7.2.0
 */
export interface IHTMLFont {
    /** User-supplied URL request */
    originalUrl: string;
    /** Base64 string for font */
    dataSrc: string;
    /** FontFace installed in the document */
    fontFace: FontFace | null;
    /** Blob-based URL for font */
    src: string;
    /** Family name of font */
    family: string;
    /** Weight of the font */
    weight: TextStyleFontWeight;
    /** Style of the font */
    style: TextStyleFontStyle;
    /** Display property of the font */
    display: FontDisplay;
    /** Reference counter */
    refs: number;
}
/**
 * Used internally to restrict text style usage and convert easily to CSS.
 * @class
 * @memberof PIXI
 * @param {PIXI.ITextStyle|PIXI.IHTMLTextStyle} [style] - Style to copy.
 * @since 7.2.0
 */
export declare class HTMLTextStyle extends TextStyle {
    /** The collection of installed fonts */
    static availableFonts: Record<string, IHTMLFont>;
    /**
     * List of default options, these are largely the same as TextStyle,
     * with the exception of whiteSpace, which is set to 'normal' by default.
     */
    static readonly defaultOptions: IHTMLTextStyle;
    /** For using custom fonts */
    private _fonts;
    /** List of internal style rules */
    private _overrides;
    /** Global rules or stylesheet, useful for creating rules for rendering */
    private _stylesheet;
    /** Track font changes internally */
    private fontsDirty;
    /**
     * Convert a TextStyle to HTMLTextStyle
     * @param originalStyle
     * @example
     * import {TextStyle } from 'pixi.js';
     * import {HTMLTextStyle} from '@pixi/text-html';
     * const style = new TextStyle();
     * const htmlStyle = HTMLTextStyle.from(style);
     */
    static from(originalStyle: TextStyle | Partial<IHTMLTextStyle>): HTMLTextStyle;
    /** Clear the current font */
    cleanFonts(): void;
    /**
     * Because of how HTMLText renders, fonts need to be imported
     * @param url
     * @param options
     */
    loadFont(url: string, options?: Partial<IHTMLTextFontOptions>): Promise<void>;
    /**
     * Add a style override, this can be any CSS property
     * it will override any built-in style. This is the
     * property and the value as a string (e.g., `color: red`).
     * This will override any other internal style.
     * @param {string} value - CSS style(s) to add.
     * @example
     * style.addOverride('background-color: red');
     */
    addOverride(...value: string[]): void;
    /**
     * Remove any overrides that match the value.
     * @param {string} value - CSS style to remove.
     * @example
     * style.removeOverride('background-color: red');
     */
    removeOverride(...value: string[]): void;
    /**
     * Internally converts all of the style properties into CSS equivalents.
     * @param scale
     * @returns The CSS style string, for setting `style` property of root HTMLElement.
     */
    toCSS(scale: number): string;
    /** Get the font CSS styles from the loaded font, If available. */
    toGlobalCSS(): string;
    /** Internal stylesheet contents, useful for creating rules for rendering */
    get stylesheet(): string;
    set stylesheet(value: string);
    /**
     * Convert numerical colors into hex-strings
     * @param color
     */
    private normalizeColor;
    /** Convert the internal drop-shadow settings to CSS text-shadow */
    private dropShadowToCSS;
    /** Resets all properties to the defaults specified in TextStyle.prototype._default */
    reset(): void;
    /**
     * Called after the image is loaded but before drawing to the canvas.
     * Mostly used to handle Safari's font loading bug.
     * @ignore
     */
    onBeforeDraw(): Promise<void>;
    /**
     * Proving that Safari is the new IE
     * @ignore
     */
    private get isSafari();
    set fillGradientStops(_value: number[]);
    get fillGradientStops(): number[];
    set fillGradientType(_value: number);
    get fillGradientType(): number;
    set miterLimit(_value: number);
    get miterLimit(): number;
    set trim(_value: boolean);
    get trim(): boolean;
    set textBaseline(_value: TextStyleTextBaseline);
    get textBaseline(): TextStyleTextBaseline;
    set leading(_value: number);
    get leading(): number;
    set lineJoin(_value: TextStyleLineJoin);
    get lineJoin(): TextStyleLineJoin;
}
export {};
