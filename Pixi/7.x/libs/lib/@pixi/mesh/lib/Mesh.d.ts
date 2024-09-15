import { DRAW_MODES, State } from '@pixi/core';
import { Container } from '@pixi/display';
import type { BLEND_MODES, Buffer, ColorSource, Geometry, IPointData, Renderer, Shader, Texture } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
import type { MeshMaterial } from './MeshMaterial';
export interface Mesh extends GlobalMixins.Mesh {
}
/**
 * Base mesh class.
 *
 * This class empowers you to have maximum flexibility to render any kind of WebGL visuals you can think of.
 * This class assumes a certain level of WebGL knowledge.
 * If you know a bit this should abstract enough away to make your life easier!
 *
 * Pretty much ALL WebGL can be broken down into the following:
 * - Geometry - The structure and data for the mesh. This can include anything from positions, uvs, normals, colors etc..
 * - Shader - This is the shader that PixiJS will render the geometry with (attributes in the shader must match the geometry)
 * - State - This is the state of WebGL required to render the mesh.
 *
 * Through a combination of the above elements you can render anything you want, 2D or 3D!
 * @memberof PIXI
 */
export declare class Mesh<T extends Shader = MeshMaterial> extends Container {
    /**
     * Used by the @pixi/canvas-mesh package to draw meshes using canvas.
     * Added here because we cannot mixin a static property to Mesh type.
     * @ignore
     */
    static defaultCanvasPadding: number;
    /**
     * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
     * Can be shared between multiple Mesh objects.
     * @type {PIXI.Shader|PIXI.MeshMaterial}
     */
    shader: T;
    /**
     * Represents the WebGL state the Mesh required to render, excludes shader and geometry. E.g.,
     * blend mode, culling, depth testing, direction of rendering triangles, backface, etc.
     */
    state: State;
    /** The way the Mesh should be drawn, can be any of the {@link PIXI.DRAW_MODES} constants. */
    drawMode: DRAW_MODES;
    /**
     * Typically the index of the IndexBuffer where to start drawing.
     * @default 0
     */
    start: number;
    /**
     * How much of the geometry to draw, by default `0` renders everything.
     * @default 0
     */
    size: number;
    private _geometry;
    /** This is the caching layer used by the batcher. */
    private vertexData;
    /** If geometry is changed used to decide to re-transform the vertexData. */
    private vertexDirty;
    private _transformID;
    /** Internal roundPixels field. */
    private _roundPixels;
    /** Batched UV's are cached for atlas textures. */
    private batchUvs;
    /**
     * These are used as easy access for batching.
     * @private
     */
    uvs: Float32Array;
    /**
     * These are used as easy access for batching.
     * @private
     */
    indices: Uint16Array;
    _tintRGB: number;
    _texture: Texture;
    /**
     * @param geometry - The geometry the mesh will use.
     * @param {PIXI.MeshMaterial} shader - The shader the mesh will use.
     * @param state - The state that the WebGL context is required to be in to render the mesh
     *        if no state is provided, uses {@link PIXI.State.for2d} to create a 2D state for PixiJS.
     * @param drawMode - The drawMode, can be any of the {@link PIXI.DRAW_MODES} constants.
     */
    constructor(geometry: Geometry, shader: T, state?: State, drawMode?: DRAW_MODES);
    /**
     * Includes vertex positions, face indices, normals, colors, UVs, and
     * custom attributes within buffers, reducing the cost of passing all
     * this data to the GPU. Can be shared between multiple Mesh objects.
     */
    get geometry(): Geometry;
    set geometry(value: Geometry);
    /**
     * To change mesh uv's, change its uvBuffer data and increment its _updateID.
     * @readonly
     */
    get uvBuffer(): Buffer;
    /**
     * To change mesh vertices, change its uvBuffer data and increment its _updateID.
     * Incrementing _updateID is optional because most of Mesh objects do it anyway.
     * @readonly
     */
    get verticesBuffer(): Buffer;
    /** Alias for {@link PIXI.Mesh#shader}. */
    set material(value: T);
    get material(): T;
    /**
     * The blend mode to be applied to the Mesh. Apply a value of
     * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
     * @default PIXI.BLEND_MODES.NORMAL;
     */
    set blendMode(value: BLEND_MODES);
    get blendMode(): BLEND_MODES;
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
     * @default false
     */
    set roundPixels(value: boolean);
    get roundPixels(): boolean;
    /**
     * The multiply tint applied to the Mesh. This is a hex value. A value of
     * `0xFFFFFF` will remove any tint effect.
     *
     * Null for non-MeshMaterial shaders
     * @default 0xFFFFFF
     */
    get tint(): ColorSource;
    set tint(value: ColorSource);
    /**
     * The tint color as a RGB integer
     * @ignore
     */
    get tintValue(): number;
    /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
    get texture(): Texture;
    set texture(value: Texture);
    /**
     * Standard renderer draw.
     * @param renderer - Instance to renderer.
     */
    protected _render(renderer: Renderer): void;
    /**
     * Standard non-batching way of rendering.
     * @param renderer - Instance to renderer.
     */
    protected _renderDefault(renderer: Renderer): void;
    /**
     * Rendering by using the Batch system.
     * @param renderer - Instance to renderer.
     */
    protected _renderToBatch(renderer: Renderer): void;
    /** Updates vertexData field based on transform and vertices. */
    calculateVertices(): void;
    /** Updates uv field based on from geometry uv's or batchUvs. */
    calculateUvs(): void;
    /**
     * Updates the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
     * there must be a aVertexPosition attribute present in the geometry for bounds to be calculated correctly.
     */
    protected _calculateBounds(): void;
    /**
     * Tests if a point is inside this mesh. Works only for PIXI.DRAW_MODES.TRIANGLES.
     * @param point - The point to test.
     * @returns - The result of the test.
     */
    containsPoint(point: IPointData): boolean;
    destroy(options?: IDestroyOptions | boolean): void;
    /** The maximum number of vertices to consider batchable. Generally, the complexity of the geometry. */
    static BATCHABLE_SIZE: number;
}
