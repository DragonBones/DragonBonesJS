import { Runner } from '@pixi/runner';
import type { Renderer } from '../../Renderer';
import type { BaseTexture } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
/**
 * Base resource class for textures that manages validation and uploading, depending on its type.
 *
 * Uploading of a base texture to the GPU is required.
 * @memberof PIXI
 */
export declare abstract class Resource {
    /** The url of the resource */
    src: string;
    /**
     * If resource has been destroyed.
     * @readonly
     * @default false
     */
    destroyed: boolean;
    /**
     * `true` if resource is created by BaseTexture
     * useful for doing cleanup with BaseTexture destroy
     * and not cleaning up resources that were created
     * externally.
     */
    internal: boolean;
    /** Internal width of the resource. */
    protected _width: number;
    /** Internal height of the resource. */
    protected _height: number;
    /**
     * Mini-runner for handling resize events
     * accepts 2 parameters: width, height
     * @member {Runner}
     * @private
     */
    protected onResize: Runner;
    /**
     * Mini-runner for handling update events
     * @member {Runner}
     * @private
     */
    protected onUpdate: Runner;
    /**
     * Handle internal errors, such as loading errors
     * accepts 1 param: error
     * @member {Runner}
     * @private
     */
    protected onError: Runner;
    /**
     * @param width - Width of the resource
     * @param height - Height of the resource
     */
    constructor(width?: number, height?: number);
    /**
     * Bind to a parent BaseTexture
     * @param baseTexture - Parent texture
     */
    bind(baseTexture: BaseTexture): void;
    /**
     * Unbind to a parent BaseTexture
     * @param baseTexture - Parent texture
     */
    unbind(baseTexture: BaseTexture): void;
    /**
     * Trigger a resize event
     * @param width - X dimension
     * @param height - Y dimension
     */
    resize(width: number, height: number): void;
    /**
     * Has been validated
     * @readonly
     */
    get valid(): boolean;
    /** Has been updated trigger event. */
    update(): void;
    /**
     * This can be overridden to start preloading a resource
     * or do any other prepare step.
     * @protected
     * @returns Handle the validate event
     */
    load(): Promise<this>;
    /**
     * The width of the resource.
     * @readonly
     */
    get width(): number;
    /**
     * The height of the resource.
     * @readonly
     */
    get height(): number;
    /**
     * Uploads the texture or returns false if it cant for some reason. Override this.
     * @param renderer - yeah, renderer!
     * @param baseTexture - the texture
     * @param glTexture - texture instance for this webgl context
     * @returns - true is success
     */
    abstract upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
    /**
     * Set the style, optional to override
     * @param _renderer - yeah, renderer!
     * @param _baseTexture - the texture
     * @param _glTexture - texture instance for this webgl context
     * @returns - `true` is success
     */
    style(_renderer: Renderer, _baseTexture: BaseTexture, _glTexture: GLTexture): boolean;
    /** Clean up anything, this happens when destroying is ready. */
    dispose(): void;
    /**
     * Call when destroying resource, unbind any BaseTexture object
     * before calling this method, as reference counts are maintained
     * internally.
     */
    destroy(): void;
    /**
     * Abstract, used to auto-detect resource type.
     * @param {*} _source - The source object
     * @param {string} _extension - The extension of source, if set
     */
    static test(_source: unknown, _extension?: string): boolean;
}
