import { AlphaFilter } from '@pixi/filter-alpha';
import { BlurFilter, BlurFilterPass } from '@pixi/filter-blur';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import { DisplacementFilter } from '@pixi/filter-displacement';
import { FXAAFilter } from '@pixi/filter-fxaa';
import { NoiseFilter } from '@pixi/filter-noise';
/**
 * Filters namespace has been removed. All filters are now available directly from the root of the package.
 * @namespace PIXI.filters
 * @deprecated
 */
declare const filters: {
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.AlphaFilter
     */
    AlphaFilter: typeof AlphaFilter;
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.BlurFilter
     */
    BlurFilter: typeof BlurFilter;
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.BlurFilterPass
     */
    BlurFilterPass: typeof BlurFilterPass;
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.ColorMatrixFilter
     */
    ColorMatrixFilter: typeof ColorMatrixFilter;
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.DisplacementFilter
     */
    DisplacementFilter: typeof DisplacementFilter;
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.FXAAFilter
     */
    FXAAFilter: typeof FXAAFilter;
    /**
     * @class
     * @memberof PIXI.filters
     * @deprecated since 7.1.0
     * @see PIXI.NoiseFilter
     */
    NoiseFilter: typeof NoiseFilter;
};
export { filters };
