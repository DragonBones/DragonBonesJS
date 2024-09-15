"use strict";
var core = require("@pixi/core"), mesh = require("@pixi/mesh"), RopeGeometry = require("./geometry/RopeGeometry.js");
class SimpleRope extends mesh.Mesh {
  /**
   * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
   * @param texture - The texture to use on the rope.
   * @param points - An array of {@link PIXI.Point} objects to construct this rope.
   * @param {number} textureScale - Optional. Positive values scale rope texture
   * keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
   * and downsampling here. If set to zero, texture will be stretched instead.
   */
  constructor(texture, points, textureScale = 0) {
    const ropeGeometry = new RopeGeometry.RopeGeometry(texture.height, points, textureScale), meshMaterial = new mesh.MeshMaterial(texture);
    textureScale > 0 && (texture.baseTexture.wrapMode = core.WRAP_MODES.REPEAT), super(ropeGeometry, meshMaterial), this.autoUpdate = !0;
  }
  _render(renderer) {
    const geometry = this.geometry;
    (this.autoUpdate || geometry._width !== this.shader.texture.height) && (geometry._width = this.shader.texture.height, geometry.update()), super._render(renderer);
  }
}
exports.SimpleRope = SimpleRope;
//# sourceMappingURL=SimpleRope.js.map
