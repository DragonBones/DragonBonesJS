import { Color } from '@pixi/color';
import type { ColorSource } from '@pixi/color';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { ISystem } from '../system/ISystem';
/**
 * Options for the background system.
 * @memberof PIXI
 * @deprecated since 7.2.3
 * @see PIXI.BackgroundSystemOptions
 */
export type BackgroundSytemOptions = BackgroundSystemOptions;
/**
 * Options for the background system.
 * @memberof PIXI
 */
export interface BackgroundSystemOptions {
    /**
     * The background color used to clear the canvas. See {@link PIXI.ColorSource} for accepted color values.
     * @memberof PIXI.IRendererOptions
     */
    backgroundColor: ColorSource;
    /**
     * Alias for {@link PIXI.IRendererOptions.backgroundColor}
     * @memberof PIXI.IRendererOptions
     */
    background?: ColorSource;
    /**
     * Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
     * @memberof PIXI.IRendererOptions
     */
    backgroundAlpha: number;
    /**
     * Whether to clear the canvas before new render passes.
     * @memberof PIXI.IRendererOptions
     */
    clearBeforeRender: boolean;
}
/**
 * The background system manages the background color and alpha of the main view.
 * @memberof PIXI
 */
export declare class BackgroundSystem implements ISystem<BackgroundSystemOptions> {
    static defaultOptions: BackgroundSystemOptions;
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
     * frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
     * to clear the canvas every frame. Disable this by setting this to false. For example, if
     * your game has a canvas filling background image you often don't need this set.
     * @member {boolean}
     * @default
     */
    clearBeforeRender: boolean;
    /** Reference to the internal color */
    private _backgroundColor;
    constructor();
    /**
     * initiates the background system
     * @param {PIXI.IRendererOptions} options - the options for the background colors
     */
    init(options: BackgroundSystemOptions): void;
    /**
     * The background color to fill if not transparent.
     * @member {PIXI.ColorSource}
     */
    get color(): ColorSource;
    set color(value: ColorSource);
    /**
     * The background color alpha. Setting this to 0 will make the canvas transparent.
     * @member {number}
     */
    get alpha(): number;
    set alpha(value: number);
    /** The background color object. */
    get backgroundColor(): Color;
    destroy(): void;
}
