import { Rectangle } from '@pixi/math';
import { RenderTexture } from './RenderTexture';
import type { MSAA_QUALITY } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderableObject, IRenderer } from '../IRenderer';
import type { ISystem } from '../system/ISystem';
import type { IBaseTextureOptions } from '../textures/BaseTexture';
export interface IGenerateTextureOptions extends IBaseTextureOptions {
    /**
     * The region of the displayObject, that shall be rendered,
     * if no region is specified, defaults to the local bounds of the displayObject.
     */
    region?: Rectangle;
    /** The resolution / device pixel ratio of the texture being generated. The default is the renderer's resolution. */
    resolution?: number;
    /** The number of samples of the frame buffer. The default is the renderer's multisample. */
    multisample?: MSAA_QUALITY;
}
/**
 * System that manages the generation of textures from the renderer.
 * @memberof PIXI
 */
export declare class GenerateTextureSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    renderer: IRenderer;
    private readonly _tempMatrix;
    constructor(renderer: IRenderer);
    /**
     * A Useful function that returns a texture of the display object that can then be used to create sprites
     * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
     * @param displayObject - The displayObject the object will be generated from.
     * @param {IGenerateTextureOptions} options - Generate texture options.
     * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
     *        if no region is specified, defaults to the local bounds of the displayObject.
     * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
     * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
     * @returns a shiny new texture of the display object passed in
     */
    generateTexture(displayObject: IRenderableObject, options?: IGenerateTextureOptions): RenderTexture;
    destroy(): void;
}
