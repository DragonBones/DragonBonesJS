import { BaseTexture } from '../BaseTexture';
import { Resource } from './Resource';
import type { ISize } from '@pixi/math';
import type { IAutoDetectOptions } from './autoDetectResource';
/**
 * Resource that can manage several resource (items) inside.
 * All resources need to have the same pixel size.
 * Parent class for CubeResource and ArrayResource
 * @memberof PIXI
 */
export declare abstract class AbstractMultiResource extends Resource {
    /** Number of elements in array. */
    readonly length: number;
    /**
     * Collection of partial baseTextures that correspond to resources.
     * @readonly
     */
    items: Array<BaseTexture>;
    /**
     * Dirty IDs for each part.
     * @readonly
     */
    itemDirtyIds: Array<number>;
    /**
     * Promise when loading.
     * @default null
     */
    private _load;
    /** Bound baseTexture, there can only be one. */
    baseTexture: BaseTexture;
    /**
     * @param length
     * @param options - Options to for Resource constructor
     * @param {number} [options.width] - Width of the resource
     * @param {number} [options.height] - Height of the resource
     */
    constructor(length: number, options?: ISize);
    /**
     * Used from ArrayResource and CubeResource constructors.
     * @param resources - Can be resources, image elements, canvas, etc. ,
     *  length should be same as constructor length
     * @param options - Detect options for resources
     */
    protected initFromArray(resources: Array<any>, options?: IAutoDetectOptions): void;
    /** Destroy this BaseImageResource. */
    dispose(): void;
    /**
     * Set a baseTexture by ID
     * @param baseTexture
     * @param index - Zero-based index of resource to set
     * @returns - Instance for chaining
     */
    abstract addBaseTextureAt(baseTexture: BaseTexture, index: number): this;
    /**
     * Set a resource by ID
     * @param resource
     * @param index - Zero-based index of resource to set
     * @returns - Instance for chaining
     */
    addResourceAt(resource: Resource, index: number): this;
    /**
     * Set the parent base texture.
     * @param baseTexture
     */
    bind(baseTexture: BaseTexture): void;
    /**
     * Unset the parent base texture.
     * @param baseTexture
     */
    unbind(baseTexture: BaseTexture): void;
    /**
     * Load all the resources simultaneously
     * @returns - When load is resolved
     */
    load(): Promise<this>;
}
