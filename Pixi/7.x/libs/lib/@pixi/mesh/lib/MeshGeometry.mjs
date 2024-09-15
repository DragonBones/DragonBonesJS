import { Geometry, Buffer, TYPES } from "@pixi/core";
class MeshGeometry extends Geometry {
  /**
   * @param {Float32Array|number[]} [vertices] - Positional data on geometry.
   * @param {Float32Array|number[]} [uvs] - Texture UVs.
   * @param {Uint16Array|number[]} [index] - IndexBuffer
   */
  constructor(vertices, uvs, index) {
    super();
    const verticesBuffer = new Buffer(vertices), uvsBuffer = new Buffer(uvs, !0), indexBuffer = new Buffer(index, !0, !0);
    this.addAttribute("aVertexPosition", verticesBuffer, 2, !1, TYPES.FLOAT).addAttribute("aTextureCoord", uvsBuffer, 2, !1, TYPES.FLOAT).addIndex(indexBuffer), this._updateId = -1;
  }
  /**
   * If the vertex position is updated.
   * @readonly
   * @private
   */
  get vertexDirtyId() {
    return this.buffers[0]._updateID;
  }
}
export {
  MeshGeometry
};
//# sourceMappingURL=MeshGeometry.mjs.map
