export interface DecomposedDataUri {
    mediaType?: string;
    subType?: string;
    charset?: string;
    encoding?: string;
    data?: string;
}
/**
 * @memberof PIXI.utils
 * @interface DecomposedDataUri
 */
/**
 * type, eg. `image`
 * @memberof PIXI.utils.DecomposedDataUri#
 * @member {string} mediaType
 */
/**
 * Sub type, eg. `png`
 * @memberof PIXI.utils.DecomposedDataUri#
 * @member {string} subType
 */
/**
 * @memberof PIXI.utils.DecomposedDataUri#
 * @member {string} charset
 */
/**
 * Data encoding, eg. `base64`
 * @memberof PIXI.utils.DecomposedDataUri#
 * @member {string} encoding
 */
/**
 * The actual data
 * @memberof PIXI.utils.DecomposedDataUri#
 * @member {string} data
 */
/**
 * Split a data URI into components. Returns undefined if
 * parameter `dataUri` is not a valid data URI.
 * @memberof PIXI.utils
 * @function decomposeDataUri
 * @param {string} dataUri - the data URI to check
 * @returns {PIXI.utils.DecomposedDataUri|undefined} The decomposed data uri or undefined
 */
export declare function decomposeDataUri(dataUri: string): DecomposedDataUri | undefined;
