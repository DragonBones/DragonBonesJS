import type { Dict } from '@pixi/utils';
import type { IRenderingContext } from '../../IRenderer';
/**
 * @param {WebGLRenderingContext} gl - The current WebGL context
 * @param {*} attribs
 * @param {*} state
 * @private
 */
export declare function setVertexAttribArrays(gl: IRenderingContext, attribs: Dict<any>, state: Dict<any>): void;
