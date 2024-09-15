/**
 * Not all platforms allow to generate function code (e.g., `new Function`).
 * this provides the platform-level detection.
 * @private
 * @returns {boolean} `true` if `new Function` is supported.
 */
export declare function unsafeEvalSupported(): boolean;
