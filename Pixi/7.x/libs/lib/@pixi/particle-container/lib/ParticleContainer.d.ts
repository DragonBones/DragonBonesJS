import { BLEND_MODES } from '@pixi/core';
import { Container } from '@pixi/display';
import type { BaseTexture, ColorSource, Renderer } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
import type { Sprite } from '@pixi/sprite';
import type { ParticleBuffer } from './ParticleBuffer';
export interface IParticleProperties {
    vertices?: boolean;
    position?: boolean;
    rotation?: boolean;
    uvs?: boolean;
    tint?: boolean;
    alpha?: boolean;
    scale?: boolean;
}
/**
 * The ParticleContainer class is a really fast version of the Container built solely for speed,
 * so use when you need a lot of sprites or particles.
 *
 * The tradeoff of the ParticleContainer is that most advanced functionality will not work.
 * ParticleContainer implements the basic object transform (position, scale, rotation)
 * and some advanced functionality like tint (as of v4.5.6).
 *
 * Other more advanced functionality like masking, children, filters, etc will not work on sprites in this batch.
 *
 * It's extremely easy to use. And here you have a hundred sprites that will be rendered at the speed of light.
 * @example
 * import { ParticleContainer, Sprite } from 'pixi.js';
 *
 * const container = new ParticleContainer();
 *
 * for (let i = 0; i < 100; ++i)
 * {
 *     let sprite = Sprite.from('myImage.png');
 *     container.addChild(sprite);
 * }
 * @memberof PIXI
 */
export declare class ParticleContainer<T extends Sprite = Sprite> extends Container<T> {
    /**
     * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL`
     * to reset the blend mode.
     * @default PIXI.BLEND_MODES.NORMAL
     */
    blendMode: BLEND_MODES;
    /**
     * If true, container allocates more batches in case there are more than `maxSize` particles.
     * @default false
     */
    autoResize: boolean;
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     * Default to true here as performance is usually the priority for particles.
     * @default true
     */
    roundPixels: boolean;
    /**
     * The texture used to render the children.
     * @readonly
     */
    baseTexture: BaseTexture;
    tintRgb: Float32Array;
    /** @private */
    _maxSize: number;
    /** @private */
    _buffers: ParticleBuffer[];
    /** @private */
    _batchSize: number;
    /**
     * Set properties to be dynamic (true) / static (false).
     * @private
     */
    _properties: boolean[];
    /**
     * For every batch, stores _updateID corresponding to the last change in that batch.
     * @private
     */
    _bufferUpdateIDs: number[];
    /**
     * When child inserted, removed or changes position this number goes up.
     * @private
     */
    _updateID: number;
    /**
     * The tint applied to the container.
     * This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     * @default 0xFFFFFF
     */
    private _tintColor;
    /**
     * @param maxSize - The maximum number of particles that can be rendered by the container.
     *  Affects size of allocated buffers.
     * @param properties - The properties of children that should be uploaded to the gpu and applied.
     * @param {boolean} [properties.vertices=false] - When true, vertices be uploaded and applied.
     *                  if sprite's ` scale/anchor/trim/frame/orig` is dynamic, please set `true`.
     * @param {boolean} [properties.position=true] - When true, position be uploaded and applied.
     * @param {boolean} [properties.rotation=false] - When true, rotation be uploaded and applied.
     * @param {boolean} [properties.uvs=false] - When true, uvs be uploaded and applied.
     * @param {boolean} [properties.tint=false] - When true, alpha and tint be uploaded and applied.
     * @param {number} [batchSize=16384] - Number of particles per batch. If less than maxSize, it uses maxSize instead.
     * @param {boolean} [autoResize=false] - If true, container allocates more batches in case
     *  there are more than `maxSize` particles.
     */
    constructor(maxSize?: number, properties?: IParticleProperties, batchSize?: number, autoResize?: boolean);
    /**
     * Sets the private properties array to dynamic / static based on the passed properties object
     * @param properties - The properties to be uploaded
     */
    setProperties(properties: IParticleProperties): void;
    updateTransform(): void;
    /**
     * The tint applied to the container. This is a hex value.
     * A value of 0xFFFFFF will remove any tint effect.
     * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
     * @default 0xFFFFFF
     */
    get tint(): ColorSource;
    set tint(value: ColorSource);
    /**
     * Renders the container using the WebGL renderer.
     * @param renderer - The WebGL renderer.
     */
    render(renderer: Renderer): void;
    /**
     * Set the flag that static data should be updated to true
     * @param smallestChildIndex - The smallest child index.
     */
    protected onChildrenChange(smallestChildIndex: number): void;
    dispose(): void;
    /**
     * Destroys the container
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their
     *  destroy method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the texture of the child sprite
     * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the base texture of the child sprite
     */
    destroy(options?: IDestroyOptions | boolean): void;
}
