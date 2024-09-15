/**
 * maps premultiply flag and blendMode to adjusted blendMode
 * @memberof PIXI.utils
 * @type {Array<number[]>}
 */
export declare const premultiplyBlendMode: number[][];
/**
 * changes blendMode according to texture format
 * @memberof PIXI.utils
 * @function correctBlendMode
 * @param {number} blendMode - supposed blend mode
 * @param {boolean} premultiplied - whether source is premultiplied
 * @returns {number} true blend mode for this texture
 */
export declare function correctBlendMode(blendMode: number, premultiplied: boolean): number;
/**
 * @memberof PIXI.utils
 * @function premultiplyRgba
 * @deprecated since 7.2.0
 * @see PIXI.Color.premultiply
 * @param {Float32Array|number[]} rgb -
 * @param {number} alpha -
 * @param {Float32Array} [out] -
 * @param {boolean} [premultiply=true] -
 */
export declare function premultiplyRgba(rgb: Float32Array | number[], alpha: number, out?: Float32Array, premultiply?: boolean): Float32Array;
/**
 * @memberof PIXI.utils
 * @function premultiplyTint
 * @deprecated since 7.2.0
 * @see PIXI.Color.toPremultiplied
 * @param {number} tint -
 * @param {number} alpha -
 */
export declare function premultiplyTint(tint: number, alpha: number): number;
/**
 * @memberof PIXI.utils
 * @function premultiplyTintToRgba
 * @deprecated since 7.2.0
 * @see PIXI.Color.premultiply
 * @param {number} tint -
 * @param {number} alpha -
 * @param {Float32Array} [out] -
 * @param {boolean} [premultiply=true] -
 */
export declare function premultiplyTintToRgba(tint: number, alpha: number, out?: Float32Array, premultiply?: boolean): Float32Array;
