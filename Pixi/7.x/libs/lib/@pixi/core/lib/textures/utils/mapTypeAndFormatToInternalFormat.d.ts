/**
 * Returns a lookup table that maps each type-format pair to a compatible internal format.
 * @memberof PIXI
 * @function mapTypeAndFormatToInternalFormat
 * @private
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @returns Lookup table.
 */
export declare function mapTypeAndFormatToInternalFormat(gl: WebGLRenderingContextBase): {
    [type: number]: {
        [format: number]: number;
    };
};
