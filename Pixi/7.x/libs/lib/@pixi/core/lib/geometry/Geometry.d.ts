import { Runner } from '@pixi/runner';
import { Attribute } from './Attribute';
import { Buffer } from './Buffer';
import type { TYPES } from '@pixi/constants';
import type { IArrayBuffer } from './Buffer';
/**
 * The Geometry represents a model. It consists of two components:
 * - GeometryStyle - The structure of the model such as the attributes layout
 * - GeometryData - the data of the model - this consists of buffers.
 * This can include anything from positions, uvs, normals, colors etc.
 *
 * Geometry can be defined without passing in a style or data if required (thats how I prefer!)
 * @example
 * import { Geometry } from 'pixi.js';
 *
 * const geometry = new Geometry();
 *
 * geometry.addAttribute('positions', [0, 0, 100, 0, 0, 100, 100, 100], 2);
 * geometry.addAttribute('uvs', [0, 0, 1, 0, 0, 1, 1, 1], 2);
 * geometry.addIndex([0, 1, 2, 1, 3, 2]);
 * @memberof PIXI
 */
export declare class Geometry {
    buffers: Array<Buffer>;
    indexBuffer: Buffer;
    attributes: {
        [key: string]: Attribute;
    };
    id: number;
    /** Whether the geometry is instanced. */
    instanced: boolean;
    /**
     * Number of instances in this geometry, pass it to `GeometrySystem.draw()`.
     * @default 1
     */
    instanceCount: number;
    /**
     * A map of renderer IDs to webgl VAOs
     * @type {object}
     */
    glVertexArrayObjects: {
        [key: number]: {
            [key: string]: WebGLVertexArrayObject;
        };
    };
    disposeRunner: Runner;
    /** Count of existing (not destroyed) meshes that reference this geometry. */
    refCount: number;
    /**
     * @param buffers - An array of buffers. optional.
     * @param attributes - Of the geometry, optional structure of the attributes layout
     */
    constructor(buffers?: Array<Buffer>, attributes?: {
        [key: string]: Attribute;
    });
    /**
     *
     * Adds an attribute to the geometry
     * Note: `stride` and `start` should be `undefined` if you dont know them, not 0!
     * @param id - the name of the attribute (matching up to a shader)
     * @param {PIXI.Buffer|number[]} buffer - the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
     * @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
     * @param normalized - should the data be normalized.
     * @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
     * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
     * @param [start=0] - How far into the array to start reading values (used for interleaving data)
     * @param instance - Instancing flag
     * @returns - Returns self, useful for chaining.
     */
    addAttribute(id: string, buffer: Buffer | Float32Array | Uint32Array | Array<number>, size?: number, normalized?: boolean, type?: TYPES, stride?: number, start?: number, instance?: boolean): this;
    /**
     * Returns the requested attribute.
     * @param id - The name of the attribute required
     * @returns - The attribute requested.
     */
    getAttribute(id: string): Attribute;
    /**
     * Returns the requested buffer.
     * @param id - The name of the buffer required.
     * @returns - The buffer requested.
     */
    getBuffer(id: string): Buffer;
    /**
     *
     * Adds an index buffer to the geometry
     * The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
     * @param {PIXI.Buffer|number[]} [buffer] - The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
     * @returns - Returns self, useful for chaining.
     */
    addIndex(buffer?: Buffer | IArrayBuffer | number[]): Geometry;
    /**
     * Returns the index buffer
     * @returns - The index buffer.
     */
    getIndex(): Buffer;
    /**
     * This function modifies the structure so that all current attributes become interleaved into a single buffer
     * This can be useful if your model remains static as it offers a little performance boost
     * @returns - Returns self, useful for chaining.
     */
    interleave(): Geometry;
    /** Get the size of the geometries, in vertices. */
    getSize(): number;
    /** Disposes WebGL resources that are connected to this geometry. */
    dispose(): void;
    /** Destroys the geometry. */
    destroy(): void;
    /**
     * Returns a clone of the geometry.
     * @returns - A new clone of this geometry.
     */
    clone(): Geometry;
    /**
     * Merges an array of geometries into a new single one.
     *
     * Geometry attribute styles must match for this operation to work.
     * @param geometries - array of geometries to merge
     * @returns - Shiny new geometry!
     */
    static merge(geometries: Array<Geometry>): Geometry;
}
