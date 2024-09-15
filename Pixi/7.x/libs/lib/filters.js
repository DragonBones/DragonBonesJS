"use strict";
var core = require("@pixi/core"), filterAlpha = require("@pixi/filter-alpha"), filterBlur = require("@pixi/filter-blur"), filterColorMatrix = require("@pixi/filter-color-matrix"), filterDisplacement = require("@pixi/filter-displacement"), filterFxaa = require("@pixi/filter-fxaa"), filterNoise = require("@pixi/filter-noise");
const filters = {
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.AlphaFilter
   */
  AlphaFilter: filterAlpha.AlphaFilter,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.BlurFilter
   */
  BlurFilter: filterBlur.BlurFilter,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.BlurFilterPass
   */
  BlurFilterPass: filterBlur.BlurFilterPass,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.ColorMatrixFilter
   */
  ColorMatrixFilter: filterColorMatrix.ColorMatrixFilter,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.DisplacementFilter
   */
  DisplacementFilter: filterDisplacement.DisplacementFilter,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.FXAAFilter
   */
  FXAAFilter: filterFxaa.FXAAFilter,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.NoiseFilter
   */
  NoiseFilter: filterNoise.NoiseFilter
};
Object.entries(filters).forEach(([key, FilterClass]) => {
  Object.defineProperty(filters, key, {
    get() {
      return core.utils.deprecation("7.1.0", `filters.${key} has moved to ${key}`), FilterClass;
    }
  });
});
exports.filters = filters;
//# sourceMappingURL=filters.js.map
