"use strict";
var mesh = require("@pixi/mesh");
class RopeGeometry extends mesh.MeshGeometry {
  /**
   * @param width - The width (i.e., thickness) of the rope.
   * @param points - An array of {@link PIXI.Point} objects to construct this rope.
   * @param textureScale - By default the rope texture will be stretched to match
   *     rope length. If textureScale is positive this value will be treated as a scaling
   *     factor and the texture will preserve its aspect ratio instead. To create a tiling rope
   *     set baseTexture.wrapMode to {@link PIXI.WRAP_MODES.REPEAT} and use a power of two texture,
   *     then set textureScale=1 to keep the original texture pixel size.
   *     In order to reduce alpha channel artifacts provide a larger texture and downsample -
   *     i.e. set textureScale=0.5 to scale it down twice.
   */
  constructor(width = 200, points, textureScale = 0) {
    super(
      new Float32Array(points.length * 4),
      new Float32Array(points.length * 4),
      new Uint16Array((points.length - 1) * 6)
    ), this.points = points, this._width = width, this.textureScale = textureScale, this.build();
  }
  /**
   * The width (i.e., thickness) of the rope.
   * @readonly
   */
  get width() {
    return this._width;
  }
  /** Refreshes Rope indices and uvs */
  build() {
    const points = this.points;
    if (!points)
      return;
    const vertexBuffer = this.getBuffer("aVertexPosition"), uvBuffer = this.getBuffer("aTextureCoord"), indexBuffer = this.getIndex();
    if (points.length < 1)
      return;
    vertexBuffer.data.length / 4 !== points.length && (vertexBuffer.data = new Float32Array(points.length * 4), uvBuffer.data = new Float32Array(points.length * 4), indexBuffer.data = new Uint16Array((points.length - 1) * 6));
    const uvs = uvBuffer.data, indices = indexBuffer.data;
    uvs[0] = 0, uvs[1] = 0, uvs[2] = 0, uvs[3] = 1;
    let amount = 0, prev = points[0];
    const textureWidth = this._width * this.textureScale, total = points.length;
    for (let i = 0; i < total; i++) {
      const index = i * 4;
      if (this.textureScale > 0) {
        const dx = prev.x - points[i].x, dy = prev.y - points[i].y, distance = Math.sqrt(dx * dx + dy * dy);
        prev = points[i], amount += distance / textureWidth;
      } else
        amount = i / (total - 1);
      uvs[index] = amount, uvs[index + 1] = 0, uvs[index + 2] = amount, uvs[index + 3] = 1;
    }
    let indexCount = 0;
    for (let i = 0; i < total - 1; i++) {
      const index = i * 2;
      indices[indexCount++] = index, indices[indexCount++] = index + 1, indices[indexCount++] = index + 2, indices[indexCount++] = index + 2, indices[indexCount++] = index + 1, indices[indexCount++] = index + 3;
    }
    uvBuffer.update(), indexBuffer.update(), this.updateVertices();
  }
  /** refreshes vertices of Rope mesh */
  updateVertices() {
    const points = this.points;
    if (points.length < 1)
      return;
    let lastPoint = points[0], nextPoint, perpX = 0, perpY = 0;
    const vertices = this.buffers[0].data, total = points.length, halfWidth = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
    for (let i = 0; i < total; i++) {
      const point = points[i], index = i * 4;
      i < points.length - 1 ? nextPoint = points[i + 1] : nextPoint = point, perpY = -(nextPoint.x - lastPoint.x), perpX = nextPoint.y - lastPoint.y;
      let ratio = (1 - i / (total - 1)) * 10;
      ratio > 1 && (ratio = 1);
      const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
      perpLength < 1e-6 ? (perpX = 0, perpY = 0) : (perpX /= perpLength, perpY /= perpLength, perpX *= halfWidth, perpY *= halfWidth), vertices[index] = point.x + perpX, vertices[index + 1] = point.y + perpY, vertices[index + 2] = point.x - perpX, vertices[index + 3] = point.y - perpY, lastPoint = point;
    }
    this.buffers[0].update();
  }
  update() {
    this.textureScale > 0 ? this.build() : this.updateVertices();
  }
}
exports.RopeGeometry = RopeGeometry;
//# sourceMappingURL=RopeGeometry.js.map
