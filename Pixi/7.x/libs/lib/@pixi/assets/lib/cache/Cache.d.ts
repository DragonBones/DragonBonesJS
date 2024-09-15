import type { CacheParser } from './CacheParser';
/**
 * A single Cache for all assets.
 *
 * When assets are added to the cache via set they normally are added to the cache as key-value pairs.
 *
 * With this cache, you can add parsers that will take the object and convert it to a list of assets that can be cached.
 * for example a cacheSprite Sheet parser will add all of the textures found within its sprite sheet directly to the cache.
 *
 * This gives devs the flexibility to cache any type of object however we want.
 *
 * It is not intended that this class is created by developers - it is part of the Asset package.
 * This is the first major system of PixiJS' main Assets class.
 * @memberof PIXI
 * @class Cache
 */
declare class CacheClass {
    private _parsers;
    private readonly _cache;
    private readonly _cacheMap;
    /** Clear all entries. */
    reset(): void;
    /**
     * Check if the key exists
     * @param key - The key to check
     */
    has(key: string): boolean;
    /**
     * Fetch entry by key
     * @param key - The key of the entry to get
     */
    get<T = any>(key: string): T;
    /**
     * Set a value by key or keys name
     * @param key - The key or keys to set
     * @param value - The value to store in the cache or from which cacheable assets will be derived.
     */
    set(key: string | string[], value: unknown): void;
    /**
     * Remove entry by key
     *
     * This function will also remove any associated alias from the cache also.
     * @param key - The key of the entry to remove
     */
    remove(key: string): void;
    /** All loader parsers registered */
    get parsers(): CacheParser[];
}
export declare const Cache: CacheClass;
export {};
