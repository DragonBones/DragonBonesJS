import type { ICanvas, ICanvasRenderingContext2D } from '@pixi/core';
import type { TextStyle } from './TextStyle';
/**
 * Internal return object for {@link PIXI.TextMetrics.measureFont `TextMetrics.measureFont`}.
 * @typedef {object} FontMetrics
 * @property {number} ascent - The ascent distance
 * @property {number} descent - The descent distance
 * @property {number} fontSize - Font size from ascent to descent
 * @memberof PIXI.TextMetrics
 * @private
 */
/**
 * A number, or a string containing a number.
 * @memberof PIXI
 * @typedef {object} IFontMetrics
 * @property {number} ascent - Font ascent
 * @property {number} descent - Font descent
 * @property {number} fontSize - Font size
 */
interface IFontMetrics {
    ascent: number;
    descent: number;
    fontSize: number;
}
/**
 * The TextMetrics object represents the measurement of a block of text with a specified style.
 * @example
 * import { TextMetrics, TextStyle } from 'pixi.js';
 *
 * const style = new TextStyle({
 *     fontFamily: 'Arial',
 *     fontSize: 24,
 *     fill: 0xff1010,
 *     align: 'center',
 * });
 * const textMetrics = TextMetrics.measureText('Your text', style);
 * @memberof PIXI
 */
export declare class TextMetrics {
    /** The text that was measured. */
    text: string;
    /** The style that was measured. */
    style: TextStyle;
    /** The measured width of the text. */
    width: number;
    /** The measured height of the text. */
    height: number;
    /** An array of lines of the text broken by new lines and wrapping is specified in style. */
    lines: string[];
    /** An array of the line widths for each line matched to `lines`. */
    lineWidths: number[];
    /** The measured line height for this style. */
    lineHeight: number;
    /** The maximum line width for all measured lines. */
    maxLineWidth: number;
    /** The font properties object from TextMetrics.measureFont. */
    fontProperties: IFontMetrics;
    /**
     * String used for calculate font metrics.
     * These characters are all tall to help calculate the height required for text.
     */
    static METRICS_STRING: string;
    /** Baseline symbol for calculate font metrics. */
    static BASELINE_SYMBOL: string;
    /** Baseline multiplier for calculate font metrics. */
    static BASELINE_MULTIPLIER: number;
    /** Height multiplier for setting height of canvas to calculate font metrics. */
    static HEIGHT_MULTIPLIER: number;
    /**
     * A Unicode "character", or "grapheme cluster", can be composed of multiple Unicode code points,
     * such as letters with diacritical marks (e.g. `'\u0065\u0301'`, letter e with acute)
     * or emojis with modifiers (e.g. `'\uD83E\uDDD1\u200D\uD83D\uDCBB'`, technologist).
     * The new `Intl.Segmenter` API in ES2022 can split the string into grapheme clusters correctly. If it is not available,
     * PixiJS will fallback to use the iterator of String, which can only spilt the string into code points.
     * If you want to get full functionality in environments that don't support `Intl.Segmenter` (such as Firefox),
     * you can use other libraries such as [grapheme-splitter]{@link https://www.npmjs.com/package/grapheme-splitter}
     * or [graphemer]{@link https://www.npmjs.com/package/graphemer} to create a polyfill. Since these libraries can be
     * relatively large in size to handle various Unicode grapheme clusters properly, PixiJS won't use them directly.
     */
    static graphemeSegmenter: (s: string) => string[];
    static _experimentalLetterSpacingSupported?: boolean;
    /**
     * Checking that we can use modern canvas 2D API.
     *
     * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
     * @see PIXI.TextMetrics.experimentalLetterSpacing
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
     * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
     */
    static get experimentalLetterSpacingSupported(): boolean;
    /**
     * New rendering behavior for letter-spacing which uses Chrome's new native API. This will
     * lead to more accurate letter-spacing results because it does not try to manually draw
     * each character. However, this Chrome API is experimental and may not serve all cases yet.
     * @see PIXI.TextMetrics.experimentalLetterSpacingSupported
     */
    static experimentalLetterSpacing: boolean;
    /** Cache of {@see PIXI.TextMetrics.FontMetrics} objects. */
    private static _fonts;
    /** Cache of new line chars. */
    private static _newlines;
    /** Cache of breaking spaces. */
    private static _breakingSpaces;
    private static __canvas;
    private static __context;
    /**
     * @param text - the text that was measured
     * @param style - the style that was measured
     * @param width - the measured width of the text
     * @param height - the measured height of the text
     * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
     * @param lineWidths - an array of the line widths for each line matched to `lines`
     * @param lineHeight - the measured line height for this style
     * @param maxLineWidth - the maximum line width for all measured lines
     * @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
     */
    constructor(text: string, style: TextStyle, width: number, height: number, lines: string[], lineWidths: number[], lineHeight: number, maxLineWidth: number, fontProperties: IFontMetrics);
    /**
     * Measures the supplied string of text and returns a Rectangle.
     * @param text - The text to measure.
     * @param style - The text style to use for measuring
     * @param wordWrap - Override for if word-wrap should be applied to the text.
     * @param canvas - optional specification of the canvas to use for measuring.
     * @returns Measured width and height of the text.
     */
    static measureText(text: string, style: TextStyle, wordWrap?: boolean, canvas?: ICanvas): TextMetrics;
    private static _measureText;
    /**
     * Applies newlines to a string to have it optimally fit into the horizontal
     * bounds set by the Text object's wordWrapWidth property.
     * @param text - String to apply word wrapping to
     * @param style - the style to use when wrapping
     * @param canvas - optional specification of the canvas to use for measuring.
     * @returns New string with new lines applied where required
     */
    private static wordWrap;
    /**
     * Convienience function for logging each line added during the wordWrap method.
     * @param line    - The line of text to add
     * @param newLine - Add new line character to end
     * @returns A formatted line
     */
    private static addLine;
    /**
     * Gets & sets the widths of calculated characters in a cache object
     * @param key            - The key
     * @param letterSpacing  - The letter spacing
     * @param cache          - The cache
     * @param context        - The canvas context
     * @returns The from cache.
     */
    private static getFromCache;
    /**
     * Determines whether we should collapse breaking spaces.
     * @param whiteSpace - The TextStyle property whiteSpace
     * @returns Should collapse
     */
    private static collapseSpaces;
    /**
     * Determines whether we should collapse newLine chars.
     * @param whiteSpace - The white space
     * @returns should collapse
     */
    private static collapseNewlines;
    /**
     * Trims breaking whitespaces from string.
     * @param text - The text
     * @returns Trimmed string
     */
    private static trimRight;
    /**
     * Determines if char is a newline.
     * @param char - The character
     * @returns True if newline, False otherwise.
     */
    private static isNewline;
    /**
     * Determines if char is a breaking whitespace.
     *
     * It allows one to determine whether char should be a breaking whitespace
     * For example certain characters in CJK langs or numbers.
     * It must return a boolean.
     * @param char - The character
     * @param [_nextChar] - The next character
     * @returns True if whitespace, False otherwise.
     */
    static isBreakingSpace(char: string, _nextChar?: string): boolean;
    /**
     * Splits a string into words, breaking-spaces and newLine characters
     * @param text - The text
     * @returns A tokenized array
     */
    private static tokenize;
    /**
     * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
     *
     * It allows one to customise which words should break
     * Examples are if the token is CJK or numbers.
     * It must return a boolean.
     * @param _token - The token
     * @param breakWords - The style attr break words
     * @returns Whether to break word or not
     */
    static canBreakWords(_token: string, breakWords: boolean): boolean;
    /**
     * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
     *
     * It allows one to determine whether a pair of characters
     * should be broken by newlines
     * For example certain characters in CJK langs or numbers.
     * It must return a boolean.
     * @param _char - The character
     * @param _nextChar - The next character
     * @param _token - The token/word the characters are from
     * @param _index - The index in the token of the char
     * @param _breakWords - The style attr break words
     * @returns whether to break word or not
     */
    static canBreakChars(_char: string, _nextChar: string, _token: string, _index: number, _breakWords: boolean): boolean;
    /**
     * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
     *
     * It is called when a token (usually a word) has to be split into separate pieces
     * in order to determine the point to break a word.
     * It must return an array of characters.
     * @param token - The token to split
     * @returns The characters of the token
     * @see TextMetrics.graphemeSegmenter
     */
    static wordWrapSplit(token: string): string[];
    /**
     * Calculates the ascent, descent and fontSize of a given font-style
     * @param font - String representing the style of the font
     * @returns Font properties object
     */
    static measureFont(font: string): IFontMetrics;
    /**
     * Clear font metrics in metrics cache.
     * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
     */
    static clearMetrics(font?: string): void;
    /**
     * Cached canvas element for measuring text
     * TODO: this should be private, but isn't because of backward compat, will fix later.
     * @ignore
     */
    static get _canvas(): ICanvas;
    /**
     * TODO: this should be private, but isn't because of backward compat, will fix later.
     * @ignore
     */
    static get _context(): ICanvasRenderingContext2D;
}
export {};
