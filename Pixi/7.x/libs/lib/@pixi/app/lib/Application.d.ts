import { Container } from '@pixi/display';
import type { ICanvas, IRenderer, IRendererOptionsAuto, Rectangle } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
/**
 * Any plugin that's usable for Application should contain these methods.
 * @memberof PIXI
 */
export interface IApplicationPlugin {
    /**
     * Called when Application is constructed, scoped to Application instance.
     * Passes in `options` as the only argument, which are Application constructor options.
     * @param {object} options - Application options.
     */
    init(options: Partial<IApplicationOptions>): void;
    /** Called when destroying Application, scoped to Application instance. */
    destroy(): void;
}
/**
 * Application options supplied to constructor.
 * @memberof PIXI
 */
export interface IApplicationOptions extends IRendererOptionsAuto, GlobalMixins.IApplicationOptions {
}
export interface Application extends GlobalMixins.Application {
}
/**
 * Convenience class to create a new PixiJS application.
 *
 * This class automatically creates the renderer, ticker and root container.
 * @example
 * import { Application, Sprite } from 'pixi.js';
 *
 * // Create the application
 * const app = new Application();
 *
 * // Add the view to the DOM
 * document.body.appendChild(app.view);
 *
 * // ex, add display objects
 * app.stage.addChild(Sprite.from('something.png'));
 * @class
 * @memberof PIXI
 */
export declare class Application<VIEW extends ICanvas = ICanvas> {
    /** Collection of installed plugins. */
    static _plugins: IApplicationPlugin[];
    /**
     * The root display container that's rendered.
     * @member {PIXI.Container}
     */
    stage: Container;
    /**
     * WebGL renderer if available, otherwise CanvasRenderer.
     * @member {PIXI.Renderer|PIXI.CanvasRenderer}
     */
    renderer: IRenderer<VIEW>;
    /**
     * @param options - The optional application and renderer parameters.
     */
    constructor(options?: Partial<IApplicationOptions>);
    /** Render the current stage. */
    render(): void;
    /**
     * Reference to the renderer's canvas element.
     * @member {PIXI.ICanvas}
     * @readonly
     */
    get view(): VIEW;
    /**
     * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
     * @member {PIXI.Rectangle}
     * @readonly
     */
    get screen(): Rectangle;
    /**
     * Destroy and don't use after this.
     * @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
     * @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'stageOptions' will be passed on to those calls.
     * @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
     *  to true. Should it destroy the texture of the child sprite
     * @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
     *  to true. Should it destroy the base texture of the child sprite
     */
    destroy(removeView?: boolean, stageOptions?: IDestroyOptions | boolean): void;
}
