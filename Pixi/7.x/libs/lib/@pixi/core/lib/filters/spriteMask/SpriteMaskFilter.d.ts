import { Matrix } from '@pixi/math';
import { Filter } from '../Filter';
import type { CLEAR_MODES } from '@pixi/constants';
import type { Point } from '@pixi/math';
import type { Dict } from '@pixi/utils';
import type { IMaskTarget } from '../../mask/MaskData';
import type { RenderTexture } from '../../renderTexture/RenderTexture';
import type { Texture } from '../../textures/Texture';
import type { FilterSystem } from '../FilterSystem';
export interface ISpriteMaskTarget extends IMaskTarget {
    _texture: Texture;
    worldAlpha: number;
    anchor: Point;
}
export interface ISpriteMaskFilter extends Filter {
    maskSprite: IMaskTarget;
}
/**
 * This handles a Sprite acting as a mask, as opposed to a Graphic.
 *
 * WebGL only.
 * @memberof PIXI
 */
export declare class SpriteMaskFilter extends Filter {
    /** @private */
    _maskSprite: IMaskTarget;
    /** Mask matrix */
    maskMatrix: Matrix;
    /**
     * @param {PIXI.Sprite} sprite - The target sprite.
     */
    constructor(sprite: IMaskTarget);
    /**
     * @param vertexSrc - The source of the vertex shader.
     * @param fragmentSrc - The source of the fragment shader.
     * @param uniforms - Custom uniforms to use to augment the built-in ones.
     */
    constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: Dict<any>);
    /**
     * Sprite mask
     * @type {PIXI.DisplayObject}
     */
    get maskSprite(): IMaskTarget;
    set maskSprite(value: IMaskTarget);
    /**
     * Applies the filter
     * @param filterManager - The renderer to retrieve the filter from
     * @param input - The input render target.
     * @param output - The target to output to.
     * @param clearMode - Should the output be cleared before rendering to it.
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
}
