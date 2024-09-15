import { Texture } from "@pixi/core";
import { Mesh, MeshGeometry, MeshMaterial } from "@pixi/mesh";
class SimpleMesh extends Mesh {
  /**
   * @param texture - The texture to use
   * @param {Float32Array} [vertices] - if you want to specify the vertices
   * @param {Float32Array} [uvs] - if you want to specify the uvs
   * @param {Uint16Array} [indices] - if you want to specify the indices
   * @param drawMode - the drawMode, can be any of the Mesh.DRAW_MODES consts
   */
  constructor(texture = Texture.EMPTY, vertices, uvs, indices, drawMode) {
    const geometry = new MeshGeometry(vertices, uvs, indices);
    geometry.getBuffer("aVertexPosition").static = !1;
    const meshMaterial = new MeshMaterial(texture);
    super(geometry, meshMaterial, null, drawMode), this.autoUpdate = !0;
  }
  /**
   * Collection of vertices data.
   * @type {Float32Array}
   */
  get vertices() {
    return this.geometry.getBuffer("aVertexPosition").data;
  }
  set vertices(value) {
    this.geometry.getBuffer("aVertexPosition").data = value;
  }
  _render(renderer) {
    this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(), super._render(renderer);
  }
}
export {
  SimpleMesh
};
//# sourceMappingURL=SimpleMesh.mjs.map
