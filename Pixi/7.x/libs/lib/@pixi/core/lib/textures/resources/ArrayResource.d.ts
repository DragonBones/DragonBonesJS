import { AbstractMultiResource } from './AbstractMultiResource';
import type { ISize } from '@pixi/math';
import type { Renderer } from '../../Renderer';
import type { BaseTexture } from '../BaseTexture';
import type { GLTexture } from '../GLTexture';
/**
 * A resource that contains a number of sources.
 * @memberof PIXI
 */
export declare class ArrayResource extends AbstractMultiResource {
    /**
     * @param source - Number of items in array or the collection
     *        of image URLs to use. Can also be resources, image elements, canvas, etc.
     * @param options - Options to apply to {@link PIXI.autoDetectResource}
     * @param {number} [options.width] - Width of the resource
     * @param {number} [options.height] - Height of the resource
     */
    constructor(source: number | Array<any>, options?: ISize);
    /**
     * Set a baseTexture by ID,
     * ArrayResource just takes resource from it, nothing more
     * @param baseTexture
     * @param index - Zero-based index of resource to set
     * @returns - Instance for chaining
     */
    addBaseTextureAt(baseTexture: BaseTexture, index: number): this;
    /**
     * Add binding
     * @param baseTexture
     */
    bind(baseTexture: BaseTexture): void;
    /**
     * Upload the resources to the GPU.
     * @param renderer
     * @param texture
     * @param glTexture
     * @returns - whether texture was uploaded
     */
    upload(renderer: Renderer, texture: BaseTexture, glTexture: GLTexture): boolean;
}
