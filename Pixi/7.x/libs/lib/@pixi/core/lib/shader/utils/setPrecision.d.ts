import { PRECISION } from '@pixi/constants';
/**
 * Sets the float precision on the shader, ensuring the device supports the request precision.
 * If the precision is already present, it just ensures that the device is able to handle it.
 * @private
 * @param {string} src - The shader source
 * @param {PIXI.PRECISION} requestedPrecision - The request float precision of the shader.
 * @param {PIXI.PRECISION} maxSupportedPrecision - The maximum precision the shader supports.
 * @returns {string} modified shader source
 */
export declare function setPrecision(src: string, requestedPrecision: PRECISION, maxSupportedPrecision: PRECISION): string;
