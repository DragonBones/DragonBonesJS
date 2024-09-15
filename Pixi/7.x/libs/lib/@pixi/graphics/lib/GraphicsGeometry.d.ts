import { BatchDrawCall, BatchGeometry } from '@pixi/core';
import { Bounds } from '@pixi/display';
import { GraphicsData } from './GraphicsData';
import { BatchPart } from './utils';
import type { IPointData, IShape, Matrix, Texture } from '@pixi/core';
import type { FillStyle } from './styles/FillStyle';
import type { LineStyle } from './styles/LineStyle';
/**
 * The Graphics class contains methods used to draw primitive shapes such as lines, circles and
 * rectangles to the display, and to color and fill them.
 *
 * GraphicsGeometry is designed to not be continually updating the geometry since it's expensive
 * to re-tesselate using **earcut**. Consider using {@link PIXI.Mesh} for this use-case, it's much faster.
 * @memberof PIXI
 */
export declare class GraphicsGeometry extends BatchGeometry {
    /** The maximum number of points to consider an object "batchable", able to be batched by the renderer's batch system. */
    static BATCHABLE_SIZE: number;
    /** Minimal distance between points that are considered different. Affects line tesselation. */
    closePointEps: number;
    /** Padding to add to the bounds. */
    boundsPadding: number;
    uvsFloat32: Float32Array;
    indicesUint16: Uint16Array | Uint32Array;
    batchable: boolean;
    /** An array of points to draw, 2 numbers per point */
    points: number[];
    /** The collection of colors */
    colors: number[];
    /** The UVs collection */
    uvs: number[];
    /** The indices of the vertices */
    indices: number[];
    /** Reference to the texture IDs. */
    textureIds: number[];
    /**
     * The collection of drawn shapes.
     * @member {PIXI.GraphicsData[]}
     */
    graphicsData: Array<GraphicsData>;
    /**
     * List of current draw calls drived from the batches.
     * @member {PIXI.BatchDrawCall[]}
     */
    drawCalls: Array<BatchDrawCall>;
    /** Batches need to regenerated if the geometry is updated. */
    batchDirty: number;
    /**
     * Intermediate abstract format sent to batch system.
     * Can be converted to drawCalls or to batchable objects.
     * @member {PIXI.graphicsUtils.BatchPart[]}
     */
    batches: Array<BatchPart>;
    /** Used to detect if the graphics object has changed. */
    protected dirty: number;
    /** Used to check if the cache is dirty. */
    protected cacheDirty: number;
    /** Used to detect if we cleared the graphicsData. */
    protected clearDirty: number;
    /** Index of the last batched shape in the stack of calls. */
    protected shapeIndex: number;
    /** Cached bounds. */
    protected _bounds: Bounds;
    /** The bounds dirty flag. */
    protected boundsDirty: number;
    constructor();
    /**
     * Get the current bounds of the graphic geometry.
     *
     * Since 6.5.0, bounds of the graphics geometry are calculated based on the vertices of generated geometry.
     * Since shapes or strokes with full transparency (`alpha: 0`) will not generate geometry, they are not considered
     * when calculating bounds for the graphics geometry. See PR [#8343]{@link https://github.com/pixijs/pixijs/pull/8343}
     * and issue [#8623]{@link https://github.com/pixijs/pixijs/pull/8623}.
     * @readonly
     */
    get bounds(): Bounds;
    /** Call if you changed graphicsData manually. Empties all batch buffers. */
    protected invalidate(): void;
    /**
     * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
     * @returns - This GraphicsGeometry object. Good for chaining method calls
     */
    clear(): GraphicsGeometry;
    /**
     * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
     * @param fillStyle - Defines style of the fill.
     * @param lineStyle - Defines style of the lines.
     * @param matrix - Transform applied to the points of the shape.
     * @returns - Returns geometry for chaining.
     */
    drawShape(shape: IShape, fillStyle?: FillStyle, lineStyle?: LineStyle, matrix?: Matrix): GraphicsGeometry;
    /**
     * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
     * @param matrix - Transform applied to the points of the shape.
     * @returns - Returns geometry for chaining.
     */
    drawHole(shape: IShape, matrix?: Matrix): GraphicsGeometry;
    /** Destroys the GraphicsGeometry object. */
    destroy(): void;
    /**
     * Check to see if a point is contained within this geometry.
     * @param point - Point to check if it's contained.
     * @returns {boolean} `true` if the point is contained within geometry.
     */
    containsPoint(point: IPointData): boolean;
    /**
     * Generates intermediate batch data. Either gets converted to drawCalls
     * or used to convert to batch objects directly by the Graphics object.
     */
    updateBatches(): void;
    /**
     * Affinity check
     * @param styleA
     * @param styleB
     */
    protected _compareStyles(styleA: FillStyle | LineStyle, styleB: FillStyle | LineStyle): boolean;
    /** Test geometry for batching process. */
    protected validateBatching(): boolean;
    /** Offset the indices so that it works with the batcher. */
    protected packBatches(): void;
    /**
     * Checks to see if this graphics geometry can be batched.
     * Currently it needs to be small enough and not contain any native lines.
     */
    protected isBatchable(): boolean;
    /** Converts intermediate batches data to drawCalls. */
    protected buildDrawCalls(): void;
    /** Packs attributes to single buffer. */
    protected packAttributes(): void;
    /**
     * Process fill part of Graphics.
     * @param data
     */
    protected processFill(data: GraphicsData): void;
    /**
     * Process line part of Graphics.
     * @param data
     */
    protected processLine(data: GraphicsData): void;
    /**
     * Process the holes data.
     * @param holes
     */
    protected processHoles(holes: Array<GraphicsData>): void;
    /** Update the local bounds of the object. Expensive to use performance-wise. */
    protected calculateBounds(): void;
    /**
     * Transform points using matrix.
     * @param points - Points to transform
     * @param matrix - Transform matrix
     */
    protected transformPoints(points: Array<number>, matrix: Matrix): void;
    /**
     * Add colors.
     * @param colors - List of colors to add to
     * @param color - Color to add
     * @param alpha - Alpha to use
     * @param size - Number of colors to add
     * @param offset
     */
    protected addColors(colors: Array<number>, color: number, alpha: number, size: number, offset?: number): void;
    /**
     * Add texture id that the shader/fragment wants to use.
     * @param textureIds
     * @param id
     * @param size
     * @param offset
     */
    protected addTextureIds(textureIds: Array<number>, id: number, size: number, offset?: number): void;
    /**
     * Generates the UVs for a shape.
     * @param verts - Vertices
     * @param uvs - UVs
     * @param texture - Reference to Texture
     * @param start - Index buffer start index.
     * @param size - The size/length for index buffer.
     * @param matrix - Optional transform for all points.
     */
    protected addUvs(verts: Array<number>, uvs: Array<number>, texture: Texture, start: number, size: number, matrix?: Matrix): void;
    /**
     * Modify uvs array according to position of texture region
     * Does not work with rotated or trimmed textures
     * @param uvs - array
     * @param texture - region
     * @param start - starting index for uvs
     * @param size - how many points to adjust
     */
    protected adjustUvs(uvs: Array<number>, texture: Texture, start: number, size: number): void;
}
