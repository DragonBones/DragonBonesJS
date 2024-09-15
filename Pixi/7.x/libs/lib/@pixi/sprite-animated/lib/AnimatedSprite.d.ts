import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import type { IDestroyOptions } from '@pixi/display';
/**
 * An AnimatedSprite is a simple way to display an animation depicted by a list of textures.
 *
 * ```js
 * import { AnimatedSprite, Texture } from 'pixi.js';
 *
 * const alienImages = [
 *     'image_sequence_01.png',
 *     'image_sequence_02.png',
 *     'image_sequence_03.png',
 *     'image_sequence_04.png',
 * ];
 * const textureArray = [];
 *
 * for (let i = 0; i < 4; i++)
 * {
 *     const texture = Texture.from(alienImages[i]);
 *     textureArray.push(texture);
 * }
 *
 * const animatedSprite = new AnimatedSprite(textureArray);
 * ```
 *
 * The more efficient and simpler way to create an animated sprite is using a {@link PIXI.Spritesheet}
 * containing the animation definitions:
 * @example
 * import { AnimatedSprite, Assets } from 'pixi.js';
 *
 * const sheet = await Assets.load('assets/spritesheet.json');
 * animatedSprite = new AnimatedSprite(sheet.animations['image_sequence']);
 * @memberof PIXI
 */
export declare class AnimatedSprite extends Sprite {
    /**
     * The speed that the AnimatedSprite will play at. Higher is faster, lower is slower.
     * @default 1
     */
    animationSpeed: number;
    /**
     * Whether or not the animate sprite repeats after playing.
     * @default true
     */
    loop: boolean;
    /**
     * Update anchor to [Texture's defaultAnchor]{@link PIXI.Texture#defaultAnchor} when frame changes.
     *
     * Useful with [sprite sheet animations]{@link PIXI.Spritesheet#animations} created with tools.
     * Changing anchor for each frame allows to pin sprite origin to certain moving feature
     * of the frame (e.g. left foot).
     *
     * Note: Enabling this will override any previously set `anchor` on each frame change.
     * @default false
     */
    updateAnchor: boolean;
    /**
     * User-assigned function to call when an AnimatedSprite finishes playing.
     * @example
     * animation.onComplete = () => {
     *     // Finished!
     * };
     */
    onComplete?: () => void;
    /**
     * User-assigned function to call when an AnimatedSprite changes which texture is being rendered.
     * @example
     * animation.onFrameChange = () => {
     *     // Updated!
     * };
     */
    onFrameChange?: (currentFrame: number) => void;
    /**
     * User-assigned function to call when `loop` is true, and an AnimatedSprite is played and
     * loops around to start again.
     * @example
     * animation.onLoop = () => {
     *     // Looped!
     * };
     */
    onLoop?: () => void;
    private _playing;
    private _textures;
    private _durations;
    /**
     * `true` uses PIXI.Ticker.shared to auto update animation time.
     * @default true
     */
    private _autoUpdate;
    /**
     * `true` if the instance is currently connected to PIXI.Ticker.shared to auto update animation time.
     * @default false
     */
    private _isConnectedToTicker;
    /** Elapsed time since animation has been started, used internally to display current texture. */
    private _currentTime;
    /** The texture index that was displayed last time. */
    private _previousFrame;
    /**
     * @param textures - An array of {@link PIXI.Texture} or frame
     *  objects that make up the animation.
     * @param {boolean} [autoUpdate=true] - Whether to use Ticker.shared to auto update animation time.
     */
    constructor(textures: Texture[] | FrameObject[], autoUpdate?: boolean);
    /** Stops the AnimatedSprite. */
    stop(): void;
    /** Plays the AnimatedSprite. */
    play(): void;
    /**
     * Stops the AnimatedSprite and goes to a specific frame.
     * @param frameNumber - Frame index to stop at.
     */
    gotoAndStop(frameNumber: number): void;
    /**
     * Goes to a specific frame and begins playing the AnimatedSprite.
     * @param frameNumber - Frame index to start at.
     */
    gotoAndPlay(frameNumber: number): void;
    /**
     * Updates the object transform for rendering.
     * @param deltaTime - Time since last tick.
     */
    update(deltaTime: number): void;
    /** Updates the displayed texture to match the current frame index. */
    private updateTexture;
    /**
     * Stops the AnimatedSprite and destroys it.
     * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
     *  have been set to that value.
     * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy
     *      method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well.
     * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well.
     */
    destroy(options?: IDestroyOptions | boolean): void;
    /**
     * A short hand way of creating an AnimatedSprite from an array of frame ids.
     * @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
     * @returns - The new animated sprite with the specified frames.
     */
    static fromFrames(frames: string[]): AnimatedSprite;
    /**
     * A short hand way of creating an AnimatedSprite from an array of image ids.
     * @param images - The array of image urls the AnimatedSprite will use as its texture frames.
     * @returns The new animate sprite with the specified images as frames.
     */
    static fromImages(images: string[]): AnimatedSprite;
    /**
     * The total number of frames in the AnimatedSprite. This is the same as number of textures
     * assigned to the AnimatedSprite.
     * @readonly
     * @default 0
     */
    get totalFrames(): number;
    /** The array of textures used for this AnimatedSprite. */
    get textures(): Texture[] | FrameObject[];
    set textures(value: Texture[] | FrameObject[]);
    /** The AnimatedSprite's current frame index. */
    get currentFrame(): number;
    set currentFrame(value: number);
    /**
     * Indicates if the AnimatedSprite is currently playing.
     * @readonly
     */
    get playing(): boolean;
    /** Whether to use Ticker.shared to auto update animation time. */
    get autoUpdate(): boolean;
    set autoUpdate(value: boolean);
}
/** @memberof PIXI.AnimatedSprite */
export interface FrameObject {
    /** The {@link PIXI.Texture} of the frame. */
    texture: Texture;
    /** The duration of the frame, in milliseconds. */
    time: number;
}
