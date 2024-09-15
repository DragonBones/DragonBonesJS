import { MeshGeometry } from "@pixi/mesh";
class PlaneGeometry extends MeshGeometry {
  /**
   * @param width - The width of the plane.
   * @param height - The height of the plane.
   * @param segWidth - Number of horizontal segments.
   * @param segHeight - Number of vertical segments.
   */
  constructor(width = 100, height = 100, segWidth = 10, segHeight = 10) {
    super(), this.segWidth = segWidth, this.segHeight = segHeight, this.width = width, this.height = height, this.build();
  }
  /**
   * Refreshes plane coordinates
   * @private
   */
  build() {
    const total = this.segWidth * this.segHeight, verts = [], uvs = [], indices = [], segmentsX = this.segWidth - 1, segmentsY = this.segHeight - 1, sizeX = this.width / segmentsX, sizeY = this.height / segmentsY;
    for (let i = 0; i < total; i++) {
      const x = i % this.segWidth, y = i / this.segWidth | 0;
      verts.push(x * sizeX, y * sizeY), uvs.push(x / segmentsX, y / segmentsY);
    }
    const totalSub = segmentsX * segmentsY;
    for (let i = 0; i < totalSub; i++) {
      const xpos = i % segmentsX, ypos = i / segmentsX | 0, value = ypos * this.segWidth + xpos, value2 = ypos * this.segWidth + xpos + 1, value3 = (ypos + 1) * this.segWidth + xpos, value4 = (ypos + 1) * this.segWidth + xpos + 1;
      indices.push(
        value,
        value2,
        value3,
        value2,
        value4,
        value3
      );
    }
    this.buffers[0].data = new Float32Array(verts), this.buffers[1].data = new Float32Array(uvs), this.indexBuffer.data = new Uint16Array(indices), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
  }
}
export {
  PlaneGeometry
};
//# sourceMappingURL=PlaneGeometry.mjs.map
