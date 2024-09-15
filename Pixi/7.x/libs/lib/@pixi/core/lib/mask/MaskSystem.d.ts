import { SpriteMaskFilter } from '../filters/spriteMask/SpriteMaskFilter';
import { MaskData } from './MaskData';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
import type { IMaskTarget } from './MaskData';
/**
 * System plugin to the renderer to manage masks.
 *
 * There are three built-in types of masking:
 * **Scissor Masking**: Scissor masking discards pixels that are outside of a rectangle called the scissor box. It is
 *  the most performant as the scissor test is inexpensive. However, it can only be used when the mask is rectangular.
 * **Stencil Masking**: Stencil masking discards pixels that don't overlap with the pixels rendered into the stencil
 *  buffer. It is the next fastest option as it does not require rendering into a separate framebuffer. However, it does
 *  cause the mask to be rendered **twice** for each masking operation; hence, minimize the rendering cost of your masks.
 * **Sprite Mask Filtering**: Sprite mask filtering discards pixels based on the red channel of the sprite-mask's
 *  texture. (Generally, the masking texture is grayscale). Using advanced techniques, you might be able to embed this
 *  type of masking in a custom shader - and hence, bypassing the masking system fully for performance wins.
 *
 * The best type of masking is auto-detected when you `push` one. To use scissor masking, you must pass in a `Graphics`
 * object with just a rectangle drawn.
 *
 * ## Mask Stacks
 *
 * In the scene graph, masks can be applied recursively, i.e. a mask can be applied during a masking operation. The mask
 * stack stores the currently applied masks in order. Each {@link PIXI.BaseRenderTexture} holds its own mask stack, i.e.
 * when you switch render-textures, the old masks only applied when you switch back to rendering to the old render-target.
 * @memberof PIXI
 */
export declare class MaskSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * Flag to enable scissor masking.
     * @default true
     */
    enableScissor: boolean;
    /** Pool of used sprite mask filters. */
    protected readonly alphaMaskPool: Array<SpriteMaskFilter[]>;
    /**
     * Current index of alpha mask pool.
     * @default 0
     * @readonly
     */
    protected alphaMaskIndex: number;
    /** Pool of mask data. */
    private readonly maskDataPool;
    private maskStack;
    private renderer;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    /**
     * Changes the mask stack that is used by this System.
     * @param maskStack - The mask stack
     */
    setMaskStack(maskStack: Array<MaskData>): void;
    /**
     * Enables the mask and appends it to the current mask stack.
     *
     * NOTE: The batch renderer should be flushed beforehand to prevent pending renders from being masked.
     * @param {PIXI.DisplayObject} target - Display Object to push the mask to
     * @param {PIXI.MaskData|PIXI.Sprite|PIXI.Graphics|PIXI.DisplayObject} maskDataOrTarget - The masking data.
     */
    push(target: IMaskTarget, maskDataOrTarget: MaskData | IMaskTarget): void;
    /**
     * Removes the last mask from the mask stack and doesn't return it.
     *
     * NOTE: The batch renderer should be flushed beforehand to render the masked contents before the mask is removed.
     * @param {PIXI.IMaskTarget} target - Display Object to pop the mask from
     */
    pop(target: IMaskTarget): void;
    /**
     * Sets type of MaskData based on its maskObject.
     * @param maskData
     */
    detect(maskData: MaskData): void;
    /**
     * Applies the Mask and adds it to the current filter stack.
     * @param maskData - Sprite to be used as the mask.
     */
    pushSpriteMask(maskData: MaskData): void;
    /**
     * Removes the last filter from the filter stack and doesn't return it.
     * @param maskData - Sprite to be used as the mask.
     */
    popSpriteMask(maskData: MaskData): void;
    /**
     * Pushes the color mask.
     * @param maskData - The mask data
     */
    pushColorMask(maskData: MaskData): void;
    /**
     * Pops the color mask.
     * @param maskData - The mask data
     */
    popColorMask(maskData: MaskData): void;
    destroy(): void;
}
