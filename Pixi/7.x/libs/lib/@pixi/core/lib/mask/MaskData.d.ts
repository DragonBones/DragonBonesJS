import { MASK_TYPES } from '@pixi/constants';
import type { MSAA_QUALITY } from '@pixi/constants';
import type { Matrix, Rectangle } from '@pixi/math';
import type { IFilterTarget } from '../filters/IFilterTarget';
import type { ISpriteMaskFilter } from '../filters/spriteMask/SpriteMaskFilter';
import type { Renderer } from '../Renderer';
export interface IMaskTarget extends IFilterTarget {
    renderable: boolean;
    isSprite?: boolean;
    worldTransform: Matrix;
    isFastRect?(): boolean;
    getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
    render(renderer: Renderer): void;
}
/**
 * Component for masked elements.
 *
 * Holds mask mode and temporary data about current mask.
 * @memberof PIXI
 */
export declare class MaskData {
    /** Mask type */
    type: MASK_TYPES;
    /**
     * Whether we know the mask type beforehand
     * @default true
     */
    autoDetect: boolean;
    /**
     * Which element we use to mask
     * @member {PIXI.DisplayObject}
     */
    maskObject: IMaskTarget;
    /** Whether it belongs to MaskSystem pool */
    pooled: boolean;
    /** Indicator of the type (always true for {@link PIXI.MaskData} objects) */
    isMaskData: boolean;
    /**
     * Resolution of the sprite mask filter.
     * If set to `null` or `0`, the resolution of the current render target is used.
     * @default null
     */
    resolution: number | null;
    /**
     * Number of samples of the sprite mask filter.
     * If set to `null`, the sample count of the current render target is used.
     * @default PIXI.Filter.defaultMultisample
     */
    multisample: MSAA_QUALITY | null;
    /** If enabled is true the mask is applied, if false it will not. */
    enabled: boolean;
    /**
     * Color mask.
     * @see PIXI.COLOR_MASK_BITS
     */
    colorMask: number;
    /**
     * The sprite mask filter wrapped in an array.
     * @private
     */
    _filters: ISpriteMaskFilter[];
    /**
     * Stencil counter above the mask in stack
     * @private
     */
    _stencilCounter: number;
    /**
     * Scissor counter above the mask in stack
     * @private
     */
    _scissorCounter: number;
    /**
     * Scissor operation above the mask in stack.
     * Null if _scissorCounter is zero, rectangle instance if positive.
     * @private
     */
    _scissorRect: Rectangle;
    /**
     * pre-computed scissor rect
     * does become _scissorRect when mask is actually pushed
     * @private
     */
    _scissorRectLocal: Rectangle;
    /**
     * pre-computed color mask
     * @private
     */
    _colorMask: number;
    /**
     * Targeted element. Temporary variable set by MaskSystem
     * @member {PIXI.DisplayObject}
     * @private
     */
    _target: IMaskTarget;
    /**
     * Create MaskData
     * @param {PIXI.DisplayObject} [maskObject=null] - object that describes the mask
     */
    constructor(maskObject?: IMaskTarget);
    /**
     * The sprite mask filter.
     * If set to `null`, the default sprite mask filter is used.
     * @default null
     */
    get filter(): ISpriteMaskFilter;
    set filter(value: ISpriteMaskFilter);
    /** Resets the mask data after popMask(). */
    reset(): void;
    /**
     * Copies counters from maskData above, called from pushMask().
     * @param maskAbove
     */
    copyCountersOrReset(maskAbove?: MaskData): void;
}
