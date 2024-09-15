"use strict";
var core = require("@pixi/core");
class MeshGeometry extends core.Geometry {
  /**
   * @param {Float32Array|number[]} [vertices] - Positional data on geometry.
   * @param {Float32Array|number[]} [uvs] - Texture UVs.
   * @param {Uint16Array|number[]} [index] - IndexBuffer
   */
  constructor(vertices, uvs, index) {
    super();
    const verticesBuffer = new core.Buffer(vertices), uvsBuffer = new core.Buffer(uvs, !0), indexBuffer = new core.Buffer(index, !0, !0);
    this.addAttribute("aVertexPosition", verticesBuffer, 2, !1, core.TYPES.FLOAT).addAttribute("aTextureCoord", uvsBuffer, 2, !1, core.TYPES.FLOAT).addIndex(indexBuffer), this._updateId = -1;
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
exports.MeshGeometry = MeshGeometry;
//# sourceMappingURL=MeshGeometry.js.map
