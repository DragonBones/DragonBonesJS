import { BLEND_MODES, ObservablePoint, Rectangle, Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import type { ColorSource, IBaseTextureOptions, IPointData, Renderer, TextureSource } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
export type SpriteSource = TextureSource | Texture;
export interface Sprite extends GlobalMixins.Sprite, Container {
}
/**
 * The Sprite object is the base for all textured objects that are rendered to the screen
 *
 * A sprite can be created directly from an image like this:
 *
 * ```js
 * import { Sprite } from 'pixi.js';
 *
 * const sprite = Sprite.from('assets/image.png');
 * ```
 *
 * The more efficient way to create sprites is using a {@link PIXI.Spritesheet},
 * as swapping base textures when rendering to the screen is inefficient.
 *
 * ```js
 * import { Assets, Sprite } from 'pixi.js';
 *
 * const sheet = await Assets.load('assets/spritesheet.json');
 * const sprite = new Sprite(sheet.textures['image.png']);
 * ```
 * @memberof PIXI
 */
export declare class Sprite extends Container {
    /**
     * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
     * @default PIXI.BLEND_MODES.NORMAL
     */
    blendMode: BLEND_MODES;
    indices: Uint16Array;
    /**
     * Plugin that is responsible for rendering this element.
     * Allows to customize the rendering process without overriding '_render' & '_renderCanvas' methods.
     * @default 'batch'
     */
    pluginName: string;
    /**
     * The width of the sprite (this is initially set by the texture).
     * @protected
     */
    _width: number;
    /**
     * The height of the sprite (this is initially set by the texture)
     * @protected
     */
    _height: number;
    /**
     * The texture that the sprite is using.
     * @private
     */
    _texture: Texture;
    _textureID: number;
    /**
     * Cached tint value so we can tell when the tint is changed.
     * Value is used for 2d CanvasRenderer.
     * @protected
     * @default 0xFFFFFF
     */
    _cachedTint: number;
    protected _textureTrimmedID: number;
    /**
     * This is used to store the uvs data of the sprite, assigned at the same time
     * as the vertexData in calculateVertices().
     * @member {Float32Array}
     */
    protected uvs: Float32Array;
    /**
     * The anchor point defines the normalized coordinates
     * in the texture that map to the position of this
     * sprite.
     *
     * By default, this is `(0,0)` (or `texture.defaultAnchor`
     * if you have modified that), which means the position
     * `(x,y)` of this `Sprite` will be the top-left corner.
     *
     * Note: Updating `texture.defaultAnchor` after
     * constructing a `Sprite` does _not_ update its anchor.
     *
     * {@link https://docs.cocos2d-x.org/cocos2d-x/en/sprites/manipulation.html}
     * @default `this.texture.defaultAnchor`
     */
    protected _anchor: ObservablePoint;
    /**
     * This is used to store the vertex data of the sprite (basically a quad).
     * @member {Float32Array}
     */
    protected vertexData: Float32Array;
    /**
     * This is used to calculate the bounds of the object IF it is a trimmed sprite.
     * @member {Float32Array}
     */
    private vertexTrimmedData;
    /**
     * Internal roundPixels field
     * @private
     */
    private _roundPixels;
    private _transformID;
    private _transformTrimmedID;
    /**
     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     * @default 0xFFFFFF
     */
    private _tintColor;
    /**
     * The tint applied to the sprite. This is a RGB value. A value of 0xFFFFFF will remove any tint effect.
     * @private
     * @default 16777215
     */
    _tintRGB: number;
    /** @param texture - The texture for this sprite. */
    constructor(texture?: Texture);
    /** When the texture is updated, this event will fire to update the scale and frame. */
    protected _onTextureUpdate(): void;
    /** Called when the anchor position updates. */
    private _onAnchorUpdate;
    /** Calculates worldTransform * vertices, store it in vertexData. */
    calculateVertices(): void;
    /**
     * Calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData.
     *
     * This is used to ensure that the true width and height of a trimmed texture is respected.
     */
    calculateTrimmedVertices(): void;
    /**
     *
     * Renders the object using the WebGL renderer
     * @param renderer - The webgl renderer to use.
     */
    protected _render(renderer: Renderer): void;
    /** Updates the bounds of the sprite. */
    protected _calculateBounds(): void;
    /**
     * Gets the local bounds of the sprite object.
     * @param rect - Optional output rectangle.
     * @returns The bounds.
     */
    getLocalBounds(rect?: Rectangle): Rectangle;
    /**
     * Tests if a point is inside this sprite
     * @param point - the point to test
     * @returns The result of the test
     */
    containsPoint(point: IPointData): boolean;
    /**
     * Destroys this sprite and optionally its texture and children.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param [options.children=false] - if set to true, all the children will have their destroy
     *      method called as well. 'options' will be passed on to those calls.
     * @param [options.texture=false] - Should it destroy the current texture of the sprite as well
     * @param [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
     */
    destroy(options?: IDestroyOptions | boolean): void;
    /**
     * Helper function that creates a new sprite based on the source you provide.
     * The source can be - frame id, image url, video url, canvas element, video element, base texture
     * @param {string|PIXI.Texture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
     *     - Source to create texture from
     * @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
     * @returns The newly created sprite
     */
    static from(source: SpriteSource, options?: IBaseTextureOptions): Sprite;
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     *
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     *
     * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
     * @default false
     */
    set roundPixels(value: boolean);
    get roundPixels(): boolean;
    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    get width(): number;
    set width(value: number);
    /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
    get height(): number;
    set height(value: number);
    /**
     * The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
     * and passed to the constructor.
     *
     * The default is `(0,0)`, this means the sprite's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
     *
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     * @example
     * import { Sprite } from 'pixi.js';
     *
     * const sprite = new Sprite(Texture.WHITE);
     * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
     */
    get anchor(): ObservablePoint;
    set anchor(value: ObservablePoint);
    /**
     * The tint applied to the sprite. This is a hex value.
     *
     * A value of 0xFFFFFF will remove any tint effect.
     * @default 0xFFFFFF
     */
    get tint(): ColorSource;
    set tint(value: ColorSource);
    /**
     * Get the tint as a RGB integer.
     * @ignore
     */
    get tintValue(): number;
    /** The texture that the sprite is using. */
    get texture(): Texture;
    set texture(value: Texture);
}
