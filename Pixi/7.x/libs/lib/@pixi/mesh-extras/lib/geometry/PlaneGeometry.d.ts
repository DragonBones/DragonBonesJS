import { MeshGeometry } from '@pixi/mesh';
/**
 * @memberof PIXI
 */
export declare class PlaneGeometry extends MeshGeometry {
    segWidth: number;
    segHeight: number;
    width: number;
    height: number;
    /**
     * @param width - The width of the plane.
     * @param height - The height of the plane.
     * @param segWidth - Number of horizontal segments.
     * @param segHeight - Number of vertical segments.
     */
    constructor(width?: number, height?: number, segWidth?: number, segHeight?: number);
    /**
     * Refreshes plane coordinates
     * @private
     */
    build(): void;
}
