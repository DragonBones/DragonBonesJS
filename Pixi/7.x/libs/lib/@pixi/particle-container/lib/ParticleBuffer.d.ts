import { Buffer, Geometry } from '@pixi/core';
import type { Sprite } from '@pixi/sprite';
import type { IParticleRendererProperty } from './ParticleRenderer';
/**
 * The particle buffer manages the static and dynamic buffers for a particle container.
 * @private
 * @memberof PIXI
 */
export declare class ParticleBuffer {
    geometry: Geometry;
    staticStride: number;
    staticBuffer: Buffer;
    staticData: Float32Array;
    staticDataUint32: Uint32Array;
    dynamicStride: number;
    dynamicBuffer: Buffer;
    dynamicData: Float32Array;
    dynamicDataUint32: Uint32Array;
    _updateID: number;
    /** Holds the indices of the geometry (quads) to draw. */
    indexBuffer: Buffer;
    /** The number of particles the buffer can hold. */
    private size;
    /** A list of the properties that are dynamic. */
    private dynamicProperties;
    /** A list of the properties that are static. */
    private staticProperties;
    /**
     * @param {object} properties - The properties to upload.
     * @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
     * @param {number} size - The size of the batch.
     */
    constructor(properties: IParticleRendererProperty[], dynamicPropertyFlags: boolean[], size: number);
    /** Sets up the renderer context and necessary buffers. */
    private initBuffers;
    /**
     * Uploads the dynamic properties.
     * @param children - The children to upload.
     * @param startIndex - The index to start at.
     * @param amount - The number to upload.
     */
    uploadDynamic(children: Sprite[], startIndex: number, amount: number): void;
    /**
     * Uploads the static properties.
     * @param children - The children to upload.
     * @param startIndex - The index to start at.
     * @param amount - The number to upload.
     */
    uploadStatic(children: Sprite[], startIndex: number, amount: number): void;
    /** Destroys the ParticleBuffer. */
    destroy(): void;
}
