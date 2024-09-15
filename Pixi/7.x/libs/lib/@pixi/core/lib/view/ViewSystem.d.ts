import { Rectangle } from '@pixi/math';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { ICanvas } from '@pixi/settings';
import type { IRenderer } from '../IRenderer';
import type { ISystem } from '../system/ISystem';
/**
 * Options for the view system.
 * @memberof PIXI
 */
export interface ViewSystemOptions {
    /**
     * The canvas to use as the view. If omitted, a new canvas will be created.
     * @memberof PIXI.IRendererOptions
     */
    view?: ICanvas;
    /**
     * The width of the renderer's view.
     * @memberof PIXI.IRendererOptions
     */
    width?: number;
    /**
     * The height of the renderer's view.
     * @memberof PIXI.IRendererOptions
     */
    height?: number;
    /**
     * The resolution / device pixel ratio of the renderer.
     * @memberof PIXI.IRendererOptions
     */
    resolution?: number;
    /**
     * Whether the CSS dimensions of the renderer's view should be resized automatically.
     * @memberof PIXI.IRendererOptions
     */
    autoDensity?: boolean;
}
/**
 * The view system manages the main canvas that is attached to the DOM.
 * This main role is to deal with how the holding the view reference and dealing with how it is resized.
 * @memberof PIXI
 */
export declare class ViewSystem implements ISystem<ViewSystemOptions, boolean> {
    /** @ignore */
    static defaultOptions: ViewSystemOptions;
    /** @ignore */
    static extension: ExtensionMetadata;
    private renderer;
    /**
     * The resolution / device pixel ratio of the renderer.
     * @member {number}
     * @default PIXI.settings.RESOLUTION
     */
    resolution: number;
    /**
     * Measurements of the screen. (0, 0, screenWidth, screenHeight).
     *
     * Its safe to use as filterArea or hitArea for the whole stage.
     * @member {PIXI.Rectangle}
     */
    screen: Rectangle;
    /**
     * The canvas element that everything is drawn to.
     * @member {PIXI.ICanvas}
     */
    element: ICanvas;
    /**
     * Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
     * @member {boolean}
     */
    autoDensity: boolean;
    constructor(renderer: IRenderer);
    /**
     * initiates the view system
     * @param {PIXI.ViewOptions} options - the options for the view
     */
    init(options: ViewSystemOptions): void;
    /**
     * Resizes the screen and canvas to the specified dimensions.
     * @param desiredScreenWidth - The new width of the screen.
     * @param desiredScreenHeight - The new height of the screen.
     */
    resizeView(desiredScreenWidth: number, desiredScreenHeight: number): void;
    /**
     * Destroys this System and optionally removes the canvas from the dom.
     * @param {boolean} [removeView=false] - Whether to remove the canvas from the DOM.
     */
    destroy(removeView: boolean): void;
}
