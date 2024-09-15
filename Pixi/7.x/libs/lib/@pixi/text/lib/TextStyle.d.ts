import { TEXT_GRADIENT } from './const';
export type TextStyleAlign = 'left' | 'center' | 'right' | 'justify';
export type TextStyleFill = string | string[] | number | number[] | CanvasGradient | CanvasPattern;
export type TextStyleFontStyle = 'normal' | 'italic' | 'oblique';
export type TextStyleFontVariant = 'normal' | 'small-caps';
export type TextStyleFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TextStyleLineJoin = 'miter' | 'round' | 'bevel';
export type TextStyleTextBaseline = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom';
export type TextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line';
/**
 * Generic interface for TextStyle options.
 * @memberof PIXI
 */
export interface ITextStyle {
    /**
     * Alignment for multiline text, does not affect single line text
     * @type {'left'|'center'|'right'|'justify'}
     */
    align: TextStyleAlign;
    /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true */
    breakWords: boolean;
    /** Set a drop shadow for the text */
    dropShadow: boolean;
    /** Set alpha for the drop shadow */
    dropShadowAlpha: number;
    /** Set a angle of the drop shadow */
    dropShadowAngle: number;
    /** Set a shadow blur radius */
    dropShadowBlur: number;
    /** A fill style to be used on the dropshadow e.g., 'red', '#00FF00' */
    dropShadowColor: string | number;
    /** Set a distance of the drop shadow */
    dropShadowDistance: number;
    /**
     * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
     * Can be an array to create a gradient, e.g., `['#000000','#FFFFFF']`
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
     */
    fill: TextStyleFill;
    /**
     * If fill is an array of colours to create a gradient, this can change the
     * type/direction of the gradient. See {@link PIXI.TEXT_GRADIENT}
     * @type {PIXI.TEXT_GRADIENT}
     */
    fillGradientType: TEXT_GRADIENT;
    /**
     * If fill is an array of colours to create a gradient, this array can set
     * the stop points (numbers between 0 and 1) for the color, overriding the
     * default behaviour of evenly spacing them.
     */
    fillGradientStops: number[];
    /**
     * The font family, can be a single font name, or a list of names where the first
     * is the preferred font.
     */
    fontFamily: string | string[];
    /**
     * The font size (as a number it converts to px, but as a string,
     * equivalents are '26px','20pt','160%' or '1.6em')
     */
    fontSize: number | string;
    /**
     * The font style.
     * @type {'normal'|'italic'|'oblique'}
     */
    fontStyle: TextStyleFontStyle;
    /**
     * The font variant.
     * @type {'normal'|'small-caps'}
     */
    fontVariant: TextStyleFontVariant;
    /**
     * The font weight.
     * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
     */
    fontWeight: TextStyleFontWeight;
    /** The height of the line, a number that represents the vertical space that a letter uses. */
    leading: number;
    /** The amount of spacing between letters, default is 0 */
    letterSpacing: number;
    /** The line height, a number that represents the vertical space that a letter uses */
    lineHeight: number;
    /**
     * The lineJoin property sets the type of corner created, it can resolve
     * spiked text issues. Possible values "miter" (creates a sharp corner),
     * "round" (creates a round corner) or "bevel" (creates a squared corner).
     * @type {'miter'|'round'|'bevel'}
     */
    lineJoin: TextStyleLineJoin;
    /**
     * The miter limit to use when using the 'miter' lineJoin mode. This can reduce
     * or increase the spikiness of rendered text.
     */
    miterLimit: number;
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from
     * happening by adding padding to all sides of the text.
     */
    padding: number;
    /** A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00' */
    stroke: string | number;
    /** A number that represents the thickness of the stroke. A value of 0 will disable stroke. */
    strokeThickness: number;
    /**
     * The baseline of the text that is rendered.
     * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
     */
    textBaseline: TextStyleTextBaseline;
    /** Trim transparent borders */
    trim: boolean;
    /**
     * Determines whether newlines & spaces are collapsed or preserved "normal"
     * (collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve,
     * collapse). It needs wordWrap to be set to true.
     * @type {'normal'|'pre'|'pre-line'}
     */
    whiteSpace: TextStyleWhiteSpace;
    /** Indicates if word wrap should be used */
    wordWrap: boolean;
    /** The width at which text will wrap, it needs wordWrap to be set to true */
    wordWrapWidth: number;
}
/**
 * A TextStyle Object contains information to decorate a Text objects.
 *
 * An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.
 *
 * A tool can be used to generate a text style [here](https://pixijs.io/pixi-text-style).
 *
 * @memberof PIXI
 * @example
 * import { TextStyle } from 'pixi.js';
 * const style = new TextStyle({
 *   fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
 *   fontSize: 36,
 * });
 */
export declare class TextStyle implements ITextStyle {
    /**
     * Default style options used for all TextStyle instances.
     * @type {PIXI.ITextStyle}
     */
    static defaultStyle: ITextStyle;
    styleID: number;
    protected _align: TextStyleAlign;
    protected _breakWords: boolean;
    protected _dropShadow: boolean;
    protected _dropShadowAlpha: number;
    protected _dropShadowAngle: number;
    protected _dropShadowBlur: number;
    protected _dropShadowColor: string | number;
    protected _dropShadowDistance: number;
    protected _fill: TextStyleFill;
    protected _fillGradientType: TEXT_GRADIENT;
    protected _fillGradientStops: number[];
    protected _fontFamily: string | string[];
    protected _fontSize: number | string;
    protected _fontStyle: TextStyleFontStyle;
    protected _fontVariant: TextStyleFontVariant;
    protected _fontWeight: TextStyleFontWeight;
    protected _letterSpacing: number;
    protected _lineHeight: number;
    protected _lineJoin: TextStyleLineJoin;
    protected _miterLimit: number;
    protected _padding: number;
    protected _stroke: string | number;
    protected _strokeThickness: number;
    protected _textBaseline: TextStyleTextBaseline;
    protected _trim: boolean;
    protected _whiteSpace: TextStyleWhiteSpace;
    protected _wordWrap: boolean;
    protected _wordWrapWidth: number;
    protected _leading: number;
    /**
     * @param style - TextStyle properties to be set on the text. See {@link PIXI.TextStyle.defaultStyle}
     *       for the default values.
     */
    constructor(style?: Partial<ITextStyle>);
    /**
     * Creates a new TextStyle object with the same values as this one.
     * Note that the only the properties of the object are cloned.
     *
     * @return New cloned TextStyle object
     */
    clone(): TextStyle;
    /** Resets all properties to the defaults specified in TextStyle.prototype._default */
    reset(): void;
    /**
     * Alignment for multiline text, does not affect single line text.
     *
     * @member {'left'|'center'|'right'|'justify'}
     */
    get align(): TextStyleAlign;
    set align(align: TextStyleAlign);
    /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
    get breakWords(): boolean;
    set breakWords(breakWords: boolean);
    /** Set a drop shadow for the text. */
    get dropShadow(): boolean;
    set dropShadow(dropShadow: boolean);
    /** Set alpha for the drop shadow. */
    get dropShadowAlpha(): number;
    set dropShadowAlpha(dropShadowAlpha: number);
    /** Set a angle of the drop shadow. */
    get dropShadowAngle(): number;
    set dropShadowAngle(dropShadowAngle: number);
    /** Set a shadow blur radius. */
    get dropShadowBlur(): number;
    set dropShadowBlur(dropShadowBlur: number);
    /** A fill style to be used on the dropshadow e.g., 'red', '#00FF00'. */
    get dropShadowColor(): number | string;
    set dropShadowColor(dropShadowColor: number | string);
    /** Set a distance of the drop shadow. */
    get dropShadowDistance(): number;
    set dropShadowDistance(dropShadowDistance: number);
    /**
     * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
     *
     * Can be an array to create a gradient e.g., `['#000000','#FFFFFF']`
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     *
     * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
     */
    get fill(): TextStyleFill;
    set fill(fill: TextStyleFill);
    /**
     * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
     *
     * @type {PIXI.TEXT_GRADIENT}
     */
    get fillGradientType(): TEXT_GRADIENT;
    set fillGradientType(fillGradientType: TEXT_GRADIENT);
    /**
     * If fill is an array of colours to create a gradient, this array can set the stop points
     * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
     */
    get fillGradientStops(): number[];
    set fillGradientStops(fillGradientStops: number[]);
    /**
     * The font family, can be a single font name, or a list of names where the first
     * is the preferred font.
     */
    get fontFamily(): string | string[];
    set fontFamily(fontFamily: string | string[]);
    /**
     * The font size
     * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
     */
    get fontSize(): number | string;
    set fontSize(fontSize: number | string);
    /**
     * The font style.
     *
     * @member {'normal'|'italic'|'oblique'}
     */
    get fontStyle(): TextStyleFontStyle;
    set fontStyle(fontStyle: TextStyleFontStyle);
    /**
     * The font variant.
     *
     * @member {'normal'|'small-caps'}
     */
    get fontVariant(): TextStyleFontVariant;
    set fontVariant(fontVariant: TextStyleFontVariant);
    /**
     * The font weight.
     *
     * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
     */
    get fontWeight(): TextStyleFontWeight;
    set fontWeight(fontWeight: TextStyleFontWeight);
    /** The amount of spacing between letters, default is 0. */
    get letterSpacing(): number;
    set letterSpacing(letterSpacing: number);
    /** The line height, a number that represents the vertical space that a letter uses. */
    get lineHeight(): number;
    set lineHeight(lineHeight: number);
    /** The space between lines. */
    get leading(): number;
    set leading(leading: number);
    /**
     * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
     * Default is 'miter' (creates a sharp corner).
     *
     * @member {'miter'|'round'|'bevel'}
     */
    get lineJoin(): TextStyleLineJoin;
    set lineJoin(lineJoin: TextStyleLineJoin);
    /**
     * The miter limit to use when using the 'miter' lineJoin mode.
     *
     * This can reduce or increase the spikiness of rendered text.
     */
    get miterLimit(): number;
    set miterLimit(miterLimit: number);
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
     * by adding padding to all sides of the text.
     */
    get padding(): number;
    set padding(padding: number);
    /**
     * A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'
     */
    get stroke(): string | number;
    set stroke(stroke: string | number);
    /**
     * A number that represents the thickness of the stroke.
     *
     * @default 0
     */
    get strokeThickness(): number;
    set strokeThickness(strokeThickness: number);
    /**
     * The baseline of the text that is rendered.
     *
     * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
     */
    get textBaseline(): TextStyleTextBaseline;
    set textBaseline(textBaseline: TextStyleTextBaseline);
    /** Trim transparent borders. */
    get trim(): boolean;
    set trim(trim: boolean);
    /**
     * How newlines and spaces should be handled.
     * Default is 'pre' (preserve, preserve).
     *
     *  value       | New lines     |   Spaces
     *  ---         | ---           |   ---
     * 'normal'     | Collapse      |   Collapse
     * 'pre'        | Preserve      |   Preserve
     * 'pre-line'   | Preserve      |   Collapse
     *
     * @member {'normal'|'pre'|'pre-line'}
     */
    get whiteSpace(): TextStyleWhiteSpace;
    set whiteSpace(whiteSpace: TextStyleWhiteSpace);
    /** Indicates if word wrap should be used. */
    get wordWrap(): boolean;
    set wordWrap(wordWrap: boolean);
    /** The width at which text will wrap, it needs wordWrap to be set to true. */
    get wordWrapWidth(): number;
    set wordWrapWidth(wordWrapWidth: number);
    /**
     * Generates a font style string to use for `TextMetrics.measureFont()`.
     *
     * @return Font style string, for passing to `TextMetrics.measureFont()`
     */
    toFontString(): string;
}
