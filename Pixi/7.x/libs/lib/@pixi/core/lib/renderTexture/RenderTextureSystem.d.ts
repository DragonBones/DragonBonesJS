import { Rectangle } from '@pixi/math';
import type { ColorSource } from '@pixi/color';
import type { BUFFER_BITS } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { MaskData } from '../mask/MaskData';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { RenderTexture } from './RenderTexture';
/**
 * System plugin to the renderer to manage render textures.
 *
 * Should be added after FramebufferSystem
 *
 * ### Frames
 *
 * The `RenderTextureSystem` holds a sourceFrame → destinationFrame projection. The following table explains the different
 * coordinate spaces used:
 *
 * | Frame                  | Description                                                      | Coordinate System                                       |
 * | ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
 * | sourceFrame            | The rectangle inside of which display-objects are being rendered | **World Space**: The origin on the top-left             |
 * | destinationFrame       | The rectangle in the render-target (canvas or texture) into which contents should be rendered | If rendering to the canvas, this is in screen space and the origin is on the top-left. If rendering to a render-texture, this is in its base-texture's space with the origin on the bottom-left.  |
 * | viewportFrame          | The framebuffer viewport corresponding to the destination-frame  | **Window Coordinates**: The origin is always on the bottom-left. |
 * @memberof PIXI
 */
export declare class RenderTextureSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * List of masks for the {@link PIXI.StencilSystem}.
     * @readonly
     */
    defaultMaskStack: Array<MaskData>;
    /**
     * Render texture currently bound. {@code null} if rendering to the canvas.
     * @readonly
     */
    current: RenderTexture | null;
    /**
     * The source frame for the render-target's projection mapping.
     *
     * See {@link PIXI.ProjectionSystem#sourceFrame} for more details
     */
    readonly sourceFrame: Rectangle;
    /**
     * The destination frame for the render-target's projection mapping.
     *
     * See {@link PIXI.ProjectionSystem#destinationFrame} for more details.
     */
    readonly destinationFrame: Rectangle;
    /**
     * The viewport frame for the render-target's viewport binding. This is equal to the destination-frame
     * for render-textures, while it is y-flipped when rendering to the screen (i.e. its origin is always on
     * the bottom-left).
     */
    readonly viewportFrame: Rectangle;
    private renderer;
    /** Does the renderer have alpha and are its color channels stored premultipled by the alpha channel? */
    private _rendererPremultipliedAlpha;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    protected contextChange(): void;
    /**
     * Bind the current render texture.
     * @param renderTexture - RenderTexture to bind, by default its `null` - the screen.
     * @param sourceFrame - Part of world that is mapped to the renderTexture.
     * @param destinationFrame - Part of renderTexture, by default it has the same size as sourceFrame.
     */
    bind(renderTexture?: RenderTexture, sourceFrame?: Rectangle, destinationFrame?: Rectangle): void;
    /**
     * Erases the render texture and fills the drawing area with a colour.
     * @param clearColor - The color as rgba, default to use the renderer backgroundColor
     * @param [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
     *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
     */
    clear(clearColor?: ColorSource, mask?: BUFFER_BITS): void;
    resize(): void;
    /** Resets render-texture state. */
    reset(): void;
    destroy(): void;
}
