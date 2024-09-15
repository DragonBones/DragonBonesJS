import { Buffer } from '../geometry/Buffer';
import { Geometry } from '../geometry/Geometry';
import type { Rectangle } from '@pixi/math';
/**
 * Helper class to create a quad with uvs like in v4
 * @memberof PIXI
 */
export declare class QuadUv extends Geometry {
    vertexBuffer: Buffer;
    uvBuffer: Buffer;
    /** An array of vertices. */
    vertices: Float32Array;
    /** The Uvs of the quad. */
    uvs: Float32Array;
    constructor();
    /**
     * Maps two Rectangle to the quad.
     * @param targetTextureFrame - The first rectangle
     * @param destinationFrame - The second rectangle
     * @returns - Returns itself.
     */
    map(targetTextureFrame: Rectangle, destinationFrame: Rectangle): this;
    /**
     * Legacy upload method, just marks buffers dirty.
     * @returns - Returns itself.
     */
    invalidate(): this;
}
