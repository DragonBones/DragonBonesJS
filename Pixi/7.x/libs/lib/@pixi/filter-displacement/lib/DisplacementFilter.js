"use strict";
var core = require("@pixi/core"), displacement$1 = require("./displacement.frag.js"), displacement = require("./displacement.vert.js");
class DisplacementFilter extends core.Filter {
  /**
   * @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
   * @param scale - The scale of the displacement
   */
  constructor(sprite, scale) {
    const maskMatrix = new core.Matrix();
    sprite.renderable = !1, super(displacement.default, displacement$1.default, {
      mapSampler: sprite._texture,
      filterMatrix: maskMatrix,
      scale: { x: 1, y: 1 },
      rotation: new Float32Array([1, 0, 0, 1])
    }), this.maskSprite = sprite, this.maskMatrix = maskMatrix, scale == null && (scale = 20), this.scale = new core.Point(scale, scale);
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - clearMode.
   */
  apply(filterManager, input, output, clearMode) {
    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
    const wt = this.maskSprite.worldTransform, lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b), lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
    lenX !== 0 && lenY !== 0 && (this.uniforms.rotation[0] = wt.a / lenX, this.uniforms.rotation[1] = wt.b / lenX, this.uniforms.rotation[2] = wt.c / lenY, this.uniforms.rotation[3] = wt.d / lenY), filterManager.applyFilter(this, input, output, clearMode);
  }
  /** The texture used for the displacement map. Must be power of 2 sized texture. */
  get map() {
    return this.uniforms.mapSampler;
  }
  set map(value) {
    this.uniforms.mapSampler = value;
  }
}
exports.DisplacementFilter = DisplacementFilter;
//# sourceMappingURL=DisplacementFilter.js.map
