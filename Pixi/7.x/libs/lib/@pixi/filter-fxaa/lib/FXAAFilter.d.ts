import { Filter } from '@pixi/core';
/**
 * Basic FXAA (Fast Approximate Anti-Aliasing) implementation based on the code on geeks3d.com
 * with the modification that the texture2DLod stuff was removed since it is unsupported by WebGL.
 * @see https://github.com/mitsuhiko/webgl-meincraft
 * @memberof PIXI
 */
export declare class FXAAFilter extends Filter {
    constructor();
}
