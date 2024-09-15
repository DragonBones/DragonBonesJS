import { WRAP_MODES } from "@pixi/core";
import { Mesh, MeshMaterial } from "@pixi/mesh";
import { RopeGeometry } from "./geometry/RopeGeometry.mjs";
class SimpleRope extends Mesh {
  /**
   * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
   * @param texture - The texture to use on the rope.
   * @param points - An array of {@link PIXI.Point} objects to construct this rope.
   * @param {number} textureScale - Optional. Positive values scale rope texture
   * keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
   * and downsampling here. If set to zero, texture will be stretched instead.
   */
  constructor(texture, points, textureScale = 0) {
    const ropeGeometry = new RopeGeometry(texture.height, points, textureScale), meshMaterial = new MeshMaterial(texture);
    textureScale > 0 && (texture.baseTexture.wrapMode = WRAP_MODES.REPEAT), super(ropeGeometry, meshMaterial), this.autoUpdate = !0;
  }
  _render(renderer) {
    const geometry = this.geometry;
    (this.autoUpdate || geometry._width !== this.shader.texture.height) && (geometry._width = this.shader.texture.height, geometry.update()), super._render(renderer);
  }
}
export {
  SimpleRope
};
//# sourceMappingURL=SimpleRope.mjs.map
