import { Matrix, ObjectRenderer, Shader, State, TYPES } from '@pixi/core';
import type { ExtensionMetadata, Renderer } from '@pixi/core';
import type { Sprite } from '@pixi/sprite';
import type { ParticleContainer } from './ParticleContainer';
export interface IParticleRendererProperty {
    attributeName: string;
    size: number;
    type?: TYPES;
    uploadFunction: (...params: any[]) => any;
    offset: number;
}
/**
 * Renderer for Particles that is designer for speed over feature set.
 * @memberof PIXI
 */
export declare class ParticleRenderer extends ObjectRenderer {
    /** @ignore */
    static extension: ExtensionMetadata;
    /** The WebGL state in which this renderer will work. */
    readonly state: State;
    /** The default shader that is used if a sprite doesn't have a more specific one. */
    shader: Shader;
    tempMatrix: Matrix;
    properties: IParticleRendererProperty[];
    /**
     * @param renderer - The renderer this sprite batch works for.
     */
    constructor(renderer: Renderer);
    /**
     * Renders the particle container object.
     * @param container - The container to render using this ParticleRenderer.
     */
    render(container: ParticleContainer): void;
    /**
     * Creates one particle buffer for each child in the container we want to render and updates internal properties.
     * @param container - The container to render using this ParticleRenderer
     * @returns - The buffers
     */
    private generateBuffers;
    /**
     * Creates one more particle buffer, because container has autoResize feature.
     * @param container - The container to render using this ParticleRenderer
     * @returns - The generated buffer
     */
    private _generateOneMoreBuffer;
    /**
     * Uploads the vertices.
     * @param children - the array of sprites to render
     * @param startIndex - the index to start from in the children array
     * @param amount - the amount of children that will have their vertices uploaded
     * @param array - The vertices to upload.
     * @param stride - Stride to use for iteration.
     * @param offset - Offset to start at.
     */
    uploadVertices(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
    /**
     * Uploads the position.
     * @param children - the array of sprites to render
     * @param startIndex - the index to start from in the children array
     * @param amount - the amount of children that will have their positions uploaded
     * @param array - The vertices to upload.
     * @param stride - Stride to use for iteration.
     * @param offset - Offset to start at.
     */
    uploadPosition(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
    /**
     * Uploads the rotation.
     * @param children - the array of sprites to render
     * @param startIndex - the index to start from in the children array
     * @param amount - the amount of children that will have their rotation uploaded
     * @param array - The vertices to upload.
     * @param stride - Stride to use for iteration.
     * @param offset - Offset to start at.
     */
    uploadRotation(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
    /**
     * Uploads the UVs.
     * @param children - the array of sprites to render
     * @param startIndex - the index to start from in the children array
     * @param amount - the amount of children that will have their rotation uploaded
     * @param array - The vertices to upload.
     * @param stride - Stride to use for iteration.
     * @param offset - Offset to start at.
     */
    uploadUvs(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
    /**
     * Uploads the tint.
     * @param children - the array of sprites to render
     * @param startIndex - the index to start from in the children array
     * @param amount - the amount of children that will have their rotation uploaded
     * @param array - The vertices to upload.
     * @param stride - Stride to use for iteration.
     * @param offset - Offset to start at.
     */
    uploadTint(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
    /** Destroys the ParticleRenderer. */
    destroy(): void;
}
