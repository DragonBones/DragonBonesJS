import { Rectangle } from '@pixi/core';
import type { IPointData, Matrix, Transform } from '@pixi/core';
/**
 * 'Builder' pattern for bounds rectangles.
 *
 * This could be called an Axis-Aligned Bounding Box.
 * It is not an actual shape. It is a mutable thing; no 'EMPTY' or those kind of problems.
 * @memberof PIXI
 */
export declare class Bounds {
    /** @default Infinity */
    minX: number;
    /** @default Infinity */
    minY: number;
    /** @default -Infinity */
    maxX: number;
    /** @default -Infinity */
    maxY: number;
    rect: Rectangle;
    /**
     * It is updated to _boundsID of corresponding object to keep bounds in sync with content.
     * Updated from outside, thus public modifier.
     */
    updateID: number;
    constructor();
    /**
     * Checks if bounds are empty.
     * @returns - True if empty.
     */
    isEmpty(): boolean;
    /** Clears the bounds and resets. */
    clear(): void;
    /**
     * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
     * It is not guaranteed that it will return tempRect
     * @param rect - Temporary object will be used if AABB is not empty
     * @returns - A rectangle of the bounds
     */
    getRectangle(rect?: Rectangle): Rectangle;
    /**
     * This function should be inlined when its possible.
     * @param point - The point to add.
     */
    addPoint(point: IPointData): void;
    /**
     * Adds a point, after transformed. This should be inlined when its possible.
     * @param matrix
     * @param point
     */
    addPointMatrix(matrix: Matrix, point: IPointData): void;
    /**
     * Adds a quad, not transformed
     * @param vertices - The verts to add.
     */
    addQuad(vertices: Float32Array): void;
    /**
     * Adds sprite frame, transformed.
     * @param transform - transform to apply
     * @param x0 - left X of frame
     * @param y0 - top Y of frame
     * @param x1 - right X of frame
     * @param y1 - bottom Y of frame
     */
    addFrame(transform: Transform, x0: number, y0: number, x1: number, y1: number): void;
    /**
     * Adds sprite frame, multiplied by matrix
     * @param matrix - matrix to apply
     * @param x0 - left X of frame
     * @param y0 - top Y of frame
     * @param x1 - right X of frame
     * @param y1 - bottom Y of frame
     */
    addFrameMatrix(matrix: Matrix, x0: number, y0: number, x1: number, y1: number): void;
    /**
     * Adds screen vertices from array
     * @param vertexData - calculated vertices
     * @param beginOffset - begin offset
     * @param endOffset - end offset, excluded
     */
    addVertexData(vertexData: Float32Array, beginOffset: number, endOffset: number): void;
    /**
     * Add an array of mesh vertices
     * @param transform - mesh transform
     * @param vertices - mesh coordinates in array
     * @param beginOffset - begin offset
     * @param endOffset - end offset, excluded
     */
    addVertices(transform: Transform, vertices: Float32Array, beginOffset: number, endOffset: number): void;
    /**
     * Add an array of mesh vertices.
     * @param matrix - mesh matrix
     * @param vertices - mesh coordinates in array
     * @param beginOffset - begin offset
     * @param endOffset - end offset, excluded
     * @param padX - x padding
     * @param padY - y padding
     */
    addVerticesMatrix(matrix: Matrix, vertices: Float32Array, beginOffset: number, endOffset: number, padX?: number, padY?: number): void;
    /**
     * Adds other {@link PIXI.Bounds}.
     * @param bounds - The Bounds to be added
     */
    addBounds(bounds: Bounds): void;
    /**
     * Adds other Bounds, masked with Bounds.
     * @param bounds - The Bounds to be added.
     * @param mask - TODO
     */
    addBoundsMask(bounds: Bounds, mask: Bounds): void;
    /**
     * Adds other Bounds, multiplied by matrix. Bounds shouldn't be empty.
     * @param bounds - other bounds
     * @param matrix - multiplicator
     */
    addBoundsMatrix(bounds: Bounds, matrix: Matrix): void;
    /**
     * Adds other Bounds, masked with Rectangle.
     * @param bounds - TODO
     * @param area - TODO
     */
    addBoundsArea(bounds: Bounds, area: Rectangle): void;
    /**
     * Pads bounds object, making it grow in all directions.
     * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
     * @param paddingX - The horizontal padding amount.
     * @param paddingY - The vertical padding amount.
     */
    pad(paddingX?: number, paddingY?: number): void;
    /**
     * Adds padded frame. (x0, y0) should be strictly less than (x1, y1)
     * @param x0 - left X of frame
     * @param y0 - top Y of frame
     * @param x1 - right X of frame
     * @param y1 - bottom Y of frame
     * @param padX - padding X
     * @param padY - padding Y
     */
    addFramePad(x0: number, y0: number, x1: number, y1: number, padX: number, padY: number): void;
}
