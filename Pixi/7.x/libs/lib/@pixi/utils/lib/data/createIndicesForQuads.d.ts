/**
 * Generic Mask Stack data structure
 * @memberof PIXI.utils
 * @function createIndicesForQuads
 * @param {number} size - Number of quads
 * @param {Uint16Array|Uint32Array} [outBuffer] - Buffer for output, length has to be `6 * size`
 * @returns {Uint16Array|Uint32Array} - Resulting index buffer
 */
export declare function createIndicesForQuads(size: number, outBuffer?: Uint16Array | Uint32Array | null): Uint16Array | Uint32Array;
