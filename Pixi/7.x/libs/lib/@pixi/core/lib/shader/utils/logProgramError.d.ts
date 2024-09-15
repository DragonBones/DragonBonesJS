/**
 *
 * logs out any program errors
 * @param gl - The current WebGL context
 * @param program - the WebGL program to display errors for
 * @param vertexShader  - the fragment WebGL shader program
 * @param fragmentShader - the vertex WebGL shader program
 */
export declare function logProgramError(gl: WebGLRenderingContext, program: WebGLProgram, vertexShader: WebGLShader, fragmentShader: WebGLShader): void;
