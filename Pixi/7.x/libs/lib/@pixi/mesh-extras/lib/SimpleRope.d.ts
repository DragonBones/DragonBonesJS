import { Mesh } from '@pixi/mesh';
import type { IPoint, Renderer, Texture } from '@pixi/core';
/**
 * The rope allows you to draw a texture across several points and then manipulate these points
 * @example
 * import { Point, SimpleRope, Texture } from 'pixi.js';
 *
 * for (let i = 0; i < 20; i++) {
 *     points.push(new Point(i * 50, 0));
 * };
 * const rope = new SimpleRope(Texture.from('snake.png'), points);
 * @memberof PIXI
 */
export declare class SimpleRope extends Mesh {
    autoUpdate: boolean;
    /**
     * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
     * @param texture - The texture to use on the rope.
     * @param points - An array of {@link PIXI.Point} objects to construct this rope.
     * @param {number} textureScale - Optional. Positive values scale rope texture
     * keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
     * and downsampling here. If set to zero, texture will be stretched instead.
     */
    constructor(texture: Texture, points: IPoint[], textureScale?: number);
    _render(renderer: Renderer): void;
}
