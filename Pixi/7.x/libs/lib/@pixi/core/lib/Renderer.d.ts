import { RENDERER_TYPE } from '@pixi/constants';
import { UniformGroup } from './shader/UniformGroup';
import { SystemManager } from './system/SystemManager';
import type { ColorSource } from '@pixi/color';
import type { MSAA_QUALITY } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Rectangle } from '@pixi/math';
import type { ICanvas } from '@pixi/settings';
import type { BackgroundSystem } from './background/BackgroundSystem';
import type { BatchSystem } from './batch/BatchSystem';
import type { ContextSystem } from './context/ContextSystem';
import type { FilterSystem } from './filters/FilterSystem';
import type { FramebufferSystem } from './framebuffer/FramebufferSystem';
import type { MultisampleSystem } from './framebuffer/MultisampleSystem';
import type { BufferSystem } from './geometry/BufferSystem';
import type { GeometrySystem } from './geometry/GeometrySystem';
import type { IRenderableObject, IRenderer, IRendererOptions, IRendererRenderOptions, IRenderingContext } from './IRenderer';
import type { MaskSystem } from './mask/MaskSystem';
import type { ScissorSystem } from './mask/ScissorSystem';
import type { StencilSystem } from './mask/StencilSystem';
import type { IRendererPlugins, PluginSystem } from './plugin/PluginSystem';
import type { ProjectionSystem } from './projection/ProjectionSystem';
import type { ObjectRendererSystem } from './render/ObjectRendererSystem';
import type { GenerateTextureSystem, IGenerateTextureOptions } from './renderTexture/GenerateTextureSystem';
import type { RenderTexture } from './renderTexture/RenderTexture';
import type { RenderTextureSystem } from './renderTexture/RenderTextureSystem';
import type { ShaderSystem } from './shader/ShaderSystem';
import type { StartupSystem } from './startup/StartupSystem';
import type { StateSystem } from './state/StateSystem';
import type { TextureGCSystem } from './textures/TextureGCSystem';
import type { TextureSystem } from './textures/TextureSystem';
import type { TransformFeedbackSystem } from './transformFeedback/TransformFeedbackSystem';
import type { ViewSystem } from './view/ViewSystem';
export interface Renderer extends GlobalMixins.Renderer {
}
/**
 * The Renderer draws the scene and all its content onto a WebGL enabled canvas.
 *
 * This renderer should be used for browsers that support WebGL.
 *
 * This renderer works by automatically managing WebGLBatches, so no need for Sprite Batches or Sprite Clouds.
 * Don't forget to add the view to your DOM or you will not see anything!
 *
 * Renderer is composed of systems that manage specific tasks. The following systems are added by default
 * whenever you create a renderer:
 *
 * | System                               | Description                                                                   |
 * | ------------------------------------ | ----------------------------------------------------------------------------- |
 *
 * | Generic Systems                      | Systems that manage functionality that all renderer types share               |
 * | ------------------------------------ | ----------------------------------------------------------------------------- |
 * | {@link PIXI.ViewSystem}              | This manages the main view of the renderer usually a Canvas                   |
 * | {@link PIXI.PluginSystem}            | This manages plugins for the renderer                                         |
 * | {@link PIXI.BackgroundSystem}        | This manages the main views background color and alpha                        |
 * | {@link PIXI.StartupSystem}           | Boots up a renderer and initiatives all the systems                           |
 * | {@link PIXI.EventSystem}             | This manages UI events.                                                       |
 *
 * | WebGL Core Systems                   | Provide an optimised, easy to use API to work with WebGL                      |
 * | ------------------------------------ | ----------------------------------------------------------------------------- |
 * | {@link PIXI.ContextSystem}           | This manages the WebGL context and extensions.                                |
 * | {@link PIXI.FramebufferSystem}       | This manages framebuffers, which are used for offscreen rendering.            |
 * | {@link PIXI.GeometrySystem}          | This manages geometries & buffers, which are used to draw object meshes.      |
 * | {@link PIXI.ShaderSystem}            | This manages shaders, programs that run on the GPU to calculate 'em pixels.   |
 * | {@link PIXI.StateSystem}             | This manages the WebGL state variables like blend mode, depth testing, etc.   |
 * | {@link PIXI.TextureSystem}           | This manages textures and their resources on the GPU.                         |
 * | {@link PIXI.TextureGCSystem}         | This will automatically remove textures from the GPU if they are not used.    |
 * | {@link PIXI.MultisampleSystem}       | This manages the multisample const on the WEbGL Renderer                      |
 *
 * | PixiJS High-Level Systems            | Set of specific systems designed to work with PixiJS objects                  |
 * | ------------------------------------ | ----------------------------------------------------------------------------- |
 * | {@link PIXI.GenerateTextureSystem}   | This adds the ability to generate textures from any PIXI.DisplayObject        |
 * | {@link PIXI.ProjectionSystem}        | This manages the `projectionMatrix`, used by shaders to get NDC coordinates.  |
 * | {@link PIXI.RenderTextureSystem}     | This manages render-textures, which are an abstraction over framebuffers.     |
 * | {@link PIXI.MaskSystem}              | This manages masking operations.                                              |
 * | {@link PIXI.ScissorSystem}           | This handles scissor masking, and is used internally by {@link PIXI.MaskSystem} |
 * | {@link PIXI.StencilSystem}           | This handles stencil masking, and is used internally by {@link PIXI.MaskSystem} |
 * | {@link PIXI.FilterSystem}            | This manages the filtering pipeline for post-processing effects.              |
 * | {@link PIXI.BatchSystem}             | This manages object renderers that defer rendering until a flush.             |
 * | {@link PIXI.Prepare}                 | This manages uploading assets to the GPU.                                     |
 * | {@link PIXI.Extract}                 | This extracts image data from display objects.                                |
 *
 * The breadth of the API surface provided by the renderer is contained within these systems.
 * @memberof PIXI
 */
export declare class Renderer extends SystemManager<Renderer> implements IRenderer {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * The type of the renderer. will be PIXI.RENDERER_TYPE.CANVAS
     * @member {number}
     * @see PIXI.RENDERER_TYPE
     */
    readonly type = RENDERER_TYPE.WEBGL;
    /**
     * Options passed to the constructor.
     * @type {PIXI.IRendererOptions}
     */
    readonly options: IRendererOptions;
    /**
     * WebGL context, set by {@link PIXI.ContextSystem this.context}.
     * @readonly
     * @member {WebGLRenderingContext}
     */
    gl: IRenderingContext;
    /**
     * Global uniforms
     * Add any uniforms you want shared across your shaders.
     * the must be added before the scene is rendered for the first time
     * as we dynamically buildcode to handle all global var per shader
     *
     */
    globalUniforms: UniformGroup;
    /** Unique UID assigned to the renderer's WebGL context. */
    CONTEXT_UID: number;
    /**
     * Mask system instance
     * @readonly
     */
    readonly mask: MaskSystem;
    /**
     * Context system instance
     * @readonly
     */
    readonly context: ContextSystem;
    /**
     * State system instance
     * @readonly
     */
    readonly state: StateSystem;
    /**
     * Shader system instance
     * @readonly
     */
    readonly shader: ShaderSystem;
    /**
     * Texture system instance
     * @readonly
     */
    readonly texture: TextureSystem;
    /**
     * Buffer system instance
     * @readonly
     */
    readonly buffer: BufferSystem;
    /**
     * TransformFeedback system instance
     * @readonly
     */
    transformFeedback: TransformFeedbackSystem;
    /**
     * Geometry system instance
     * @readonly
     */
    readonly geometry: GeometrySystem;
    /**
     * Framebuffer system instance
     * @readonly
     */
    readonly framebuffer: FramebufferSystem;
    /**
     * Scissor system instance
     * @readonly
     */
    readonly scissor: ScissorSystem;
    /**
     * Stencil system instance
     * @readonly
     */
    readonly stencil: StencilSystem;
    /**
     * Projection system instance
     * @readonly
     */
    readonly projection: ProjectionSystem;
    /**
     * Texture garbage collector system instance
     * @readonly
     */
    readonly textureGC: TextureGCSystem;
    /**
     * Filter system instance
     * @readonly
     */
    readonly filter: FilterSystem;
    /**
     * RenderTexture system instance
     * @readonly
     */
    readonly renderTexture: RenderTextureSystem;
    /**
     * Batch system instance
     * @readonly
     */
    readonly batch: BatchSystem;
    /**
     * plugin system instance
     * @readonly
     */
    readonly _plugin: PluginSystem;
    /**
     * _multisample system instance
     * @readonly
     */
    readonly _multisample: MultisampleSystem;
    /**
     * textureGenerator system instance
     * @readonly
     */
    readonly textureGenerator: GenerateTextureSystem;
    /**
     * background system instance
     * @readonly
     */
    readonly background: BackgroundSystem;
    /**
     * _view system instance
     * @readonly
     */
    readonly _view: ViewSystem;
    /**
     * _render system instance
     * @readonly
     */
    readonly objectRenderer: ObjectRendererSystem;
    /**
     * startup system instance
     * @readonly
     */
    readonly startup: StartupSystem;
    /**
     * Create renderer if WebGL is available. Overrideable
     * by the **@pixi/canvas-renderer** package to allow fallback.
     * throws error if WebGL is not available.
     * @param options
     * @private
     */
    static test(options?: Partial<IRendererOptions>): boolean;
    /**
     * @param {PIXI.IRendererOptions} [options] - See {@link PIXI.settings.RENDER_OPTIONS} for defaults.
     */
    constructor(options?: Partial<IRendererOptions>);
    /**
     * Renders the object to its WebGL view.
     * @param displayObject - The object to be rendered.
     * @param {object} [options] - Object to use for render options.
     * @param {PIXI.RenderTexture} [options.renderTexture] - The render texture to render to.
     * @param {boolean} [options.clear=true] - Should the canvas be cleared before the new render.
     * @param {PIXI.Matrix} [options.transform] - A transform to apply to the render texture before rendering.
     * @param {boolean} [options.skipUpdateTransform=false] - Should we skip the update transform pass?
     */
    render(displayObject: IRenderableObject, options?: IRendererRenderOptions): void;
    /**
     * Resizes the WebGL view to the specified width and height.
     * @param desiredScreenWidth - The desired width of the screen.
     * @param desiredScreenHeight - The desired height of the screen.
     */
    resize(desiredScreenWidth: number, desiredScreenHeight: number): void;
    /**
     * Resets the WebGL state so you can render things however you fancy!
     * @returns Returns itself.
     */
    reset(): this;
    /** Clear the frame buffer. */
    clear(): void;
    /**
     * Removes everything from the renderer (event listeners, spritebatch, etc...)
     * @param [removeView=false] - Removes the Canvas element from the DOM.
     *  See: https://github.com/pixijs/pixijs/issues/2233
     */
    destroy(removeView?: boolean): void;
    /** Collection of plugins */
    get plugins(): IRendererPlugins;
    /** The number of msaa samples of the canvas. */
    get multisample(): MSAA_QUALITY;
    /**
     * Same as view.width, actual number of pixels in the canvas by horizontal.
     * @member {number}
     * @readonly
     * @default 800
     */
    get width(): number;
    /**
     * Same as view.height, actual number of pixels in the canvas by vertical.
     * @default 600
     */
    get height(): number;
    /** The resolution / device pixel ratio of the renderer. */
    get resolution(): number;
    set resolution(value: number);
    /** Whether CSS dimensions of canvas view should be resized to screen dimensions automatically. */
    get autoDensity(): boolean;
    /** The canvas element that everything is drawn to.*/
    get view(): ICanvas;
    /**
     * Measurements of the screen. (0, 0, screenWidth, screenHeight).
     *
     * Its safe to use as filterArea or hitArea for the whole stage.
     * @member {PIXI.Rectangle}
     */
    get screen(): Rectangle;
    /** the last object rendered by the renderer. Useful for other plugins like interaction managers */
    get lastObjectRendered(): IRenderableObject;
    /** Flag if we are rendering to the screen vs renderTexture */
    get renderingToScreen(): boolean;
    /** When logging Pixi to the console, this is the name we will show */
    get rendererLogId(): string;
    /**
     * This sets weather the screen is totally cleared between each frame withthe background color and alpha
     * @deprecated since 7.0.0
     */
    get clearBeforeRender(): boolean;
    /**
     * Pass-thru setting for the canvas' context `alpha` property. This is typically
     * not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.
     * @deprecated since 7.0.0
     * @member {boolean}
     */
    get useContextAlpha(): boolean | 'notMultiplied';
    /**
     * readonly drawing buffer preservation
     * we can only know this if Pixi created the context
     * @deprecated since 7.0.0
     */
    get preserveDrawingBuffer(): boolean;
    /**
     * The background color to fill if not transparent
     * @member {number}
     * @deprecated since 7.0.0
     */
    get backgroundColor(): ColorSource;
    set backgroundColor(value: ColorSource);
    /**
     * The background color alpha. Setting this to 0 will make the canvas transparent.
     * @member {number}
     * @deprecated since 7.0.0
     */
    get backgroundAlpha(): number;
    /**
     * @deprecated since 7.0.0
     */
    set backgroundAlpha(value: number);
    /**
     * @deprecated since 7.0.0
     */
    get powerPreference(): WebGLPowerPreference;
    /**
     * Useful function that returns a texture of the display object that can then be used to create sprites
     * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
     * @param displayObject - The displayObject the object will be generated from.
     * @param {IGenerateTextureOptions} options - Generate texture options.
     * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
     *        if no region is specified, defaults to the local bounds of the displayObject.
     * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
     * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
     * @returns A texture of the graphics object.
     */
    generateTexture(displayObject: IRenderableObject, options?: IGenerateTextureOptions): RenderTexture;
    /**
     * Collection of installed plugins. These are included by default in PIXI, but can be excluded
     * by creating a custom build. Consult the README for more information about creating custom
     * builds and excluding plugins.
     * @private
     */
    static readonly __plugins: IRendererPlugins;
    /**
     * The collection of installed systems.
     * @private
     */
    static readonly __systems: Record<string, any>;
}
