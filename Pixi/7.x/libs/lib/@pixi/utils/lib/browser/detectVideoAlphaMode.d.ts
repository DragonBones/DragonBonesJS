import { ALPHA_MODES } from '@pixi/constants';
/**
 * Helper for detecting the correct alpha mode for video textures.
 * For some reason, some browsers/devices/WebGL implementations premultiply the alpha
 * of a video before and then a second time if `UNPACK_PREMULTIPLY_ALPHA_WEBGL`
 * is true. So the video is premultiplied twice if the alpha mode is `UNPACK`.
 * In this case we need the alpha mode to be `PMA`. This function detects
 * the upload behavior by uploading a white 2x2 webm with 50% alpha
 * without `UNPACK_PREMULTIPLY_ALPHA_WEBGL` and then checking whether
 * the uploaded pixels are premultiplied.
 * @memberof PIXI.utils
 * @function detectVideoAlphaMode
 * @returns {Promise<PIXI.ALPHA_MODES>} The correct alpha mode for video textures.
 */
export declare function detectVideoAlphaMode(): Promise<ALPHA_MODES>;
