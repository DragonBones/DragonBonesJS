import { Buffer } from '../geometry/Buffer';
import { Geometry } from '../geometry/Geometry';
/**
 * Geometry used to batch standard PIXI content (e.g. Mesh, Sprite, Graphics objects).
 * @memberof PIXI
 */
export declare class BatchGeometry extends Geometry {
    /**
     * Buffer used for position, color, texture IDs
     * @protected
     */
    _buffer: Buffer;
    /**
     * Index buffer data
     * @protected
     */
    _indexBuffer: Buffer;
    /**
     * @param {boolean} [_static=false] - Optimization flag, where `false`
     *        is updated every frame, `true` doesn't change frame-to-frame.
     */
    constructor(_static?: boolean);
}
