import { BLEND_MODES } from '@pixi/constants';
/**
 * This is a WebGL state, and is is passed to {@link PIXI.StateSystem}.
 *
 * Each mesh rendered may require WebGL to be in a different state.
 * For example you may want different blend mode or to enable polygon offsets
 * @memberof PIXI
 */
export declare class State {
    data: number;
    _blendMode: BLEND_MODES;
    _polygonOffset: number;
    constructor();
    /**
     * Activates blending of the computed fragment color values.
     * @default true
     */
    get blend(): boolean;
    set blend(value: boolean);
    /**
     * Activates adding an offset to depth values of polygon's fragments
     * @default false
     */
    get offsets(): boolean;
    set offsets(value: boolean);
    /**
     * Activates culling of polygons.
     * @default false
     */
    get culling(): boolean;
    set culling(value: boolean);
    /**
     * Activates depth comparisons and updates to the depth buffer.
     * @default false
     */
    get depthTest(): boolean;
    set depthTest(value: boolean);
    /**
     * Enables or disables writing to the depth buffer.
     * @default true
     */
    get depthMask(): boolean;
    set depthMask(value: boolean);
    /**
     * Specifies whether or not front or back-facing polygons can be culled.
     * @default false
     */
    get clockwiseFrontFace(): boolean;
    set clockwiseFrontFace(value: boolean);
    /**
     * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
     * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
     * @default PIXI.BLEND_MODES.NORMAL
     */
    get blendMode(): BLEND_MODES;
    set blendMode(value: BLEND_MODES);
    /**
     * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
     * @default 0
     */
    get polygonOffset(): number;
    set polygonOffset(value: number);
    static for2d(): State;
}
