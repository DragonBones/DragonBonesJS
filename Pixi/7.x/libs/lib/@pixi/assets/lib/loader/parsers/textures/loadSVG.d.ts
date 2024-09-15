import type { IBaseTextureOptions, Texture } from '@pixi/core';
import type { LoaderParser } from '../LoaderParser';
/**
 * Loads SVG's into Textures.
 * @memberof PIXI
 */
export declare const loadSVG: LoaderParser<string | Texture<import("@pixi/core").Resource>, IBaseTextureOptions<any>, Record<string, any>>;
