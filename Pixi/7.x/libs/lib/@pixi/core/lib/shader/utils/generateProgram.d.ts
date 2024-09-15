import { GLProgram } from '../GLProgram';
import type { IRenderingContext } from '../../IRenderer';
import type { Program } from '../Program';
/**
 * generates a WebGL Program object from a high level Pixi Program.
 * @param gl - a rendering context on which to generate the program
 * @param program - the high level Pixi Program.
 */
export declare function generateProgram(gl: IRenderingContext, program: Program): GLProgram;
