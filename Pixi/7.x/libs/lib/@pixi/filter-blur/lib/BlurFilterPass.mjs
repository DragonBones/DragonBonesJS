import { Filter, CLEAR_MODES } from "@pixi/core";
import { generateBlurFragSource } from "./generateBlurFragSource.mjs";
import { generateBlurVertSource } from "./generateBlurVertSource.mjs";
class BlurFilterPass extends Filter {
  /**
   * @param horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
   * @param strength - The strength of the blur filter.
   * @param quality - The quality of the blur filter.
   * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
   * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
   */
  constructor(horizontal, strength = 8, quality = 4, resolution = Filter.defaultResolution, kernelSize = 5) {
    const vertSrc = generateBlurVertSource(kernelSize, horizontal), fragSrc = generateBlurFragSource(kernelSize);
    super(
      // vertex shader
      vertSrc,
      // fragment shader
      fragSrc
    ), this.horizontal = horizontal, this.resolution = resolution, this._quality = 0, this.quality = quality, this.blur = strength;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(filterManager, input, output, clearMode) {
    if (output ? this.horizontal ? this.uniforms.strength = 1 / output.width * (output.width / input.width) : this.uniforms.strength = 1 / output.height * (output.height / input.height) : this.horizontal ? this.uniforms.strength = 1 / filterManager.renderer.width * (filterManager.renderer.width / input.width) : this.uniforms.strength = 1 / filterManager.renderer.height * (filterManager.renderer.height / input.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, this.passes === 1)
      filterManager.applyFilter(this, input, output, clearMode);
    else {
      const renderTarget = filterManager.getFilterTexture(), renderer = filterManager.renderer;
      let flip = input, flop = renderTarget;
      this.state.blend = !1, filterManager.applyFilter(this, flip, flop, CLEAR_MODES.CLEAR);
      for (let i = 1; i < this.passes - 1; i++) {
        filterManager.bindAndClear(flip, CLEAR_MODES.BLIT), this.uniforms.uSampler = flop;
        const temp = flop;
        flop = flip, flip = temp, renderer.shader.bind(this), renderer.geometry.draw(5);
      }
      this.state.blend = !0, filterManager.applyFilter(this, flop, output, clearMode), filterManager.returnFilterTexture(renderTarget);
    }
  }
  /**
   * Sets the strength of both the blur.
   * @default 16
   */
  get blur() {
    return this.strength;
  }
  set blur(value) {
    this.padding = 1 + Math.abs(value) * 2, this.strength = value;
  }
  /**
   * Sets the quality of the blur by modifying the number of passes. More passes means higher
   * quality bluring but the lower the performance.
   * @default 4
   */
  get quality() {
    return this._quality;
  }
  set quality(value) {
    this._quality = value, this.passes = value;
  }
}
export {
  BlurFilterPass
};
//# sourceMappingURL=BlurFilterPass.mjs.map
