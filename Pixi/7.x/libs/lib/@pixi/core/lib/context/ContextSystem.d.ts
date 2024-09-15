import type { ExtensionMetadata } from '@pixi/extensions';
import type { ICanvas } from '@pixi/settings';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { WebGLExtensions } from './WebGLExtensions';
/**
 * Options for the context system.
 * @memberof PIXI
 */
export interface ContextSystemOptions {
    /**
     * **Deprecated since 7.0.0, use `premultipliedAlpha` and `backgroundAlpha` instead.**
     *
     * Pass-through value for canvas' context attribute `alpha`. This option is for cases where the
     * canvas needs to be opaque, possibly for performance reasons on some older devices.
     * If you want to set transparency, please use `backgroundAlpha`.
     *
     * **WebGL Only:** When set to `'notMultiplied'`, the canvas' context attribute `alpha` will be
     * set to `true` and `premultipliedAlpha` will be to `false`.
     * @deprecated since 7.0.0
     * @memberof PIXI.IRendererOptions
     */
    useContextAlpha?: boolean | 'notMultiplied';
    /**
     * **WebGL Only.** User-provided WebGL rendering context object.
     * @memberof PIXI.IRendererOptions
     */
    context: IRenderingContext | null;
    /**
     * **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
     * @memberof PIXI.IRendererOptions
     */
    antialias: boolean;
    /**
     * **WebGL Only.** A hint indicating what configuration of GPU is suitable for the WebGL context,
     * can be `'default'`, `'high-performance'` or `'low-power'`.
     * Setting to `'high-performance'` will prioritize rendering performance over power consumption,
     * while setting to `'low-power'` will prioritize power saving over rendering performance.
     * @memberof PIXI.IRendererOptions
     */
    powerPreference: WebGLPowerPreference;
    /**
     * **WebGL Only.** Whether the compositor will assume the drawing buffer contains colors with premultiplied alpha.
     * @memberof PIXI.IRendererOptions
     */
    premultipliedAlpha: boolean;
    /**
     * **WebGL Only.** Whether to enable drawing buffer preservation. If enabled, the drawing buffer will preserve
     * its value until cleared or overwritten. Enable this if you need to call `toDataUrl` on the WebGL context.
     * @memberof PIXI.IRendererOptions
     */
    preserveDrawingBuffer: boolean;
}
export interface ISupportDict {
    uint32Indices: boolean;
}
/**
 * System plugin to the renderer to manage the context.
 * @memberof PIXI
 */
export declare class ContextSystem implements ISystem<ContextSystemOptions> {
    /** @ignore */
    static defaultOptions: ContextSystemOptions;
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * Either 1 or 2 to reflect the WebGL version being used.
     * @readonly
     */
    webGLVersion: number;
    /**
     * Features supported by current context.
     * @type {object}
     * @readonly
     * @property {boolean} uint32Indices - Support for 32-bit indices buffer.
     */
    readonly supports: ISupportDict;
    preserveDrawingBuffer: boolean;
    powerPreference: WebGLPowerPreference;
    /**
     * Pass-thru setting for the canvas' context `alpha` property. This is typically
     * not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.
     * @member {boolean}
     * @deprecated since 7.0.0
     */
    useContextAlpha: boolean | 'notMultiplied';
    protected CONTEXT_UID: number;
    protected gl: IRenderingContext;
    /**
     * Extensions available.
     * @type {object}
     * @readonly
     * @property {WEBGL_draw_buffers} drawBuffers - WebGL v1 extension
     * @property {WEBGL_depth_texture} depthTexture - WebGL v1 extension
     * @property {OES_texture_float} floatTexture - WebGL v1 extension
     * @property {WEBGL_lose_context} loseContext - WebGL v1 extension
     * @property {OES_vertex_array_object} vertexArrayObject - WebGL v1 extension
     * @property {EXT_texture_filter_anisotropic} anisotropicFiltering - WebGL v1 and v2 extension
     */
    extensions: WebGLExtensions;
    private renderer;
    /** @param renderer - The renderer this System works for. */
    constructor(renderer: Renderer);
    /**
     * `true` if the context is lost
     * @readonly
     */
    get isLost(): boolean;
    /**
     * Handles the context change event.
     * @param {WebGLRenderingContext} gl - New WebGL context.
     */
    protected contextChange(gl: IRenderingContext): void;
    init(options: ContextSystemOptions): void;
    /**
     * Initializes the context.
     * @protected
     * @param {WebGLRenderingContext} gl - WebGL context
     */
    initFromContext(gl: IRenderingContext): void;
    /**
     * Initialize from context options
     * @protected
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
     * @param {object} options - context attributes
     */
    initFromOptions(options: WebGLContextAttributes): void;
    /**
     * Helper class to create a WebGL Context
     * @param canvas - the canvas element that we will get the context from
     * @param options - An options object that gets passed in to the canvas element containing the
     *    context attributes
     * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
     * @returns {WebGLRenderingContext} the WebGL context
     */
    createContext(canvas: ICanvas, options: WebGLContextAttributes): IRenderingContext;
    /** Auto-populate the {@link PIXI.ContextSystem.extensions extensions}. */
    protected getExtensions(): void;
    /**
     * Handles a lost webgl context
     * @param {WebGLContextEvent} event - The context lost event.
     */
    protected handleContextLost(event: WebGLContextEvent): void;
    /** Handles a restored webgl context. */
    protected handleContextRestored(): void;
    destroy(): void;
    /** Handle the post-render runner event. */
    protected postrender(): void;
    /**
     * Validate context.
     * @param {WebGLRenderingContext} gl - Render context.
     */
    protected validateContext(gl: IRenderingContext): void;
}
