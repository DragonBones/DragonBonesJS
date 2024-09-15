import { Texture } from "@pixi/core";
import { SimplePlane } from "./SimplePlane.mjs";
const DEFAULT_BORDER_SIZE = 10;
class NineSlicePlane extends SimplePlane {
  /**
   * @param texture - The texture to use on the NineSlicePlane.
   * @param {number} [leftWidth=10] - size of the left vertical bar (A)
   * @param {number} [topHeight=10] - size of the top horizontal bar (C)
   * @param {number} [rightWidth=10] - size of the right vertical bar (B)
   * @param {number} [bottomHeight=10] - size of the bottom horizontal bar (D)
   */
  constructor(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
    super(Texture.WHITE, 4, 4), this._origWidth = texture.orig.width, this._origHeight = texture.orig.height, this._width = this._origWidth, this._height = this._origHeight, this._leftWidth = leftWidth ?? texture.defaultBorders?.left ?? DEFAULT_BORDER_SIZE, this._rightWidth = rightWidth ?? texture.defaultBorders?.right ?? DEFAULT_BORDER_SIZE, this._topHeight = topHeight ?? texture.defaultBorders?.top ?? DEFAULT_BORDER_SIZE, this._bottomHeight = bottomHeight ?? texture.defaultBorders?.bottom ?? DEFAULT_BORDER_SIZE, this.texture = texture;
  }
  textureUpdated() {
    this._textureID = this.shader.texture._updateID, this._refresh();
  }
  get vertices() {
    return this.geometry.getBuffer("aVertexPosition").data;
  }
  set vertices(value) {
    this.geometry.getBuffer("aVertexPosition").data = value;
  }
  /** Updates the horizontal vertices. */
  updateHorizontalVertices() {
    const vertices = this.vertices, scale = this._getMinScale();
    vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight * scale, vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight * scale, vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
  }
  /** Updates the vertical vertices. */
  updateVerticalVertices() {
    const vertices = this.vertices, scale = this._getMinScale();
    vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth * scale, vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth * scale, vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
  }
  /**
   * Returns the smaller of a set of vertical and horizontal scale of nine slice corners.
   * @returns Smaller number of vertical and horizontal scale.
   */
  _getMinScale() {
    const w = this._leftWidth + this._rightWidth, scaleW = this._width > w ? 1 : this._width / w, h = this._topHeight + this._bottomHeight, scaleH = this._height > h ? 1 : this._height / h;
    return Math.min(scaleW, scaleH);
  }
  /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value, this._refresh();
  }
  /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value, this._refresh();
  }
  /** The width of the left column. */
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(value) {
    this._leftWidth = value, this._refresh();
  }
  /** The width of the right column. */
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(value) {
    this._rightWidth = value, this._refresh();
  }
  /** The height of the top row. */
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(value) {
    this._topHeight = value, this._refresh();
  }
  /** The height of the bottom row. */
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(value) {
    this._bottomHeight = value, this._refresh();
  }
  /** Refreshes NineSlicePlane coords. All of them. */
  _refresh() {
    const texture = this.texture, uvs = this.geometry.buffers[1].data;
    this._origWidth = texture.orig.width, this._origHeight = texture.orig.height;
    const _uvw = 1 / this._origWidth, _uvh = 1 / this._origHeight;
    uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0, uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0, uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1, uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1, uvs[2] = uvs[10] = uvs[18] = uvs[26] = _uvw * this._leftWidth, uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - _uvw * this._rightWidth, uvs[9] = uvs[11] = uvs[13] = uvs[15] = _uvh * this._topHeight, uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - _uvh * this._bottomHeight, this.updateHorizontalVertices(), this.updateVerticalVertices(), this.geometry.buffers[0].update(), this.geometry.buffers[1].update();
  }
}
export {
  NineSlicePlane
};
//# sourceMappingURL=NineSlicePlane.mjs.map
