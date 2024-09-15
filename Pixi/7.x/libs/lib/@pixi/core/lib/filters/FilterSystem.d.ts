import { CLEAR_MODES, MSAA_QUALITY } from '@pixi/constants';
import { Matrix } from '@pixi/math';
import { RenderTexturePool } from '../renderTexture/RenderTexturePool';
import { UniformGroup } from '../shader/UniformGroup';
import { Quad } from '../utils/Quad';
import { QuadUv } from '../utils/QuadUv';
import { FilterState } from './FilterState';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { Renderer } from '../Renderer';
import type { RenderTexture } from '../renderTexture/RenderTexture';
import type { ISystem } from '../system/ISystem';
import type { Filter } from './Filter';
import type { IFilterTarget } from './IFilterTarget';
import type { ISpriteMaskTarget } from './spriteMask/SpriteMaskFilter';
/**
 * System plugin to the renderer to manage filters.
 *
 * ## Pipeline
 *
 * The FilterSystem executes the filtering pipeline by rendering the display-object into a texture, applying its
 * [filters]{@link PIXI.Filter} in series, and the last filter outputs into the final render-target.
 *
 * The filter-frame is the rectangle in world space being filtered, and those contents are mapped into
 * `(0, 0, filterFrame.width, filterFrame.height)` into the filter render-texture. The filter-frame is also called
 * the source-frame, as it is used to bind the filter render-textures. The last filter outputs to the `filterFrame`
 * in the final render-target.
 *
 * ## Usage
 *
 * {@link PIXI.Container#renderAdvanced} is an example of how to use the filter system. It is a 3 step process:
 *
 * **push**: Use {@link PIXI.FilterSystem#push} to push the set of filters to be applied on a filter-target.
 * **render**: Render the contents to be filtered using the renderer. The filter-system will only capture the contents
 *      inside the bounds of the filter-target. NOTE: Using {@link PIXI.Renderer#render} is
 *      illegal during an existing render cycle, and it may reset the filter system.
 * **pop**: Use {@link PIXI.FilterSystem#pop} to pop & execute the filters you initially pushed. It will apply them
 *      serially and output to the bounds of the filter-target.
 * @memberof PIXI
 */
export declare class FilterSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * List of filters for the FilterSystem
     * @member {object[]}
     */
    readonly defaultFilterStack: Array<FilterState>;
    /** A pool for storing filter states, save us creating new ones each tick. */
    statePool: Array<FilterState>;
    /** Stores a bunch of POT textures used for filtering. */
    texturePool: RenderTexturePool;
    /** Whether to clear output renderTexture in AUTO/BLIT mode. See {@link PIXI.CLEAR_MODES}. */
    forceClear: boolean;
    /**
     * Old padding behavior is to use the max amount instead of sum padding.
     * Use this flag if you need the old behavior.
     * @default false
     */
    useMaxPadding: boolean;
    /** A very simple geometry used when drawing a filter effect to the screen. */
    protected quad: Quad;
    /** Quad UVs */
    protected quadUv: QuadUv;
    /**
     * Active state
     * @member {object}
     */
    protected activeState: FilterState;
    /**
     * This uniform group is attached to filter uniforms when used.
     * @property {PIXI.Rectangle} outputFrame -
     * @property {Float32Array} inputSize -
     * @property {Float32Array} inputPixel -
     * @property {Float32Array} inputClamp -
     * @property {number} resolution -
     * @property {Float32Array} filterArea -
     * @property {Float32Array} filterClamp -
     */
    protected globalUniforms: UniformGroup;
    /** Temporary rect for math. */
    private tempRect;
    renderer: Renderer;
    /**
     * @param renderer - The renderer this System works for.
     */
    constructor(renderer: Renderer);
    init(): void;
    /**
     * Pushes a set of filters to be applied later to the system. This will redirect further rendering into an
     * input render-texture for the rest of the filtering pipeline.
     * @param {PIXI.DisplayObject} target - The target of the filter to render.
     * @param filters - The filters to apply.
     */
    push(target: IFilterTarget, filters: Array<Filter>): void;
    /** Pops off the filter and applies it. */
    pop(): void;
    /**
     * Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.
     * @param filterTexture - renderTexture to bind, should belong to filter pool or filter stack
     * @param clearMode - clearMode, by default its CLEAR/YES. See {@link PIXI.CLEAR_MODES}
     */
    bindAndClear(filterTexture: RenderTexture, clearMode?: CLEAR_MODES): void;
    /**
     * Draws a filter using the default rendering process.
     *
     * This should be called only by {@link PIXI.Filter#apply}.
     * @param filter - The filter to draw.
     * @param input - The input render target.
     * @param output - The target to output to.
     * @param clearMode - Should the output be cleared before rendering to it
     */
    applyFilter(filter: Filter, input: RenderTexture, output: RenderTexture, clearMode?: CLEAR_MODES): void;
    /**
     * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
     *
     * Use `outputMatrix * vTextureCoord` in the shader.
     * @param outputMatrix - The matrix to output to.
     * @param {PIXI.Sprite} sprite - The sprite to map to.
     * @returns The mapped matrix.
     */
    calculateSpriteMatrix(outputMatrix: Matrix, sprite: ISpriteMaskTarget): Matrix;
    /** Destroys this Filter System. */
    destroy(): void;
    /**
     * Gets a Power-of-Two render texture or fullScreen texture
     * @param minWidth - The minimum width of the render texture in real pixels.
     * @param minHeight - The minimum height of the render texture in real pixels.
     * @param resolution - The resolution of the render texture.
     * @param multisample - Number of samples of the render texture.
     * @returns - The new render texture.
     */
    protected getOptimalFilterTexture(minWidth: number, minHeight: number, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
    /**
     * Gets extra render texture to use inside current filter
     * To be compliant with older filters, you can use params in any order
     * @param input - renderTexture from which size and resolution will be copied
     * @param resolution - override resolution of the renderTexture
     * @param multisample - number of samples of the renderTexture
     */
    getFilterTexture(input?: RenderTexture, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
    /**
     * Frees a render texture back into the pool.
     * @param renderTexture - The renderTarget to free
     */
    returnFilterTexture(renderTexture: RenderTexture): void;
    /** Empties the texture pool. */
    emptyPool(): void;
    /** Calls `texturePool.resize()`, affects fullScreen renderTextures. */
    resize(): void;
    /**
     * @param matrix - first param
     * @param rect - second param
     */
    private transformAABB;
    private roundFrame;
}
