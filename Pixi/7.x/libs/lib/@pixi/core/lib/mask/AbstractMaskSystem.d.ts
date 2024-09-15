import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { MaskData } from './MaskData';
/**
 * System plugin to the renderer to manage specific types of masking operations.
 * @memberof PIXI
 */
export declare class AbstractMaskSystem implements ISystem {
    /**
     * The mask stack
     * @member {PIXI.MaskData[]}
     */
    protected maskStack: Array<MaskData>;
    /**
     * Constant for gl.enable
     * @private
     */
    protected glConst: number;
    protected renderer: Renderer;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    /** Gets count of masks of certain type. */
    getStackLength(): number;
    /**
     * Changes the mask stack that is used by this System.
     * @param {PIXI.MaskData[]} maskStack - The mask stack
     */
    setMaskStack(maskStack: Array<MaskData>): void;
    /**
     * Setup renderer to use the current mask data.
     * @private
     */
    protected _useCurrent(): void;
    /** Destroys the mask stack. */
    destroy(): void;
}
