import { SAMPLER_TYPES } from '@pixi/constants';
/**
 * Returns a lookup table that maps each internal format to the compatible sampler type.
 * @memberof PIXI
 * @function mapInternalFormatToSamplerType
 * @private
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @returns Lookup table.
 */
export declare function mapInternalFormatToSamplerType(gl: WebGLRenderingContextBase): Record<number, SAMPLER_TYPES>;
