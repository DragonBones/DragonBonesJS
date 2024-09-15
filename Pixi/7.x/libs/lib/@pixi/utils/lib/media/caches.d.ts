import type { BaseTexture, Program, Texture } from '@pixi/core';
/**
 * @todo Describe property usage
 * @static
 * @name ProgramCache
 * @memberof PIXI.utils
 * @type {Record<string, Program>}
 */
export declare const ProgramCache: {
    [key: string]: Program;
};
/**
 * @todo Describe property usage
 * @static
 * @name TextureCache
 * @memberof PIXI.utils
 * @type {Record<string, Texture>}
 */
export declare const TextureCache: {
    [key: string]: Texture;
};
/**
 * @todo Describe property usage
 * @static
 * @name BaseTextureCache
 * @memberof PIXI.utils
 * @type {Record<string, BaseTexture>}
 */
export declare const BaseTextureCache: {
    [key: string]: BaseTexture;
};
/**
 * Destroys all texture in the cache
 * @memberof PIXI.utils
 * @function destroyTextureCache
 */
export declare function destroyTextureCache(): void;
/**
 * Removes all textures from cache, but does not destroy them
 * @memberof PIXI.utils
 * @function clearTextureCache
 */
export declare function clearTextureCache(): void;
