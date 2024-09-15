import type { DRAW_MODES } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { Shader } from '../shader/Shader';
import type { ISystem } from '../system/ISystem';
import type { TransformFeedback } from './TransformFeedback';
/**
 * TransformFeedbackSystem provides TransformFeedback of WebGL2
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLTransformFeedback
 *
 * For example, you can use TransformFeedbackSystem to implement GPU Particle or
 * general purpose computing on GPU (aka GPGPU).
 *
 * It also manages a lifetime of GLTransformFeedback object
 * @memberof PIXI
 */
export declare class TransformFeedbackSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    CONTEXT_UID: number;
    gl: IRenderingContext;
    private renderer;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    /** Sets up the renderer context and necessary buffers. */
    protected contextChange(): void;
    /**
     * Bind TransformFeedback and buffers
     * @param transformFeedback - TransformFeedback to bind
     */
    bind(transformFeedback: TransformFeedback): void;
    /** Unbind TransformFeedback */
    unbind(): void;
    /**
     * Begin TransformFeedback
     * @param drawMode - DrawMode for TransformFeedback
     * @param shader - A Shader used by TransformFeedback. Current bound shader will be used if not provided.
     */
    beginTransformFeedback(drawMode: DRAW_MODES, shader?: Shader): void;
    /** End TransformFeedback */
    endTransformFeedback(): void;
    /**
     * Create TransformFeedback and bind buffers
     * @param tf - TransformFeedback
     * @returns WebGLTransformFeedback
     */
    protected createGLTransformFeedback(tf: TransformFeedback): WebGLTransformFeedback;
    /**
     * Disposes TransfromFeedback
     * @param {PIXI.TransformFeedback} tf - TransformFeedback
     * @param {boolean} [contextLost=false] - If context was lost, we suppress delete TransformFeedback
     */
    disposeTransformFeedback(tf: TransformFeedback, contextLost?: boolean): void;
    destroy(): void;
}
