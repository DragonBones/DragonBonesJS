import { MSAA_QUALITY } from '@pixi/constants';
import { Runner } from '@pixi/runner';
import { BaseTexture } from '../textures/BaseTexture';
import type { GLFramebuffer } from './GLFramebuffer';
/**
 * A framebuffer can be used to render contents off of the screen. {@link PIXI.BaseRenderTexture} uses
 * one internally to render into itself. You can attach a depth or stencil buffer to a framebuffer.
 *
 * On WebGL 2 machines, shaders can output to multiple textures simultaneously with GLSL 300 ES.
 * @memberof PIXI
 */
export declare class Framebuffer {
    /** Width of framebuffer in pixels. */
    width: number;
    /** Height of framebuffer in pixels. */
    height: number;
    /**
     * Desired number of samples for antialiasing. 0 means AA should not be used.
     *
     * Experimental WebGL2 feature, allows to use antialiasing in individual renderTextures.
     * Antialiasing is the same as for main buffer with renderer `antialias: true` options.
     * Seriously affects GPU memory consumption and GPU performance.
     * @example
     * import { MSAA_QUALITY } from 'pixi.js';
     *
     * renderTexture.framebuffer.multisample = MSAA_QUALITY.HIGH;
     * // ...
     * renderer.render(myContainer, { renderTexture });
     * renderer.framebuffer.blit(); // Copies data from MSAA framebuffer to texture
     * @default PIXI.MSAA_QUALITY.NONE
     */
    multisample: MSAA_QUALITY;
    stencil: boolean;
    depth: boolean;
    dirtyId: number;
    dirtyFormat: number;
    dirtySize: number;
    depthTexture: BaseTexture;
    colorTextures: Array<BaseTexture>;
    glFramebuffers: {
        [key: string]: GLFramebuffer;
    };
    disposeRunner: Runner;
    /**
     * @param width - Width of the frame buffer
     * @param height - Height of the frame buffer
     */
    constructor(width: number, height: number);
    /**
     * Reference to the colorTexture.
     * @readonly
     */
    get colorTexture(): BaseTexture;
    /**
     * Add texture to the colorTexture array.
     * @param index - Index of the array to add the texture to
     * @param texture - Texture to add to the array
     */
    addColorTexture(index?: number, texture?: BaseTexture): this;
    /**
     * Add a depth texture to the frame buffer.
     * @param texture - Texture to add.
     */
    addDepthTexture(texture?: BaseTexture): this;
    /** Enable depth on the frame buffer. */
    enableDepth(): this;
    /** Enable stencil on the frame buffer. */
    enableStencil(): this;
    /**
     * Resize the frame buffer
     * @param width - Width of the frame buffer to resize to
     * @param height - Height of the frame buffer to resize to
     */
    resize(width: number, height: number): void;
    /** Disposes WebGL resources that are connected to this geometry. */
    dispose(): void;
    /** Destroys and removes the depth texture added to this framebuffer. */
    destroyDepthTexture(): void;
}
