import { Program } from '../shader/Program';
import { Shader } from '../shader/Shader';
import { UniformGroup } from '../shader/UniformGroup';
/**
 * Helper that generates batching multi-texture shader. Use it with your new BatchRenderer
 * @memberof PIXI
 */
export declare class BatchShaderGenerator {
    /** Reference to the vertex shader source. */
    vertexSrc: string;
    /** Reference to the fragment shader template. Must contain "%count%" and "%forloop%". */
    fragTemplate: string;
    programCache: {
        [key: number]: Program;
    };
    defaultGroupCache: {
        [key: number]: UniformGroup;
    };
    /**
     * @param vertexSrc - Vertex shader
     * @param fragTemplate - Fragment shader template
     */
    constructor(vertexSrc: string, fragTemplate: string);
    generateShader(maxTextures: number): Shader;
    generateSampleSrc(maxTextures: number): string;
}
