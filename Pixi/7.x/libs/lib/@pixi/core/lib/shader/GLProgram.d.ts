import type { Dict } from '@pixi/utils';
/**
 * @private
 */
export declare class IGLUniformData {
    location: WebGLUniformLocation;
    value: number | boolean | Float32Array | Int32Array | Uint32Array | boolean[];
}
/**
 * Helper class to create a WebGL Program
 * @memberof PIXI
 */
export declare class GLProgram {
    /** The shader program. */
    program: WebGLProgram;
    /**
     * Holds the uniform data which contains uniform locations
     * and current uniform values used for caching and preventing unneeded GPU commands.
     */
    uniformData: Dict<any>;
    /**
     * UniformGroups holds the various upload functions for the shader. Each uniform group
     * and program have a unique upload function generated.
     */
    uniformGroups: Dict<any>;
    /** A hash that stores where UBOs are bound to on the program. */
    uniformBufferBindings: Dict<any>;
    /** A hash for lazily-generated uniform uploading functions. */
    uniformSync: Dict<any>;
    /**
     * A place where dirty ticks are stored for groups
     * If a tick here does not match with the Higher level Programs tick, it means
     * we should re upload the data.
     */
    uniformDirtyGroups: Dict<any>;
    /**
     * Makes a new Pixi program.
     * @param program - webgl program
     * @param uniformData - uniforms
     */
    constructor(program: WebGLProgram, uniformData: {
        [key: string]: IGLUniformData;
    });
    /** Destroys this program. */
    destroy(): void;
}
