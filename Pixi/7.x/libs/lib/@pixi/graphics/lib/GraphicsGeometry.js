"use strict";
var core = require("@pixi/core"), display = require("@pixi/display"), GraphicsData = require("./GraphicsData.js"), index = require("./utils/index.js"), BatchPart = require("./utils/BatchPart.js"), buildPoly = require("./utils/buildPoly.js"), buildLine = require("./utils/buildLine.js");
const tmpPoint = new core.Point(), _GraphicsGeometry = class _GraphicsGeometry2 extends core.BatchGeometry {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super(), this.closePointEps = 1e-4, this.boundsPadding = 0, this.uvsFloat32 = null, this.indicesUint16 = null, this.batchable = !1, this.points = [], this.colors = [], this.uvs = [], this.indices = [], this.textureIds = [], this.graphicsData = [], this.drawCalls = [], this.batchDirty = -1, this.batches = [], this.dirty = 0, this.cacheDirty = -1, this.clearDirty = 0, this.shapeIndex = 0, this._bounds = new display.Bounds(), this.boundsDirty = -1;
  }
  /**
   * Get the current bounds of the graphic geometry.
   *
   * Since 6.5.0, bounds of the graphics geometry are calculated based on the vertices of generated geometry.
   * Since shapes or strokes with full transparency (`alpha: 0`) will not generate geometry, they are not considered
   * when calculating bounds for the graphics geometry. See PR [#8343]{@link https://github.com/pixijs/pixijs/pull/8343}
   * and issue [#8623]{@link https://github.com/pixijs/pixijs/pull/8623}.
   * @readonly
   */
  get bounds() {
    return this.updateBatches(), this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
  }
  /** Call if you changed graphicsData manually. Empties all batch buffers. */
  invalidate() {
    this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
    for (let i = 0; i < this.drawCalls.length; i++)
      this.drawCalls[i].texArray.clear(), index.DRAW_CALL_POOL.push(this.drawCalls[i]);
    this.drawCalls.length = 0;
    for (let i = 0; i < this.batches.length; i++) {
      const batchPart = this.batches[i];
      batchPart.reset(), index.BATCH_POOL.push(batchPart);
    }
    this.batches.length = 0;
  }
  /**
   * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
   * @returns - This GraphicsGeometry object. Good for chaining method calls
   */
  clear() {
    return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
  }
  /**
   * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
   * @param fillStyle - Defines style of the fill.
   * @param lineStyle - Defines style of the lines.
   * @param matrix - Transform applied to the points of the shape.
   * @returns - Returns geometry for chaining.
   */
  drawShape(shape, fillStyle = null, lineStyle = null, matrix = null) {
    const data = new GraphicsData.GraphicsData(shape, fillStyle, lineStyle, matrix);
    return this.graphicsData.push(data), this.dirty++, this;
  }
  /**
   * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
   * @param matrix - Transform applied to the points of the shape.
   * @returns - Returns geometry for chaining.
   */
  drawHole(shape, matrix = null) {
    if (!this.graphicsData.length)
      return null;
    const data = new GraphicsData.GraphicsData(shape, null, null, matrix), lastShape = this.graphicsData[this.graphicsData.length - 1];
    return data.lineStyle = lastShape.lineStyle, lastShape.holes.push(data), this.dirty++, this;
  }
  /** Destroys the GraphicsGeometry object. */
  destroy() {
    super.destroy();
    for (let i = 0; i < this.graphicsData.length; ++i)
      this.graphicsData[i].destroy();
    this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(point) {
    const graphicsData = this.graphicsData;
    for (let i = 0; i < graphicsData.length; ++i) {
      const data = graphicsData[i];
      if (data.fillStyle.visible && data.shape && (data.matrix ? data.matrix.applyInverse(point, tmpPoint) : tmpPoint.copyFrom(point), data.shape.contains(tmpPoint.x, tmpPoint.y))) {
        let hitHole = !1;
        if (data.holes) {
          for (let i2 = 0; i2 < data.holes.length; i2++)
            if (data.holes[i2].shape.contains(tmpPoint.x, tmpPoint.y)) {
              hitHole = !0;
              break;
            }
        }
        if (!hitHole)
          return !0;
      }
    }
    return !1;
  }
  /**
   * Generates intermediate batch data. Either gets converted to drawCalls
   * or used to convert to batch objects directly by the Graphics object.
   */
  updateBatches() {
    if (!this.graphicsData.length) {
      this.batchable = !0;
      return;
    }
    if (!this.validateBatching())
      return;
    this.cacheDirty = this.dirty;
    const uvs = this.uvs, graphicsData = this.graphicsData;
    let batchPart = null, currentStyle = null;
    this.batches.length > 0 && (batchPart = this.batches[this.batches.length - 1], currentStyle = batchPart.style);
    for (let i = this.shapeIndex; i < graphicsData.length; i++) {
      this.shapeIndex++;
      const data = graphicsData[i], fillStyle = data.fillStyle, lineStyle = data.lineStyle;
      index.FILL_COMMANDS[data.type].build(data), data.matrix && this.transformPoints(data.points, data.matrix), (fillStyle.visible || lineStyle.visible) && this.processHoles(data.holes);
      for (let j = 0; j < 2; j++) {
        const style = j === 0 ? fillStyle : lineStyle;
        if (!style.visible)
          continue;
        const nextTexture = style.texture.baseTexture, index2 = this.indices.length, attribIndex = this.points.length / 2;
        nextTexture.wrapMode = core.WRAP_MODES.REPEAT, j === 0 ? this.processFill(data) : this.processLine(data);
        const size = this.points.length / 2 - attribIndex;
        size !== 0 && (batchPart && !this._compareStyles(currentStyle, style) && (batchPart.end(index2, attribIndex), batchPart = null), batchPart || (batchPart = index.BATCH_POOL.pop() || new BatchPart.BatchPart(), batchPart.begin(style, index2, attribIndex), this.batches.push(batchPart), currentStyle = style), this.addUvs(this.points, uvs, style.texture, attribIndex, size, style.matrix));
      }
    }
    const index$1 = this.indices.length, attrib = this.points.length / 2;
    if (batchPart && batchPart.end(index$1, attrib), this.batches.length === 0) {
      this.batchable = !0;
      return;
    }
    const need32 = attrib > 65535;
    this.indicesUint16 && this.indices.length === this.indicesUint16.length && need32 === this.indicesUint16.BYTES_PER_ELEMENT > 2 ? this.indicesUint16.set(this.indices) : this.indicesUint16 = need32 ? new Uint32Array(this.indices) : new Uint16Array(this.indices), this.batchable = this.isBatchable(), this.batchable ? this.packBatches() : this.buildDrawCalls();
  }
  /**
   * Affinity check
   * @param styleA
   * @param styleB
   */
  _compareStyles(styleA, styleB) {
    return !(!styleA || !styleB || styleA.texture.baseTexture !== styleB.texture.baseTexture || styleA.color + styleA.alpha !== styleB.color + styleB.alpha || !!styleA.native != !!styleB.native);
  }
  /** Test geometry for batching process. */
  validateBatching() {
    if (this.dirty === this.cacheDirty || !this.graphicsData.length)
      return !1;
    for (let i = 0, l = this.graphicsData.length; i < l; i++) {
      const data = this.graphicsData[i], fill = data.fillStyle, line = data.lineStyle;
      if (fill && !fill.texture.baseTexture.valid || line && !line.texture.baseTexture.valid)
        return !1;
    }
    return !0;
  }
  /** Offset the indices so that it works with the batcher. */
  packBatches() {
    this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
    const batches = this.batches;
    for (let i = 0, l = batches.length; i < l; i++) {
      const batch = batches[i];
      for (let j = 0; j < batch.size; j++) {
        const index2 = batch.start + j;
        this.indicesUint16[index2] = this.indicesUint16[index2] - batch.attribStart;
      }
    }
  }
  /**
   * Checks to see if this graphics geometry can be batched.
   * Currently it needs to be small enough and not contain any native lines.
   */
  isBatchable() {
    if (this.points.length > 65535 * 2)
      return !1;
    const batches = this.batches;
    for (let i = 0; i < batches.length; i++)
      if (batches[i].style.native)
        return !1;
    return this.points.length < _GraphicsGeometry2.BATCHABLE_SIZE * 2;
  }
  /** Converts intermediate batches data to drawCalls. */
  buildDrawCalls() {
    let TICK = ++core.BaseTexture._globalBatch;
    for (let i = 0; i < this.drawCalls.length; i++)
      this.drawCalls[i].texArray.clear(), index.DRAW_CALL_POOL.push(this.drawCalls[i]);
    this.drawCalls.length = 0;
    const colors = this.colors, textureIds = this.textureIds;
    let currentGroup = index.DRAW_CALL_POOL.pop();
    currentGroup || (currentGroup = new core.BatchDrawCall(), currentGroup.texArray = new core.BatchTextureArray()), currentGroup.texArray.count = 0, currentGroup.start = 0, currentGroup.size = 0, currentGroup.type = core.DRAW_MODES.TRIANGLES;
    let textureCount = 0, currentTexture = null, textureId = 0, native = !1, drawMode = core.DRAW_MODES.TRIANGLES, index$1 = 0;
    this.drawCalls.push(currentGroup);
    for (let i = 0; i < this.batches.length; i++) {
      const data = this.batches[i], maxTextures = 8, style = data.style, nextTexture = style.texture.baseTexture;
      native !== !!style.native && (native = !!style.native, drawMode = native ? core.DRAW_MODES.LINES : core.DRAW_MODES.TRIANGLES, currentTexture = null, textureCount = maxTextures, TICK++), currentTexture !== nextTexture && (currentTexture = nextTexture, nextTexture._batchEnabled !== TICK && (textureCount === maxTextures && (TICK++, textureCount = 0, currentGroup.size > 0 && (currentGroup = index.DRAW_CALL_POOL.pop(), currentGroup || (currentGroup = new core.BatchDrawCall(), currentGroup.texArray = new core.BatchTextureArray()), this.drawCalls.push(currentGroup)), currentGroup.start = index$1, currentGroup.size = 0, currentGroup.texArray.count = 0, currentGroup.type = drawMode), nextTexture.touched = 1, nextTexture._batchEnabled = TICK, nextTexture._batchLocation = textureCount, nextTexture.wrapMode = core.WRAP_MODES.REPEAT, currentGroup.texArray.elements[currentGroup.texArray.count++] = nextTexture, textureCount++)), currentGroup.size += data.size, index$1 += data.size, textureId = nextTexture._batchLocation, this.addColors(colors, style.color, style.alpha, data.attribSize, data.attribStart), this.addTextureIds(textureIds, textureId, data.attribSize, data.attribStart);
    }
    core.BaseTexture._globalBatch = TICK, this.packAttributes();
  }
  /** Packs attributes to single buffer. */
  packAttributes() {
    const verts = this.points, uvs = this.uvs, colors = this.colors, textureIds = this.textureIds, glPoints = new ArrayBuffer(verts.length * 3 * 4), f32 = new Float32Array(glPoints), u32 = new Uint32Array(glPoints);
    let p = 0;
    for (let i = 0; i < verts.length / 2; i++)
      f32[p++] = verts[i * 2], f32[p++] = verts[i * 2 + 1], f32[p++] = uvs[i * 2], f32[p++] = uvs[i * 2 + 1], u32[p++] = colors[i], f32[p++] = textureIds[i];
    this._buffer.update(glPoints), this._indexBuffer.update(this.indicesUint16);
  }
  /**
   * Process fill part of Graphics.
   * @param data
   */
  processFill(data) {
    data.holes.length ? buildPoly.buildPoly.triangulate(data, this) : index.FILL_COMMANDS[data.type].triangulate(data, this);
  }
  /**
   * Process line part of Graphics.
   * @param data
   */
  processLine(data) {
    buildLine.buildLine(data, this);
    for (let i = 0; i < data.holes.length; i++)
      buildLine.buildLine(data.holes[i], this);
  }
  /**
   * Process the holes data.
   * @param holes
   */
  processHoles(holes) {
    for (let i = 0; i < holes.length; i++) {
      const hole = holes[i];
      index.FILL_COMMANDS[hole.type].build(hole), hole.matrix && this.transformPoints(hole.points, hole.matrix);
    }
  }
  /** Update the local bounds of the object. Expensive to use performance-wise. */
  calculateBounds() {
    const bounds = this._bounds;
    bounds.clear(), bounds.addVertexData(this.points, 0, this.points.length), bounds.pad(this.boundsPadding, this.boundsPadding);
  }
  /**
   * Transform points using matrix.
   * @param points - Points to transform
   * @param matrix - Transform matrix
   */
  transformPoints(points, matrix) {
    for (let i = 0; i < points.length / 2; i++) {
      const x = points[i * 2], y = points[i * 2 + 1];
      points[i * 2] = matrix.a * x + matrix.c * y + matrix.tx, points[i * 2 + 1] = matrix.b * x + matrix.d * y + matrix.ty;
    }
  }
  /**
   * Add colors.
   * @param colors - List of colors to add to
   * @param color - Color to add
   * @param alpha - Alpha to use
   * @param size - Number of colors to add
   * @param offset
   */
  addColors(colors, color, alpha, size, offset = 0) {
    const bgr = core.Color.shared.setValue(color).toLittleEndianNumber(), result = core.Color.shared.setValue(bgr).toPremultiplied(alpha);
    colors.length = Math.max(colors.length, offset + size);
    for (let i = 0; i < size; i++)
      colors[offset + i] = result;
  }
  /**
   * Add texture id that the shader/fragment wants to use.
   * @param textureIds
   * @param id
   * @param size
   * @param offset
   */
  addTextureIds(textureIds, id, size, offset = 0) {
    textureIds.length = Math.max(textureIds.length, offset + size);
    for (let i = 0; i < size; i++)
      textureIds[offset + i] = id;
  }
  /**
   * Generates the UVs for a shape.
   * @param verts - Vertices
   * @param uvs - UVs
   * @param texture - Reference to Texture
   * @param start - Index buffer start index.
   * @param size - The size/length for index buffer.
   * @param matrix - Optional transform for all points.
   */
  addUvs(verts, uvs, texture, start, size, matrix = null) {
    let index2 = 0;
    const uvsStart = uvs.length, frame = texture.frame;
    for (; index2 < size; ) {
      let x = verts[(start + index2) * 2], y = verts[(start + index2) * 2 + 1];
      if (matrix) {
        const nx = matrix.a * x + matrix.c * y + matrix.tx;
        y = matrix.b * x + matrix.d * y + matrix.ty, x = nx;
      }
      index2++, uvs.push(x / frame.width, y / frame.height);
    }
    const baseTexture = texture.baseTexture;
    (frame.width < baseTexture.width || frame.height < baseTexture.height) && this.adjustUvs(uvs, texture, uvsStart, size);
  }
  /**
   * Modify uvs array according to position of texture region
   * Does not work with rotated or trimmed textures
   * @param uvs - array
   * @param texture - region
   * @param start - starting index for uvs
   * @param size - how many points to adjust
   */
  adjustUvs(uvs, texture, start, size) {
    const baseTexture = texture.baseTexture, eps = 1e-6, finish = start + size * 2, frame = texture.frame, scaleX = frame.width / baseTexture.width, scaleY = frame.height / baseTexture.height;
    let offsetX = frame.x / frame.width, offsetY = frame.y / frame.height, minX = Math.floor(uvs[start] + eps), minY = Math.floor(uvs[start + 1] + eps);
    for (let i = start + 2; i < finish; i += 2)
      minX = Math.min(minX, Math.floor(uvs[i] + eps)), minY = Math.min(minY, Math.floor(uvs[i + 1] + eps));
    offsetX -= minX, offsetY -= minY;
    for (let i = start; i < finish; i += 2)
      uvs[i] = (uvs[i] + offsetX) * scaleX, uvs[i + 1] = (uvs[i + 1] + offsetY) * scaleY;
  }
};
_GraphicsGeometry.BATCHABLE_SIZE = 100;
let GraphicsGeometry = _GraphicsGeometry;
exports.GraphicsGeometry = GraphicsGeometry;
//# sourceMappingURL=GraphicsGeometry.js.map
