"use strict";
var Buffer = require("../geometry/Buffer.js"), Geometry = require("../geometry/Geometry.js");
class QuadUv extends Geometry.Geometry {
  constructor() {
    super(), this.vertices = new Float32Array([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1
    ]), this.uvs = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ]), this.vertexBuffer = new Buffer.Buffer(this.vertices), this.uvBuffer = new Buffer.Buffer(this.uvs), this.addAttribute("aVertexPosition", this.vertexBuffer).addAttribute("aTextureCoord", this.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]);
  }
  /**
   * Maps two Rectangle to the quad.
   * @param targetTextureFrame - The first rectangle
   * @param destinationFrame - The second rectangle
   * @returns - Returns itself.
   */
  map(targetTextureFrame, destinationFrame) {
    let x = 0, y = 0;
    return this.uvs[0] = x, this.uvs[1] = y, this.uvs[2] = x + destinationFrame.width / targetTextureFrame.width, this.uvs[3] = y, this.uvs[4] = x + destinationFrame.width / targetTextureFrame.width, this.uvs[5] = y + destinationFrame.height / targetTextureFrame.height, this.uvs[6] = x, this.uvs[7] = y + destinationFrame.height / targetTextureFrame.height, x = destinationFrame.x, y = destinationFrame.y, this.vertices[0] = x, this.vertices[1] = y, this.vertices[2] = x + destinationFrame.width, this.vertices[3] = y, this.vertices[4] = x + destinationFrame.width, this.vertices[5] = y + destinationFrame.height, this.vertices[6] = x, this.vertices[7] = y + destinationFrame.height, this.invalidate(), this;
  }
  /**
   * Legacy upload method, just marks buffers dirty.
   * @returns - Returns itself.
   */
  invalidate() {
    return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
  }
}
exports.QuadUv = QuadUv;
//# sourceMappingURL=QuadUv.js.map
