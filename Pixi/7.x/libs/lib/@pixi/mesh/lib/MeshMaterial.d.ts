import { Program, Shader, TextureMatrix } from '@pixi/core';
import type { ColorSource, Texture, utils } from '@pixi/core';
export interface IMeshMaterialOptions {
    alpha?: number;
    tint?: ColorSource;
    pluginName?: string;
    program?: Program;
    uniforms?: utils.Dict<unknown>;
}
export interface MeshMaterial extends GlobalMixins.MeshMaterial {
}
/**
 * Slightly opinionated default shader for PixiJS 2D objects.
 * @memberof PIXI
 */
export declare class MeshMaterial extends Shader {
    /**
     * TextureMatrix instance for this Mesh, used to track Texture changes.
     * @readonly
     */
    readonly uvMatrix: TextureMatrix;
    /**
     * `true` if shader can be batch with the renderer's batch system.
     * @default true
     */
    batchable: boolean;
    /**
     * Renderer plugin for batching.
     * @default 'batch'
     */
    pluginName: string;
    _tintRGB: number;
    /**
     * Only do update if tint or alpha changes.
     * @private
     * @default false
     */
    private _colorDirty;
    private _alpha;
    private _tintColor;
    /**
     * @param uSampler - Texture that material uses to render.
     * @param options - Additional options
     * @param {number} [options.alpha=1] - Default alpha.
     * @param {PIXI.ColorSource} [options.tint=0xFFFFFF] - Default tint.
     * @param {string} [options.pluginName='batch'] - Renderer plugin for batching.
     * @param {PIXI.Program} [options.program=0xFFFFFF] - Custom program.
     * @param {object} [options.uniforms] - Custom uniforms.
     */
    constructor(uSampler: Texture, options?: IMeshMaterialOptions);
    /** Reference to the texture being rendered. */
    get texture(): Texture;
    set texture(value: Texture);
    /**
     * This gets automatically set by the object using this.
     * @default 1
     */
    set alpha(value: number);
    get alpha(): number;
    /**
     * Multiply tint for the material.
     * @default 0xFFFFFF
     */
    set tint(value: ColorSource);
    get tint(): ColorSource;
    /**
     * Get the internal number from tint color
     * @ignore
     */
    get tintValue(): number;
    /** Gets called automatically by the Mesh. Intended to be overridden for custom {@link PIXI.MeshMaterial} objects. */
    update(): void;
}
