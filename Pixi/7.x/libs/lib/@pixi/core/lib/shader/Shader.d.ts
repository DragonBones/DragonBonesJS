import { Runner } from '@pixi/runner';
import { Program } from './Program';
import { UniformGroup } from './UniformGroup';
import type { Dict } from '@pixi/utils';
/**
 * A helper class for shaders.
 * @memberof PIXI
 */
export declare class Shader {
    /** Program that the shader uses. */
    program: Program;
    uniformGroup: UniformGroup;
    /**
     * Used internally to bind uniform buffer objects.
     * @ignore
     */
    uniformBindCount: number;
    disposeRunner: Runner;
    /**
     * @param program - The program the shader will use.
     * @param uniforms - Custom uniforms to use to augment the built-in ones.
     */
    constructor(program: Program, uniforms?: Dict<any>);
    checkUniformExists(name: string, group: UniformGroup): boolean;
    destroy(): void;
    /**
     * Shader uniform values, shortcut for `uniformGroup.uniforms`.
     * @readonly
     */
    get uniforms(): Dict<any>;
    /**
     * A short hand function to create a shader based of a vertex and fragment shader.
     * @param vertexSrc - The source of the vertex shader.
     * @param fragmentSrc - The source of the fragment shader.
     * @param uniforms - Custom uniforms to use to augment the built-in ones.
     * @returns A shiny new PixiJS shader!
     */
    static from(vertexSrc?: string, fragmentSrc?: string, uniforms?: Dict<any>): Shader;
}
