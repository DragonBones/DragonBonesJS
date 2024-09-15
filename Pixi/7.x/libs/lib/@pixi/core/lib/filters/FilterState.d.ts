import { MSAA_QUALITY } from '@pixi/constants';
import { Rectangle } from '@pixi/math';
import type { Matrix } from '@pixi/math';
import type { RenderTexture } from '../renderTexture/RenderTexture';
import type { Filter } from './Filter';
import type { IFilterTarget } from './IFilterTarget';
/**
 * System plugin to the renderer to manage filter states.
 * @ignore
 */
export declare class FilterState {
    renderTexture: RenderTexture;
    /**
     * Target of the filters
     * We store for case when custom filter wants to know the element it was applied on
     * @member {PIXI.DisplayObject}
     */
    target: IFilterTarget;
    /**
     * Compatibility with PixiJS v4 filters
     * @default false
     */
    legacy: boolean;
    /**
     * Resolution of filters
     * @default 1
     */
    resolution: number;
    /**
     * Number of samples
     * @default MSAA_QUALITY.NONE
     */
    multisample: MSAA_QUALITY;
    /** Source frame. */
    sourceFrame: Rectangle;
    /** Destination frame. */
    destinationFrame: Rectangle;
    /** Original render-target source frame. */
    bindingSourceFrame: Rectangle;
    /** Original render-target destination frame. */
    bindingDestinationFrame: Rectangle;
    /** Collection of filters. */
    filters: Array<Filter>;
    /** Projection system transform saved by link. */
    transform: Matrix;
    constructor();
    /** Clears the state */
    clear(): void;
}
