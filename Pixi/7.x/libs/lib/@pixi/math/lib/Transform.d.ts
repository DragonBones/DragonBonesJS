import { Matrix } from './Matrix';
import { ObservablePoint } from './ObservablePoint';
export interface Transform extends GlobalMixins.Transform {
}
/**
 * Transform that takes care about its versions.
 * @memberof PIXI
 */
export declare class Transform {
    /**
     * A default (identity) transform.
     * @static
     * @type {PIXI.Transform}
     */
    static readonly IDENTITY: Transform;
    /** The world transformation matrix. */
    worldTransform: Matrix;
    /** The local transformation matrix. */
    localTransform: Matrix;
    /** The coordinate of the object relative to the local coordinates of the parent. */
    position: ObservablePoint;
    /** The scale factor of the object. */
    scale: ObservablePoint;
    /** The pivot point of the displayObject that it rotates around. */
    pivot: ObservablePoint;
    /** The skew amount, on the x and y axis. */
    skew: ObservablePoint;
    /** The locally unique ID of the parent's world transform used to calculate the current world transformation matrix. */
    _parentID: number;
    /** The locally unique ID of the world transform. */
    _worldID: number;
    /** The rotation amount. */
    protected _rotation: number;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _sy: number;
    /** The locally unique ID of the local transform. */
    protected _localID: number;
    /** The locally unique ID of the local transform used to calculate the current local transformation matrix. */
    protected _currentLocalID: number;
    constructor();
    /** Called when a value changes. */
    protected onChange(): void;
    /** Called when the skew or the rotation changes. */
    protected updateSkew(): void;
    /** Updates the local transformation matrix. */
    updateLocalTransform(): void;
    /**
     * Updates the local and the world transformation matrices.
     * @param parentTransform - The parent transform
     */
    updateTransform(parentTransform: Transform): void;
    /**
     * Decomposes a matrix and sets the transforms properties based on it.
     * @param matrix - The matrix to decompose
     */
    setFromMatrix(matrix: Matrix): void;
    /** The rotation of the object in radians. */
    get rotation(): number;
    set rotation(value: number);
}
