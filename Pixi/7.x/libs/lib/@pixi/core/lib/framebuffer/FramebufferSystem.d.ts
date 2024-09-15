import { BUFFER_BITS, MSAA_QUALITY } from '@pixi/constants';
import { Rectangle } from '@pixi/math';
import { Framebuffer } from './Framebuffer';
import { GLFramebuffer } from './GLFramebuffer';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
/**
 * System plugin to the renderer to manage framebuffers.
 * @memberof PIXI
 */
export declare class FramebufferSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /** A list of managed framebuffers. */
    readonly managedFramebuffers: Array<Framebuffer>;
    current: Framebuffer;
    viewport: Rectangle;
    hasMRT: boolean;
    writeDepthTexture: boolean;
    protected CONTEXT_UID: number;
    protected gl: IRenderingContext;
    /** Framebuffer value that shows that we don't know what is bound. */
    protected unknownFramebuffer: Framebuffer;
    protected msaaSamples: Array<number>;
    renderer: Renderer;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    /** Sets up the renderer context and necessary buffers. */
    protected contextChange(): void;
    /**
     * Bind a framebuffer.
     * @param framebuffer
     * @param frame - frame, default is framebuffer size
     * @param mipLevel - optional mip level to set on the framebuffer - defaults to 0
     */
    bind(framebuffer?: Framebuffer, frame?: Rectangle, mipLevel?: number): void;
    /**
     * Set the WebGLRenderingContext's viewport.
     * @param x - X position of viewport
     * @param y - Y position of viewport
     * @param width - Width of viewport
     * @param height - Height of viewport
     */
    setViewport(x: number, y: number, width: number, height: number): void;
    /**
     * Get the size of the current width and height. Returns object with `width` and `height` values.
     * @readonly
     */
    get size(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Clear the color of the context
     * @param r - Red value from 0 to 1
     * @param g - Green value from 0 to 1
     * @param b - Blue value from 0 to 1
     * @param a - Alpha value from 0 to 1
     * @param {PIXI.BUFFER_BITS} [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
     *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
     */
    clear(r: number, g: number, b: number, a: number, mask?: BUFFER_BITS): void;
    /**
     * Initialize framebuffer for this context
     * @protected
     * @param framebuffer
     * @returns - created GLFramebuffer
     */
    initFramebuffer(framebuffer: Framebuffer): GLFramebuffer;
    /**
     * Resize the framebuffer
     * @param framebuffer
     * @protected
     */
    resizeFramebuffer(framebuffer: Framebuffer): void;
    /**
     * Update the framebuffer
     * @param framebuffer
     * @param mipLevel
     * @protected
     */
    updateFramebuffer(framebuffer: Framebuffer, mipLevel: number): void;
    /**
     * Returns true if the frame buffer can be multisampled.
     * @param framebuffer
     */
    protected canMultisampleFramebuffer(framebuffer: Framebuffer): boolean;
    /**
     * Detects number of samples that is not more than a param but as close to it as possible
     * @param samples - number of samples
     * @returns - recommended number of samples
     */
    protected detectSamples(samples: MSAA_QUALITY): MSAA_QUALITY;
    /**
     * Only works with WebGL2
     *
     * blits framebuffer to another of the same or bigger size
     * after that target framebuffer is bound
     *
     * Fails with WebGL warning if blits multisample framebuffer to different size
     * @param framebuffer - by default it blits "into itself", from renderBuffer to texture.
     * @param sourcePixels - source rectangle in pixels
     * @param destPixels - dest rectangle in pixels, assumed to be the same as sourcePixels
     */
    blit(framebuffer?: Framebuffer, sourcePixels?: Rectangle, destPixels?: Rectangle): void;
    /**
     * Disposes framebuffer.
     * @param framebuffer - framebuffer that has to be disposed of
     * @param contextLost - If context was lost, we suppress all delete function calls
     */
    disposeFramebuffer(framebuffer: Framebuffer, contextLost?: boolean): void;
    /**
     * Disposes all framebuffers, but not textures bound to them.
     * @param [contextLost=false] - If context was lost, we suppress all delete function calls
     */
    disposeAll(contextLost?: boolean): void;
    /**
     * Forcing creation of stencil buffer for current framebuffer, if it wasn't done before.
     * Used by MaskSystem, when its time to use stencil mask for Graphics element.
     *
     * Its an alternative for public lazy `framebuffer.enableStencil`, in case we need stencil without rebind.
     * @private
     */
    forceStencil(): void;
    /** Resets framebuffer stored state, binds screen framebuffer. Should be called before renderTexture reset(). */
    reset(): void;
    destroy(): void;
}
