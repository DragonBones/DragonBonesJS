import { Rectangle } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { TextStyle } from './TextStyle';
import type { ICanvas, ICanvasRenderingContext2D, Renderer } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
import type { ITextStyle } from './TextStyle';
/**
 * A Text Object will create a line or multiple lines of text.
 *
 * The text is created using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
 *
 * The primary advantage of this class over BitmapText is that you have great control over the style of the text,
 * which you can change at runtime.
 *
 * The primary disadvantages is that each piece of text has it's own texture, which can use more memory.
 * When text changes, this texture has to be re-generated and re-uploaded to the GPU, taking up time.
 *
 * To split a line you can use '\n' in your text string, or, on the `style` object,
 * change its `wordWrap` property to true and and give the `wordWrapWidth` property a value.
 *
 * A Text can be created directly from a string and a style object,
 * which can be generated [here](https://pixijs.io/pixi-text-style).
 * @example
 * import { Text } from 'pixi.js';
 *
 * const text = new Text('This is a PixiJS text', {
 *     fontFamily: 'Arial',
 *     fontSize: 24,
 *     fill: 0xff1010,
 *     align: 'center',
 * });
 * @memberof PIXI
 */
export declare class Text extends Sprite {
    /**
     * Override whether or not the resolution of the text is automatically adjusted to match the resolution of the renderer.
     * Setting this to false can allow you to get crisper text at lower render resolutions.
     * @example
     * // renderer has a resolution of 1
     * const app = new Application();
     *
     * Text.defaultResolution = 2;
     * Text.defaultAutoResolution = false;
     * // text has a resolution of 2
     * const text = new Text('This is a PixiJS text');
     */
    static defaultAutoResolution: boolean;
    /**
     * If {@link PIXI.Text.defaultAutoResolution} is false, this will be the default resolution of the text.
     * If not set it will default to {@link PIXI.settings.RESOLUTION}.
     * @example
     * Text.defaultResolution = 2;
     * Text.defaultAutoResolution = false;
     *
     * // text has a resolution of 2
     * const text = new Text('This is a PixiJS text');
     */
    static defaultResolution: number;
    /**
     * @see PIXI.TextMetrics.experimentalLetterSpacing
     * @deprecated since 7.1.0
     */
    static get experimentalLetterSpacing(): boolean;
    static set experimentalLetterSpacing(value: boolean);
    /** The canvas element that everything is drawn to. */
    canvas: ICanvas;
    /** The canvas 2d context that everything is drawn with. */
    context: ICanvasRenderingContext2D;
    localStyleID: number;
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
     * Private tracker for the current text.
     * @private
     */
    protected _text: string;
    /**
     * Private tracker for the current font.
     * @private
     */
    protected _font: string;
    /**
     * Private tracker for the current style.
     * @private
     */
    protected _style: TextStyle;
    /**
     * Private listener to track style changes.
     * @private
     */
    protected _styleListener: () => void;
    /**
     * Keep track if this Text object created it's own canvas
     * element (`true`) or uses the constructor argument (`false`).
     * Used to workaround a GC issues with Safari < 13 when
     * destroying Text. See `destroy` for more info.
     */
    private _ownCanvas;
    /**
     * @param text - The string that you would like the text to display
     * @param style - The style parameters
     * @param canvas - The canvas element for drawing text
     */
    constructor(text?: string | number, style?: Partial<ITextStyle> | TextStyle, canvas?: ICanvas);
    /**
     * Renders text to its canvas, and updates its texture.
     *
     * By default this is used internally to ensure the texture is correct before rendering,
     * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
     * and then shared across multiple Sprites.
     * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
     */
    updateText(respectDirty: boolean): void;
    /**
     * Render the text with letter-spacing.
     * @param text - The text to draw
     * @param x - Horizontal position to draw the text
     * @param y - Vertical position to draw the text
     * @param isStroke - Is this drawing for the outside stroke of the
     *  text? If not, it's for the inside fill
     */
    private drawLetterSpacing;
    /** Updates texture size based on canvas size. */
    private updateTexture;
    /**
     * Renders the object using the WebGL renderer
     * @param renderer - The renderer
     */
    protected _render(renderer: Renderer): void;
    /** Updates the transform on all children of this container for rendering. */
    updateTransform(): void;
    getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
    /**
     * Gets the local bounds of the text object.
     * @param rect - The output rectangle.
     * @returns The bounds.
     */
    getLocalBounds(rect?: Rectangle): Rectangle;
    /** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
    protected _calculateBounds(): void;
    /**
     * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
     * @param style - The style.
     * @param lines - The lines of text.
     * @param metrics
     * @returns The fill style
     */
    private _generateFillStyle;
    /**
     * Destroys this text object.
     *
     * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
     * the majority of the time the texture will not be shared with any other Sprites.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their
     *  destroy method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
     * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
     */
    destroy(options?: IDestroyOptions | boolean): void;
    /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
    get width(): number;
    set width(value: number);
    /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
    get height(): number;
    set height(value: number);
    /**
     * Set the style of the text.
     *
     * Set up an event listener to listen for changes on the style object and mark the text as dirty.
     *
     * If setting the `style` can also be partial {@link PIXI.ITextStyle}.
     */
    get style(): TextStyle;
    set style(style: TextStyle | Partial<ITextStyle>);
    /** Set the copy for the text object. To split a line you can use '\n'. */
    get text(): string;
    set text(text: string | number);
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default 1
     */
    get resolution(): number;
    set resolution(value: number);
}
