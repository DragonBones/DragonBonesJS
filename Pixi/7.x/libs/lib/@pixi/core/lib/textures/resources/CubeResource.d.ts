import { AbstractMultiResource } from './AbstractMultiResource';
import type { ISize } from '@pixi/math';
import type { ArrayFixed } from '@pixi/utils';
import type { Renderer } from '../../Renderer';
import type { BaseTexture } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
import type { Resource } from './Resource';
/**
 * Constructor options for CubeResource.
 * @memberof PIXI
 */
export interface ICubeResourceOptions extends ISize {
    /** Whether to auto-load resources */
    autoLoad?: boolean;
    /** In case BaseTextures are supplied, whether to copy them or use. */
    linkBaseTexture?: boolean;
}
/**
 * Resource for a CubeTexture which contains six resources.
 * @memberof PIXI
 */
export declare class CubeResource extends AbstractMultiResource {
    items: ArrayFixed<BaseTexture, 6>;
    /**
     * In case BaseTextures are supplied, whether to use same resource or bind baseTexture itself.
     * @protected
     */
    linkBaseTexture: boolean;
    /**
     * @param {Array<string|PIXI.Resource>} [source] - Collection of URLs or resources
     *        to use as the sides of the cube.
     * @param options - ImageResource options
     * @param {number} [options.width] - Width of resource
     * @param {number} [options.height] - Height of resource
     * @param {number} [options.autoLoad=true] - Whether to auto-load resources
     * @param {number} [options.linkBaseTexture=true] - In case BaseTextures are supplied,
     *   whether to copy them or use
     */
    constructor(source?: ArrayFixed<string | Resource, 6>, options?: ICubeResourceOptions);
    /**
     * Add binding.
     * @param baseTexture - parent base texture
     */
    bind(baseTexture: BaseTexture): void;
    addBaseTextureAt(baseTexture: BaseTexture, index: number, linkBaseTexture?: boolean): this;
    /**
     * Upload the resource
     * @param renderer
     * @param _baseTexture
     * @param glTexture
     * @returns {boolean} true is success
     */
    upload(renderer: Renderer, _baseTexture: BaseTexture, glTexture: GLTexture): boolean;
    /** Number of texture sides to store for CubeResources. */
    static SIDES: number;
    /**
     * Used to auto-detect the type of resource.
     * @param {*} source - The source object
     * @returns {boolean} `true` if source is an array of 6 elements
     */
    static test(source: unknown): source is ArrayFixed<string | Resource, 6>;
}
