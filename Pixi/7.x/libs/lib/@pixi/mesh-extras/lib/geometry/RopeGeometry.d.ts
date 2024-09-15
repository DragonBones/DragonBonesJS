import { MeshGeometry } from '@pixi/mesh';
import type { IPoint } from '@pixi/core';
/**
 * RopeGeometry allows you to draw a geometry across several points and then manipulate these points.
 * @example
 * import { Point, RopeGeometry } from 'pixi.js';
 *
 * for (let i = 0; i < 20; i++) {
 *     points.push(new Point(i * 50, 0));
 * };
 * const rope = new RopeGeometry(100, points);
 * @memberof PIXI
 */
export declare class RopeGeometry extends MeshGeometry {
    /** An array of points that determine the rope. */
    points: IPoint[];
    /** Rope texture scale, if zero then the rope texture is stretched. */
    readonly textureScale: number;
    /**
     * The width (i.e., thickness) of the rope.
     * @readonly
     */
    _width: number;
    /**
     * @param width - The width (i.e., thickness) of the rope.
     * @param points - An array of {@link PIXI.Point} objects to construct this rope.
     * @param textureScale - By default the rope texture will be stretched to match
     *     rope length. If textureScale is positive this value will be treated as a scaling
     *     factor and the texture will preserve its aspect ratio instead. To create a tiling rope
     *     set baseTexture.wrapMode to {@link PIXI.WRAP_MODES.REPEAT} and use a power of two texture,
     *     then set textureScale=1 to keep the original texture pixel size.
     *     In order to reduce alpha channel artifacts provide a larger texture and downsample -
     *     i.e. set textureScale=0.5 to scale it down twice.
     */
    constructor(width: number, points: IPoint[], textureScale?: number);
    /**
     * The width (i.e., thickness) of the rope.
     * @readonly
     */
    get width(): number;
    /** Refreshes Rope indices and uvs */
    private build;
    /** refreshes vertices of Rope mesh */
    updateVertices(): void;
    update(): void;
}
