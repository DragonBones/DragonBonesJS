"use strict";
var core = require("@pixi/core"), mesh = require("@pixi/mesh"), PlaneGeometry = require("./geometry/PlaneGeometry.js");
class SimplePlane extends mesh.Mesh {
  /**
   * @param texture - The texture to use on the SimplePlane.
   * @param verticesX - The number of vertices in the x-axis
   * @param verticesY - The number of vertices in the y-axis
   */
  constructor(texture, verticesX, verticesY) {
    const planeGeometry = new PlaneGeometry.PlaneGeometry(texture.width, texture.height, verticesX, verticesY), meshMaterial = new mesh.MeshMaterial(core.Texture.WHITE);
    super(planeGeometry, meshMaterial), this.texture = texture, this.autoResize = !0;
  }
  /**
   * Method used for overrides, to do something in case texture frame was changed.
   * Meshes based on plane can override it and change more details based on texture.
   */
  textureUpdated() {
    this._textureID = this.shader.texture._updateID;
    const geometry = this.geometry, { width, height } = this.shader.texture;
    this.autoResize && (geometry.width !== width || geometry.height !== height) && (geometry.width = this.shader.texture.width, geometry.height = this.shader.texture.height, geometry.build());
  }
  set texture(value) {
    this.shader.texture !== value && (this.shader.texture = value, this._textureID = -1, value.baseTexture.valid ? this.textureUpdated() : value.once("update", this.textureUpdated, this));
  }
  get texture() {
    return this.shader.texture;
  }
  _render(renderer) {
    this._textureID !== this.shader.texture._updateID && this.textureUpdated(), super._render(renderer);
  }
  destroy(options) {
    this.shader.texture.off("update", this.textureUpdated, this), super.destroy(options);
  }
}
exports.SimplePlane = SimplePlane;
//# sourceMappingURL=SimplePlane.js.map
