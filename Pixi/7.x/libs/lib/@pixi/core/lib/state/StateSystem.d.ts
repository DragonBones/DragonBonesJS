import { BLEND_MODES } from '@pixi/constants';
import { State } from './State';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { ISystem } from '../system/ISystem';
/**
 * System plugin to the renderer to manage WebGL state machines.
 * @memberof PIXI
 */
export declare class StateSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * State ID
     * @readonly
     */
    stateId: number;
    /**
     * Polygon offset
     * @readonly
     */
    polygonOffset: number;
    /**
     * Blend mode
     * @default PIXI.BLEND_MODES.NONE
     * @readonly
     */
    blendMode: BLEND_MODES | -1;
    /** Whether current blend equation is different */
    protected _blendEq: boolean;
    /**
     * GL context
     * @member {WebGLRenderingContext}
     * @readonly
     */
    protected gl: IRenderingContext;
    protected blendModes: number[][];
    /**
     * Collection of calls
     * @member {Function[]}
     */
    protected readonly map: Array<(value: boolean) => void>;
    /**
     * Collection of check calls
     * @member {Function[]}
     */
    protected readonly checks: Array<(system: this, state: State) => void>;
    /**
     * Default WebGL State
     * @readonly
     */
    protected defaultState: State;
    constructor();
    contextChange(gl: IRenderingContext): void;
    /**
     * Sets the current state
     * @param {*} state - The state to set.
     */
    set(state: State): void;
    /**
     * Sets the state, when previous state is unknown.
     * @param {*} state - The state to set
     */
    forceState(state: State): void;
    /**
     * Sets whether to enable or disable blending.
     * @param value - Turn on or off WebGl blending.
     */
    setBlend(value: boolean): void;
    /**
     * Sets whether to enable or disable polygon offset fill.
     * @param value - Turn on or off webgl polygon offset testing.
     */
    setOffset(value: boolean): void;
    /**
     * Sets whether to enable or disable depth test.
     * @param value - Turn on or off webgl depth testing.
     */
    setDepthTest(value: boolean): void;
    /**
     * Sets whether to enable or disable depth mask.
     * @param value - Turn on or off webgl depth mask.
     */
    setDepthMask(value: boolean): void;
    /**
     * Sets whether to enable or disable cull face.
     * @param {boolean} value - Turn on or off webgl cull face.
     */
    setCullFace(value: boolean): void;
    /**
     * Sets the gl front face.
     * @param {boolean} value - true is clockwise and false is counter-clockwise
     */
    setFrontFace(value: boolean): void;
    /**
     * Sets the blend mode.
     * @param {number} value - The blend mode to set to.
     */
    setBlendMode(value: number): void;
    /**
     * Sets the polygon offset.
     * @param {number} value - the polygon offset
     * @param {number} scale - the polygon offset scale
     */
    setPolygonOffset(value: number, scale: number): void;
    /** Resets all the logic and disables the VAOs. */
    reset(): void;
    /**
     * Checks to see which updates should be checked based on which settings have been activated.
     *
     * For example, if blend is enabled then we should check the blend modes each time the state is changed
     * or if polygon fill is activated then we need to check if the polygon offset changes.
     * The idea is that we only check what we have too.
     * @param func - the checking function to add or remove
     * @param value - should the check function be added or removed.
     */
    updateCheck(func: (system: this, state: State) => void, value: boolean): void;
    /**
     * A private little wrapper function that we call to check the blend mode.
     * @param system - the System to perform the state check on
     * @param state - the state that the blendMode will pulled from
     */
    private static checkBlendMode;
    /**
     * A private little wrapper function that we call to check the polygon offset.
     * @param system - the System to perform the state check on
     * @param state - the state that the blendMode will pulled from
     */
    private static checkPolygonOffset;
    /**
     * @ignore
     */
    destroy(): void;
}
