/**
 * CountLimiter limits the number of items handled by a {@link PIXI.BasePrepare} to a specified
 * number of items per frame.
 * @memberof PIXI
 */
export declare class CountLimiter {
    /** The maximum number of items that can be prepared each frame. */
    maxItemsPerFrame: number;
    /** The number of items that can be prepared in the current frame. */
    itemsLeft: number;
    /**
     * @param maxItemsPerFrame - The maximum number of items that can be prepared each frame.
     */
    constructor(maxItemsPerFrame: number);
    /** Resets any counting properties to start fresh on a new frame. */
    beginFrame(): void;
    /**
     * Checks to see if another item can be uploaded. This should only be called once per item.
     * @returns If the item is allowed to be uploaded.
     */
    allowedToUpload(): boolean;
}
