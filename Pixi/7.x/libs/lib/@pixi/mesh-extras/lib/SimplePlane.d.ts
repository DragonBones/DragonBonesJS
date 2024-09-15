import { Texture } from '@pixi/core';
import { Mesh } from '@pixi/mesh';
import type { Renderer } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
/**
 * The SimplePlane allows you to draw a texture across several points and then manipulate these points
 * @example
 * import { Point, SimplePlane, Texture } from 'pixi.js';
 *
 * for (let i = 0; i < 20; i++) {
 *     points.push(new Point(i * 50, 0));
 * }
 * const SimplePlane = new SimplePlane(Texture.from('snake.png'), points);
 * @memberof PIXI
 */
export declare class SimplePlane extends Mesh {
    /** The geometry is automatically updated when the texture size changes. */
    autoResize: boolean;
    protected _textureID: number;
    /**
     * @param texture - The texture to use on the SimplePlane.
     * @param verticesX - The number of vertices in the x-axis
     * @param verticesY - The number of vertices in the y-axis
     */
    constructor(texture: Texture, verticesX?: number, verticesY?: number);
    /**
     * Method used for overrides, to do something in case texture frame was changed.
     * Meshes based on plane can override it and change more details based on texture.
     */
    textureUpdated(): void;
    set texture(value: Texture);
    get texture(): Texture;
    _render(renderer: Renderer): void;
    destroy(options?: IDestroyOptions | boolean): void;
}
