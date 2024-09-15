"use strict";
var core = require("@pixi/core"), display = require("@pixi/display"), MeshBatchUvs = require("./MeshBatchUvs.js");
const tempPoint = new core.Point(), tempPolygon = new core.Polygon(), _Mesh = class _Mesh2 extends display.Container {
  /**
   * @param geometry - The geometry the mesh will use.
   * @param {PIXI.MeshMaterial} shader - The shader the mesh will use.
   * @param state - The state that the WebGL context is required to be in to render the mesh
   *        if no state is provided, uses {@link PIXI.State.for2d} to create a 2D state for PixiJS.
   * @param drawMode - The drawMode, can be any of the {@link PIXI.DRAW_MODES} constants.
   */
  constructor(geometry, shader, state, drawMode = core.DRAW_MODES.TRIANGLES) {
    super(), this.geometry = geometry, this.shader = shader, this.state = state || core.State.for2d(), this.drawMode = drawMode, this.start = 0, this.size = 0, this.uvs = null, this.indices = null, this.vertexData = new Float32Array(1), this.vertexDirty = -1, this._transformID = -1, this._roundPixels = core.settings.ROUND_PIXELS, this.batchUvs = null;
  }
  /**
   * Includes vertex positions, face indices, normals, colors, UVs, and
   * custom attributes within buffers, reducing the cost of passing all
   * this data to the GPU. Can be shared between multiple Mesh objects.
   */
  get geometry() {
    return this._geometry;
  }
  set geometry(value) {
    this._geometry !== value && (this._geometry && (this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose()), this._geometry = value, this._geometry && this._geometry.refCount++, this.vertexDirty = -1);
  }
  /**
   * To change mesh uv's, change its uvBuffer data and increment its _updateID.
   * @readonly
   */
  get uvBuffer() {
    return this.geometry.buffers[1];
  }
  /**
   * To change mesh vertices, change its uvBuffer data and increment its _updateID.
   * Incrementing _updateID is optional because most of Mesh objects do it anyway.
   * @readonly
   */
  get verticesBuffer() {
    return this.geometry.buffers[0];
  }
  /** Alias for {@link PIXI.Mesh#shader}. */
  set material(value) {
    this.shader = value;
  }
  get material() {
    return this.shader;
  }
  /**
   * The blend mode to be applied to the Mesh. Apply a value of
   * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
   * @default PIXI.BLEND_MODES.NORMAL;
   */
  set blendMode(value) {
    this.state.blendMode = value;
  }
  get blendMode() {
    return this.state.blendMode;
  }
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
   * @default false
   */
  set roundPixels(value) {
    this._roundPixels !== value && (this._transformID = -1), this._roundPixels = value;
  }
  get roundPixels() {
    return this._roundPixels;
  }
  /**
   * The multiply tint applied to the Mesh. This is a hex value. A value of
   * `0xFFFFFF` will remove any tint effect.
   *
   * Null for non-MeshMaterial shaders
   * @default 0xFFFFFF
   */
  get tint() {
    return "tint" in this.shader ? this.shader.tint : null;
  }
  set tint(value) {
    this.shader.tint = value;
  }
  /**
   * The tint color as a RGB integer
   * @ignore
   */
  get tintValue() {
    return this.shader.tintValue;
  }
  /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
  get texture() {
    return "texture" in this.shader ? this.shader.texture : null;
  }
  set texture(value) {
    this.shader.texture = value;
  }
  /**
   * Standard renderer draw.
   * @param renderer - Instance to renderer.
   */
  _render(renderer) {
    const vertices = this.geometry.buffers[0].data;
    this.shader.batchable && this.drawMode === core.DRAW_MODES.TRIANGLES && vertices.length < _Mesh2.BATCHABLE_SIZE * 2 ? this._renderToBatch(renderer) : this._renderDefault(renderer);
  }
  /**
   * Standard non-batching way of rendering.
   * @param renderer - Instance to renderer.
   */
  _renderDefault(renderer) {
    const shader = this.shader;
    shader.alpha = this.worldAlpha, shader.update && shader.update(), renderer.batch.flush(), shader.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0), renderer.shader.bind(shader), renderer.state.set(this.state), renderer.geometry.bind(this.geometry, shader), renderer.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
  }
  /**
   * Rendering by using the Batch system.
   * @param renderer - Instance to renderer.
   */
  _renderToBatch(renderer) {
    const geometry = this.geometry, shader = this.shader;
    shader.uvMatrix && (shader.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = geometry.indexBuffer.data, this._tintRGB = shader._tintRGB, this._texture = shader.texture;
    const pluginName = this.material.pluginName;
    renderer.batch.setObjectRenderer(renderer.plugins[pluginName]), renderer.plugins[pluginName].render(this);
  }
  /** Updates vertexData field based on transform and vertices. */
  calculateVertices() {
    const verticesBuffer = this.geometry.buffers[0], vertices = verticesBuffer.data, vertexDirtyId = verticesBuffer._updateID;
    if (vertexDirtyId === this.vertexDirty && this._transformID === this.transform._worldID)
      return;
    this._transformID = this.transform._worldID, this.vertexData.length !== vertices.length && (this.vertexData = new Float32Array(vertices.length));
    const wt = this.transform.worldTransform, a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty, vertexData = this.vertexData;
    for (let i = 0; i < vertexData.length / 2; i++) {
      const x = vertices[i * 2], y = vertices[i * 2 + 1];
      vertexData[i * 2] = a * x + c * y + tx, vertexData[i * 2 + 1] = b * x + d * y + ty;
    }
    if (this._roundPixels) {
      const resolution = core.settings.RESOLUTION;
      for (let i = 0; i < vertexData.length; ++i)
        vertexData[i] = Math.round(vertexData[i] * resolution) / resolution;
    }
    this.vertexDirty = vertexDirtyId;
  }
  /** Updates uv field based on from geometry uv's or batchUvs. */
  calculateUvs() {
    const geomUvs = this.geometry.buffers[1], shader = this.shader;
    shader.uvMatrix.isSimple ? this.uvs = geomUvs.data : (this.batchUvs || (this.batchUvs = new MeshBatchUvs.MeshBatchUvs(geomUvs, shader.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
  }
  /**
   * Updates the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
   * there must be a aVertexPosition attribute present in the geometry for bounds to be calculated correctly.
   */
  _calculateBounds() {
    this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
  }
  /**
   * Tests if a point is inside this mesh. Works only for PIXI.DRAW_MODES.TRIANGLES.
   * @param point - The point to test.
   * @returns - The result of the test.
   */
  containsPoint(point) {
    if (!this.getBounds().contains(point.x, point.y))
      return !1;
    this.worldTransform.applyInverse(point, tempPoint);
    const vertices = this.geometry.getBuffer("aVertexPosition").data, points = tempPolygon.points, indices = this.geometry.getIndex().data, len = indices.length, step = this.drawMode === 4 ? 3 : 1;
    for (let i = 0; i + 2 < len; i += step) {
      const ind0 = indices[i] * 2, ind1 = indices[i + 1] * 2, ind2 = indices[i + 2] * 2;
      if (points[0] = vertices[ind0], points[1] = vertices[ind0 + 1], points[2] = vertices[ind1], points[3] = vertices[ind1 + 1], points[4] = vertices[ind2], points[5] = vertices[ind2 + 1], tempPolygon.contains(tempPoint.x, tempPoint.y))
        return !0;
    }
    return !1;
  }
  destroy(options) {
    super.destroy(options), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
  }
};
_Mesh.BATCHABLE_SIZE = 100;
let Mesh = _Mesh;
exports.Mesh = Mesh;
//# sourceMappingURL=Mesh.js.map
