import { BaseTexture, Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { TextStyle } from '@pixi/text';
import type { IRenderer } from '@pixi/core';
import type { DisplayObject } from '@pixi/display';
interface IUploadHook {
    (helper: IRenderer | BasePrepare, item: IDisplayObjectExtended): boolean;
}
interface IFindHook {
    (item: any, queue: Array<any>): boolean;
}
export interface IDisplayObjectExtended extends DisplayObject {
    _textures?: Array<Texture>;
    _texture?: Texture;
    style?: TextStyle | Partial<TextStyle>;
}
/**
 * The prepare manager provides functionality to upload content to the GPU.
 *
 * BasePrepare handles basic queuing functionality and is extended by
 * {@link PIXI.Prepare} and {@link PIXI.CanvasPrepare}
 * to provide preparation capabilities specific to their respective renderers.
 * @example
 * // Create a sprite
 * const sprite = PIXI.Sprite.from('something.png');
 *
 * // Load object into GPU
 * app.renderer.prepare.upload(sprite, () => {
 *     // Texture(s) has been uploaded to GPU
 *     app.stage.addChild(sprite);
 * });
 * @abstract
 * @memberof PIXI
 */
export declare class BasePrepare {
    /**
     * The default maximum uploads per frame.
     * @static
     */
    static uploadsPerFrame: number;
    /**
     * The limiter to be used to control how quickly items are prepared.
     * @type {PIXI.CountLimiter|PIXI.TimeLimiter}
     */
    private limiter;
    /** Reference to the renderer. */
    protected renderer: IRenderer;
    /**
     * The only real difference between CanvasPrepare and Prepare is what they pass
     * to upload hooks. That different parameter is stored here.
     */
    protected uploadHookHelper: any;
    /** Collection of items to uploads at once. */
    protected queue: Array<any>;
    /**
     * Collection of additional hooks for finding assets.
     * @type {Array<Function>}
     */
    addHooks: Array<any>;
    /**
     * Collection of additional hooks for processing assets.
     * @type {Array<Function>}
     */
    uploadHooks: Array<any>;
    /**
     * Callback to call after completed.
     * @type {Array<Function>}
     */
    completes: Array<any>;
    /**
     * If prepare is ticking (running).
     * @type {boolean}
     */
    ticking: boolean;
    /**
     * 'bound' call for prepareItems().
     * @type {Function}
     */
    private delayedTick;
    /**
     * @param {PIXI.IRenderer} renderer - A reference to the current renderer
     */
    constructor(renderer: IRenderer);
    /**
     * Upload all the textures and graphics to the GPU.
     * @method PIXI.BasePrepare#upload
     * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text} [item] -
     *        Container or display object to search for items to upload or the items to upload themselves,
     *        or optionally ommitted, if items have been added using {@link PIXI.BasePrepare#add `prepare.add`}.
     */
    upload(item?: IDisplayObjectExtended | Container | BaseTexture | Texture): Promise<void>;
    /**
     * Handle tick update
     * @private
     */
    tick(): void;
    /**
     * Actually prepare items. This is handled outside of the tick because it will take a while
     * and we do NOT want to block the current animation frame from rendering.
     * @private
     */
    prepareItems(): void;
    /**
     * Adds hooks for finding items.
     * @param {Function} addHook - Function call that takes two parameters: `item:*, queue:Array`
     *          function must return `true` if it was able to add item to the queue.
     * @returns Instance of plugin for chaining.
     */
    registerFindHook(addHook: IFindHook): this;
    /**
     * Adds hooks for uploading items.
     * @param {Function} uploadHook - Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and
     *          function must return `true` if it was able to handle upload of item.
     * @returns Instance of plugin for chaining.
     */
    registerUploadHook(uploadHook: IUploadHook): this;
    /**
     * Manually add an item to the uploading queue.
     * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text|*} item - Object to
     *        add to the queue
     * @returns Instance of plugin for chaining.
     */
    add(item: IDisplayObjectExtended | Container | BaseTexture | Texture): this;
    /** Destroys the plugin, don't use after this. */
    destroy(): void;
}
export {};
