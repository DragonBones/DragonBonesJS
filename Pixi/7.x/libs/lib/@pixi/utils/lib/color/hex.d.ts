/**
 * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
 * @memberof PIXI.utils
 * @function hex2rgb
 * @see PIXI.Color.toRgbArray
 * @deprecated since 7.2.0
 * @param {number} hex - The hexadecimal number to convert
 * @param  {number[]} [out=[]] - If supplied, this array will be used rather than returning a new one
 * @returns {number[]} An array representing the [R, G, B] of the color where all values are floats.
 */
export declare function hex2rgb(hex: number, out?: Array<number> | Float32Array): Array<number> | Float32Array;
/**
 * Converts a hexadecimal color number to a string.
 * @see PIXI.Color.toHex
 * @deprecated since 7.2.0
 * @memberof PIXI.utils
 * @function hex2string
 * @param {number} hex - Number in hex (e.g., `0xffffff`)
 * @returns {string} The string color (e.g., `"#ffffff"`).
 */
export declare function hex2string(hex: number): string;
/**
 * Converts a string to a hexadecimal color number.
 * @deprecated since 7.2.0
 * @see PIXI.Color.toNumber
 * @memberof PIXI.utils
 * @function string2hex
 * @param {string} string - The string color (e.g., `"#ffffff"`)
 * @returns {number} Number in hexadecimal.
 */
export declare function string2hex(string: string): number;
/**
 * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
 * @deprecated since 7.2.0
 * @see PIXI.Color.toNumber
 * @memberof PIXI.utils
 * @function rgb2hex
 * @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
 * @returns {number} Number in hexadecimal.
 */
export declare function rgb2hex(rgb: number[] | Float32Array): number;
