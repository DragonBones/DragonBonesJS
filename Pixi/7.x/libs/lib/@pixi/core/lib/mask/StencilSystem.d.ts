import { AbstractMaskSystem } from './AbstractMaskSystem';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Renderer } from '../Renderer';
import type { IMaskTarget, MaskData } from './MaskData';
/**
 * System plugin to the renderer to manage stencils (used for masks).
 * @memberof PIXI
 */
export declare class StencilSystem extends AbstractMaskSystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    getStackLength(): number;
    /**
     * Applies the Mask and adds it to the current stencil stack.
     * @param maskData - The mask data
     */
    push(maskData: MaskData): void;
    /**
     * Pops stencil mask. MaskData is already removed from stack
     * @param {PIXI.DisplayObject} maskObject - object of popped mask data
     */
    pop(maskObject: IMaskTarget): void;
    /**
     * Setup renderer to use the current stencil data.
     * @private
     */
    _useCurrent(): void;
}
