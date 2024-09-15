import { Texture } from '@pixi/core';
import type { Matrix } from '@pixi/core';
/**
 * Fill style object for Graphics.
 * @memberof PIXI
 */
export declare class FillStyle {
    /**
     * The hex color value used when coloring the Graphics object.
     * @default 0xFFFFFF
     */
    color: number;
    /** The alpha value used when filling the Graphics object. */
    alpha: number;
    /**
     * The texture to be used for the fill.
     * @default 0
     */
    texture: Texture;
    /**
     * The transform applied to the texture.
     * @default null
     */
    matrix: Matrix;
    /** If the current fill is visible. */
    visible: boolean;
    constructor();
    /** Clones the object */
    clone(): FillStyle;
    /** Reset */
    reset(): void;
    /** Destroy and don't use after this. */
    destroy(): void;
}
