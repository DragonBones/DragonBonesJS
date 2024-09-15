import { Texture } from '@pixi/core';
import { Mesh } from '@pixi/mesh';
import type { DRAW_MODES, IArrayBuffer, ITypedArray, Renderer } from '@pixi/core';
/**
 * The Simple Mesh class mimics Mesh in PixiJS v4, providing easy-to-use constructor arguments.
 * For more robust customization, use {@link PIXI.Mesh}.
 * @memberof PIXI
 */
export declare class SimpleMesh extends Mesh {
    /** Upload vertices buffer each frame. */
    autoUpdate: boolean;
    /**
     * @param texture - The texture to use
     * @param {Float32Array} [vertices] - if you want to specify the vertices
     * @param {Float32Array} [uvs] - if you want to specify the uvs
     * @param {Uint16Array} [indices] - if you want to specify the indices
     * @param drawMode - the drawMode, can be any of the Mesh.DRAW_MODES consts
     */
    constructor(texture?: Texture, vertices?: IArrayBuffer, uvs?: IArrayBuffer, indices?: IArrayBuffer, drawMode?: DRAW_MODES);
    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get vertices(): ITypedArray;
    set vertices(value: ITypedArray);
    _render(renderer: Renderer): void;
}
