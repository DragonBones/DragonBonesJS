"use strict";
var core = require("@pixi/core"), noise = require("./noise.frag.js");
class NoiseFilter extends core.Filter {
  /**
   * @param {number} [noise=0.5] - The noise intensity, should be a normalized value in the range [0, 1].
   * @param {number} [seed] - A random seed for the noise generation. Default is `Math.random()`.
   */
  constructor(noise$1 = 0.5, seed = Math.random()) {
    super(core.defaultFilterVertex, noise.default, {
      uNoise: 0,
      uSeed: 0
    }), this.noise = noise$1, this.seed = seed;
  }
  /**
   * The amount of noise to apply, this value should be in the range (0, 1].
   * @default 0.5
   */
  get noise() {
    return this.uniforms.uNoise;
  }
  set noise(value) {
    this.uniforms.uNoise = value;
  }
  /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
  get seed() {
    return this.uniforms.uSeed;
  }
  set seed(value) {
    this.uniforms.uSeed = value;
  }
}
exports.NoiseFilter = NoiseFilter;
//# sourceMappingURL=NoiseFilter.js.map
