import { Runner } from '@pixi/runner';
import type { Buffer } from '../geometry/Buffer';
/**
 * A TransformFeedback object wrapping GLTransformFeedback object.
 *
 * For example you can use TransformFeedback object to feed-back buffer data from Shader having TransformFeedbackVaryings.
 * @memberof PIXI
 */
export declare class TransformFeedback {
    _glTransformFeedbacks: {
        [key: number]: WebGLTransformFeedback;
    };
    buffers: Buffer[];
    disposeRunner: Runner;
    constructor();
    /**
     * Bind buffer to TransformFeedback
     * @param index - index to bind
     * @param buffer - buffer to bind
     */
    bindBuffer(index: number, buffer: Buffer): void;
    /** Destroy WebGL resources that are connected to this TransformFeedback. */
    destroy(): void;
}
