import { PRECISION } from '@pixi/constants';
import type { GLProgram } from './GLProgram';
export interface IAttributeData {
    type: string;
    size: number;
    location: number;
    name: string;
}
export interface IUniformData {
    index: number;
    type: string;
    size: number;
    isArray: boolean;
    value: any;
    name: string;
}
export interface IProgramExtraData {
    transformFeedbackVaryings?: {
        names: string[];
        bufferMode: 'separate' | 'interleaved';
    };
}
/**
 * Helper class to create a shader program.
 * @memberof PIXI
 */
export declare class Program {
    /**
     * Default specify float precision in vertex shader.
     * @static
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.HIGH
     */
    static defaultVertexPrecision: PRECISION;
    /**
     * Default specify float precision in fragment shader.
     * iOS is best set at highp due to https://github.com/pixijs/pixijs/issues/3742
     * @static
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.MEDIUM
     */
    static defaultFragmentPrecision: PRECISION;
    id: number;
    /** Source code for the vertex shader. */
    vertexSrc: string;
    /** Source code for the fragment shader. */
    fragmentSrc: string;
    nameCache: any;
    glPrograms: {
        [key: number]: GLProgram;
    };
    syncUniforms: any;
    /** Assigned when a program is first bound to the shader system. */
    attributeData: {
        [key: string]: IAttributeData;
    };
    /** Assigned when a program is first bound to the shader system. */
    uniformData: {
        [key: string]: IUniformData;
    };
    extra: IProgramExtraData;
    /**
     * @param vertexSrc - The source of the vertex shader.
     * @param fragmentSrc - The source of the fragment shader.
     * @param name - Name for shader
     * @param extra - Extra data for shader
     */
    constructor(vertexSrc?: string, fragmentSrc?: string, name?: string, extra?: IProgramExtraData);
    /**
     * The default vertex shader source.
     * @readonly
     */
    static get defaultVertexSrc(): string;
    /**
     * The default fragment shader source.
     * @readonly
     */
    static get defaultFragmentSrc(): string;
    /**
     * A short hand function to create a program based of a vertex and fragment shader.
     *
     * This method will also check to see if there is a cached program.
     * @param vertexSrc - The source of the vertex shader.
     * @param fragmentSrc - The source of the fragment shader.
     * @param name - Name for shader
     * @returns A shiny new PixiJS shader program!
     */
    static from(vertexSrc?: string, fragmentSrc?: string, name?: string): Program;
}
