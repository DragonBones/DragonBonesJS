import { GLBuffer } from './GLBuffer';
import type { BUFFER_TYPE } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { Buffer } from './Buffer';
/**
 * System plugin to the renderer to manage buffers.
 *
 * WebGL uses Buffers as a way to store objects to the GPU.
 * This system makes working with them a lot easier.
 *
 * Buffers are used in three main places in WebGL
 * - geometry information
 * - Uniform information (via uniform buffer objects - a WebGL 2 only feature)
 * - Transform feedback information. (WebGL 2 only feature)
 *
 * This system will handle the binding of buffers to the GPU as well as uploading
 * them. With this system, you never need to work directly with GPU buffers, but instead work with
 * the PIXI.Buffer class.
 * @class
 * @memberof PIXI
 */
export declare class BufferSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    CONTEXT_UID: number;
    gl: IRenderingContext;
    /** Cache for all buffers by id, used in case renderer gets destroyed or for profiling */
    readonly managedBuffers: {
        [key: number]: Buffer;
    };
    /** Cache keeping track of the base bound buffer bases */
    readonly boundBufferBases: {
        [key: number]: Buffer;
    };
    private renderer;
    /**
     * @param {PIXI.Renderer} renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    /**
     * @ignore
     */
    destroy(): void;
    /** Sets up the renderer context and necessary buffers. */
    protected contextChange(): void;
    /**
     * This binds specified buffer. On first run, it will create the webGL buffers for the context too
     * @param buffer - the buffer to bind to the renderer
     */
    bind(buffer: Buffer): void;
    unbind(type: BUFFER_TYPE): void;
    /**
     * Binds an uniform buffer to at the given index.
     *
     * A cache is used so a buffer will not be bound again if already bound.
     * @param buffer - the buffer to bind
     * @param index - the base index to bind it to.
     */
    bindBufferBase(buffer: Buffer, index: number): void;
    /**
     * Binds a buffer whilst also binding its range.
     * This will make the buffer start from the offset supplied rather than 0 when it is read.
     * @param buffer - the buffer to bind
     * @param index - the base index to bind at, defaults to 0
     * @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
     */
    bindBufferRange(buffer: Buffer, index?: number, offset?: number): void;
    /**
     * Will ensure the data in the buffer is uploaded to the GPU.
     * @param {PIXI.Buffer} buffer - the buffer to update
     */
    update(buffer: Buffer): void;
    /**
     * Disposes buffer
     * @param {PIXI.Buffer} buffer - buffer with data
     * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
     */
    dispose(buffer: Buffer, contextLost?: boolean): void;
    /**
     * dispose all WebGL resources of all managed buffers
     * @param {boolean} [contextLost=false] - If context was lost, we suppress `gl.delete` calls
     */
    disposeAll(contextLost?: boolean): void;
    /**
     * creates and attaches a GLBuffer object tied to the current context.
     * @param buffer
     * @protected
     */
    protected createGLBuffer(buffer: Buffer): GLBuffer;
}
