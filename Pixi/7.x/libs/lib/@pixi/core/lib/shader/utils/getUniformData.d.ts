import type { IUniformData } from '../Program';
/**
 * returns the uniform data from the program
 * @private
 * @param program - the webgl program
 * @param gl - the WebGL context
 * @returns {object} the uniform data for this program
 */
export declare function getUniformData(program: WebGLProgram, gl: WebGLRenderingContextBase): {
    [key: string]: IUniformData;
};
