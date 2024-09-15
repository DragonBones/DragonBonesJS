import { AbstractMaskSystem } from './AbstractMaskSystem';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Renderer } from '../Renderer';
import type { MaskData } from './MaskData';
/**
 * System plugin to the renderer to manage scissor masking.
 *
 * Scissor masking discards pixels outside of a rectangle called the scissor box. The scissor box is in the framebuffer
 * viewport's space; however, the mask's rectangle is projected from world-space to viewport space automatically
 * by this system.
 * @memberof PIXI
 */
export declare class ScissorSystem extends AbstractMaskSystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * @param {PIXI.Renderer} renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    getStackLength(): number;
    /**
     * evaluates _boundsTransformed, _scissorRect for MaskData
     * @param maskData
     */
    calcScissorRect(maskData: MaskData): void;
    private static isMatrixRotated;
    /**
     * Test, whether the object can be scissor mask with current renderer projection.
     * Calls "calcScissorRect()" if its true.
     * @param maskData - mask data
     * @returns whether Whether the object can be scissor mask
     */
    testScissor(maskData: MaskData): boolean;
    private roundFrameToPixels;
    /**
     * Applies the Mask and adds it to the current stencil stack.
     * @author alvin
     * @param maskData - The mask data.
     */
    push(maskData: MaskData): void;
    /**
     * This should be called after a mask is popped off the mask stack. It will rebind the scissor box to be latest with the
     * last mask in the stack.
     *
     * This can also be called when you directly modify the scissor box and want to restore PixiJS state.
     * @param maskData - The mask data.
     */
    pop(maskData?: MaskData): void;
    /**
     * Setup renderer to use the current scissor data.
     * @private
     */
    _useCurrent(): void;
}
