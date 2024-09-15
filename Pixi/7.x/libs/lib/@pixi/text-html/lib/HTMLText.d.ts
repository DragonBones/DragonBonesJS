import { Rectangle } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { TextStyle } from '@pixi/text';
import { HTMLTextStyle } from './HTMLTextStyle';
import type { IRenderer, ISize, Renderer } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
import type { ITextStyle } from '@pixi/text';
/**
 * Alternative to {@link PIXI.Text|Text} but supports multi-style HTML text. There are
 * few key differences between this and {@link PIXI.Text|Text}:
 * <br>&bull; HTMLText not support {@link https://caniuse.com/mdn-svg_elements_foreignobject|Internet Explorer}.
 * <br>&bull; Rendering is text asynchronous. If statically rendering, listen to `update` event on BaseTexture.
 * <br>&bull; Does not support all style options (e.g., `lineJoin`, `leading`, `textBaseline`, `trim`, `miterLimit`,
 *   `fillGradientStops`, `fillGradientType`)
 * @example
 * import { HTMLText } from 'pixi.js';
 *
 * const text = new HTMLText("Hello <b>World</b>", { fontSize: 20 });
 *
 * text.texture.baseTexture.on('update', () => {
 *   console.log('Text is redrawn!');
 * });
 * @class
 * @memberof PIXI
 * @extends PIXI.Sprite
 * @since 7.2.0
 */
export declare class HTMLText extends Sprite {
    /**
     * Default opens when destroying.
     * @type {PIXI.IDestroyOptions}
     * @property {boolean} [texture=true] - Whether to destroy the texture.
     * @property {boolean} [children=false] - Whether to destroy the children.
     * @property {boolean} [baseTexture=true] - Whether to destroy the base texture.
     */
    static defaultDestroyOptions: IDestroyOptions;
    /** Default maxWidth, set at construction */
    static defaultMaxWidth: number;
    /** Default maxHeight, set at construction */
    static defaultMaxHeight: number;
    /** Default resolution, make sure autoResolution or defaultAutoResolution is `false`. */
    static defaultResolution: number | undefined;
    /** Default autoResolution for all HTMLText objects */
    static defaultAutoResolution: boolean;
    /** The maximum width in rendered pixels that the content can be, any larger will be hidden */
    maxWidth: number;
    /** The maximum height in rendered pixels that the content can be, any larger will be hidden */
    maxHeight: number;
    private _domElement;
    private _styleElement;
    private _svgRoot;
    private _foreignObject;
    private _image;
    private _loadImage;
    private _resolution;
    private _text;
    private _style;
    private _autoResolution;
    private localStyleID;
    private dirty;
    private _updateID;
    /** The HTMLTextStyle object is owned by this instance */
    private ownsStyle;
    /**
     * @param {string} [text] - Text contents
     * @param {PIXI.HTMLTextStyle|PIXI.TextStyle|PIXI.ITextStyle} [style] - Style setting to use.
     *        Strongly recommend using an HTMLTextStyle object. Providing a PIXI.TextStyle
     *        will convert the TextStyle to an HTMLTextStyle and will no longer be linked.
     */
    constructor(text?: string, style?: HTMLTextStyle | TextStyle | Partial<ITextStyle>);
    /**
     * Calculate the size of the output text without actually drawing it.
     * This includes the `padding` in the `style` object.
     * This can be used as a fast-pass to do things like text-fitting.
     * @param {object} [overrides] - Overrides for the text, style, and resolution.
     * @param {string} [overrides.text] - The text to measure, if not specified, the current text is used.
     * @param {PIXI.HTMLTextStyle} [overrides.style] - The style to measure, if not specified, the current style is used.
     * @param {number} [overrides.resolution] - The resolution to measure, if not specified, the current resolution is used.
     * @returns {PIXI.ISize} Width and height of the measured text.
     */
    measureText(overrides?: {
        text?: string;
        style?: HTMLTextStyle;
        resolution?: number;
    }): ISize;
    /**
     * Manually refresh the text.
     * @public
     * @param {boolean} respectDirty - Whether to abort updating the
     *        text if the Text isn't dirty and the function is called.
     */
    updateText(respectDirty?: boolean): Promise<void>;
    /** The raw image element that is rendered under-the-hood. */
    get source(): HTMLImageElement;
    /**
     * Update the texture resource.
     * @private
     */
    updateTexture(): void;
    /**
     * Renders the object using the WebGL renderer
     * @param {PIXI.Renderer} renderer - The renderer
     * @private
     */
    _render(renderer: Renderer): void;
    /**
     * Renders the object using the Canvas Renderer.
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    _renderCanvas(renderer: IRenderer): void;
    /**
     * Get the local bounds.
     * @param {PIXI.Rectangle} rect - Input rectangle.
     * @returns {PIXI.Rectangle} Local bounds
     */
    getLocalBounds(rect: Rectangle): Rectangle;
    _calculateBounds(): void;
    /**
     * Handle dirty style changes
     * @private
     */
    _onStyleChange(): void;
    /**
     * Destroy this Text object. Don't use after calling.
     * @param {boolean|object} options - Same as Sprite destroy options.
     */
    destroy(options?: boolean | IDestroyOptions | undefined): void;
    /**
     * Get the width in pixels.
     * @member {number}
     */
    get width(): number;
    set width(value: number);
    /**
     * Get the height in pixels.
     * @member {number}
     */
    get height(): number;
    set height(value: number);
    /** The base style to render with text. */
    get style(): HTMLTextStyle;
    set style(style: HTMLTextStyle | TextStyle | Partial<ITextStyle>);
    /**
     * Contents of text. This can be HTML text and include tags.
     * @example
     * const text = new HTMLText('This is a <em>styled</em> text!');
     * @member {string}
     */
    get text(): string;
    set text(text: string);
    /**
     * The resolution / device pixel ratio of the canvas.
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @member {number}
     * @default 1
     */
    get resolution(): number;
    set resolution(value: number);
    /**
     * Sanitise text - replace `<br>` with `<br/>`, `&nbsp;` with `&#160;`
     * @param text
     * @see https://www.sitepoint.com/community/t/xhtml-1-0-transitional-xml-parsing-error-entity-nbsp-not-defined/3392/3
     */
    private sanitiseText;
}
