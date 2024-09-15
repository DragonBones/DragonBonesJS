/**
 * TimeLimiter limits the number of items handled by a {@link PIXI.BasePrepare} to a specified
 * number of milliseconds per frame.
 * @memberof PIXI
 */
export declare class TimeLimiter {
    /** The maximum milliseconds that can be spent preparing items each frame. */
    maxMilliseconds: number;
    /**
     * The start time of the current frame.
     * @readonly
     */
    frameStart: number;
    /** @param maxMilliseconds - The maximum milliseconds that can be spent preparing items each frame. */
    constructor(maxMilliseconds: number);
    /** Resets any counting properties to start fresh on a new frame. */
    beginFrame(): void;
    /**
     * Checks to see if another item can be uploaded. This should only be called once per item.
     * @returns - If the item is allowed to be uploaded.
     */
    allowedToUpload(): boolean;
}
