import type { DRAW_MODES } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { Program } from '../shader/Program';
import type { Shader } from '../shader/Shader';
import type { ISystem } from '../system/ISystem';
import type { Geometry } from './Geometry';
import type { GLBuffer } from './GLBuffer';
/**
 * System plugin to the renderer to manage geometry.
 * @memberof PIXI
 */
export declare class GeometrySystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * `true` if we has `*_vertex_array_object` extension.
     * @readonly
     */
    hasVao: boolean;
    /**
     * `true` if has `ANGLE_instanced_arrays` extension.
     * @readonly
     */
    hasInstance: boolean;
    /**
     * `true` if support `gl.UNSIGNED_INT` in `gl.drawElements` or `gl.drawElementsInstanced`.
     * @readonly
     */
    canUseUInt32ElementIndex: boolean;
    protected CONTEXT_UID: number;
    protected gl: IRenderingContext;
    protected _activeGeometry: Geometry;
    protected _activeVao: WebGLVertexArrayObject;
    protected _boundBuffer: GLBuffer;
    /** Cache for all geometries by id, used in case renderer gets destroyed or for profiling. */
    readonly managedGeometries: {
        [key: number]: Geometry;
    };
    /** Renderer that owns this {@link GeometrySystem}. */
    private renderer;
    /** @param renderer - The renderer this System works for. */
    constructor(renderer: Renderer);
    /** Sets up the renderer context and necessary buffers. */
    protected contextChange(): void;
    /**
     * Binds geometry so that is can be drawn. Creating a Vao if required
     * @param geometry - Instance of geometry to bind.
     * @param shader - Instance of shader to use vao for.
     */
    bind(geometry?: Geometry, shader?: Shader): void;
    /** Reset and unbind any active VAO and geometry. */
    reset(): void;
    /** Update buffers of the currently bound geometry. */
    updateBuffers(): void;
    /**
     * Check compatibility between a geometry and a program
     * @param geometry - Geometry instance.
     * @param program - Program instance.
     */
    protected checkCompatibility(geometry: Geometry, program: Program): void;
    /**
     * Takes a geometry and program and generates a unique signature for them.
     * @param geometry - To get signature from.
     * @param program - To test geometry against.
     * @returns - Unique signature of the geometry and program
     */
    protected getSignature(geometry: Geometry, program: Program): string;
    /**
     * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
     * If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
     * attribute locations.
     * @param geometry - Instance of geometry to to generate Vao for.
     * @param shader - Instance of the shader.
     * @param incRefCount - Increment refCount of all geometry buffers.
     */
    protected initGeometryVao(geometry: Geometry, shader: Shader, incRefCount?: boolean): WebGLVertexArrayObject;
    /**
     * Disposes geometry.
     * @param geometry - Geometry with buffers. Only VAO will be disposed
     * @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
     */
    disposeGeometry(geometry: Geometry, contextLost?: boolean): void;
    /**
     * Dispose all WebGL resources of all managed geometries.
     * @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
     */
    disposeAll(contextLost?: boolean): void;
    /**
     * Activate vertex array object.
     * @param geometry - Geometry instance.
     * @param program - Shader program instance.
     */
    protected activateVao(geometry: Geometry, program: Program): void;
    /**
     * Draws the currently bound geometry.
     * @param type - The type primitive to render.
     * @param size - The number of elements to be rendered. If not specified, all vertices after the
     *  starting vertex will be drawn.
     * @param start - The starting vertex in the geometry to start drawing from. If not specified,
     *  drawing will start from the first vertex.
     * @param instanceCount - The number of instances of the set of elements to execute. If not specified,
     *  all instances will be drawn.
     */
    draw(type: DRAW_MODES, size?: number, start?: number, instanceCount?: number): this;
    /** Unbind/reset everything. */
    protected unbind(): void;
    destroy(): void;
}
