"use strict";
var core = require("@pixi/core"), display = require("@pixi/display"), _const = require("./const.js"), GraphicsGeometry = require("./GraphicsGeometry.js"), FillStyle = require("./styles/FillStyle.js"), LineStyle = require("./styles/LineStyle.js");
require("./utils/index.js");
var QuadraticUtils = require("./utils/QuadraticUtils.js"), BezierUtils = require("./utils/BezierUtils.js"), ArcUtils = require("./utils/ArcUtils.js");
const DEFAULT_SHADERS = {}, _Graphics = class _Graphics2 extends display.Container {
  /**
   * @param geometry - Geometry to use, if omitted will create a new GraphicsGeometry instance.
   */
  constructor(geometry = null) {
    super(), this.shader = null, this.pluginName = "batch", this.currentPath = null, this.batches = [], this.batchTint = -1, this.batchDirty = -1, this.vertexData = null, this._fillStyle = new FillStyle.FillStyle(), this._lineStyle = new LineStyle.LineStyle(), this._matrix = null, this._holeMode = !1, this.state = core.State.for2d(), this._geometry = geometry || new GraphicsGeometry.GraphicsGeometry(), this._geometry.refCount++, this._transformID = -1, this._tintColor = new core.Color(16777215), this.blendMode = core.BLEND_MODES.NORMAL;
  }
  /**
   * Includes vertex positions, face indices, normals, colors, UVs, and
   * custom attributes within buffers, reducing the cost of passing all
   * this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
   * @readonly
   */
  get geometry() {
    return this._geometry;
  }
  /**
   * Creates a new Graphics object with the same values as this one.
   * Note that only the geometry of the object is cloned, not its transform (position,scale,etc)
   * @returns - A clone of the graphics object
   */
  clone() {
    return this.finishPoly(), new _Graphics2(this._geometry);
  }
  /**
   * The blend mode to be applied to the graphic shape. Apply a value of
   * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
   * primitive in the GraphicsGeometry list is rendered sequentially, modes
   * such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
   * be applied per-primitive.
   * @default PIXI.BLEND_MODES.NORMAL
   */
  set blendMode(value) {
    this.state.blendMode = value;
  }
  get blendMode() {
    return this.state.blendMode;
  }
  /**
   * The tint applied to each graphic shape. This is a hex value. A value of
   * 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    this._tintColor.setValue(value);
  }
  /**
   * The current fill style.
   * @readonly
   */
  get fill() {
    return this._fillStyle;
  }
  /**
   * The current line style.
   * @readonly
   */
  get line() {
    return this._lineStyle;
  }
  lineStyle(options = null, color = 0, alpha, alignment = 0.5, native = !1) {
    return typeof options == "number" && (options = { width: options, color, alpha, alignment, native }), this.lineTextureStyle(options);
  }
  /**
   * Like line style but support texture for line fill.
   * @param [options] - Collection of options for setting line style.
   * @param {number} [options.width=0] - width of the line to draw, will update the objects stored style
   * @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to use
   * @param {PIXI.ColorSource} [options.color=0x0] - color of the line to draw, will update the objects stored style.
   *  Default 0xFFFFFF if texture present.
   * @param {number} [options.alpha=1] - alpha of the line to draw, will update the objects stored style
   * @param {PIXI.Matrix} [options.matrix=null] - Texture matrix to transform texture
   * @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
   *        WebGL only.
   * @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
   * @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style
   * @param {PIXI.LINE_JOIN}[options.join=PIXI.LINE_JOIN.MITER] - line join style
   * @param {number}[options.miterLimit=10] - miter limit ratio
   * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
   */
  lineTextureStyle(options) {
    const defaultLineStyleOptions = {
      width: 0,
      texture: core.Texture.WHITE,
      color: options?.texture ? 16777215 : 0,
      matrix: null,
      alignment: 0.5,
      native: !1,
      cap: _const.LINE_CAP.BUTT,
      join: _const.LINE_JOIN.MITER,
      miterLimit: 10
    };
    options = Object.assign(defaultLineStyleOptions, options), this.normalizeColor(options), this.currentPath && this.startPoly();
    const visible = options.width > 0 && options.alpha > 0;
    return visible ? (options.matrix && (options.matrix = options.matrix.clone(), options.matrix.invert()), Object.assign(this._lineStyle, { visible }, options)) : this._lineStyle.reset(), this;
  }
  /**
   * Start a polygon object internally.
   * @protected
   */
  startPoly() {
    if (this.currentPath) {
      const points = this.currentPath.points, len = this.currentPath.points.length;
      len > 2 && (this.drawShape(this.currentPath), this.currentPath = new core.Polygon(), this.currentPath.closeStroke = !1, this.currentPath.points.push(points[len - 2], points[len - 1]));
    } else
      this.currentPath = new core.Polygon(), this.currentPath.closeStroke = !1;
  }
  /**
   * Finish the polygon object.
   * @protected
   */
  finishPoly() {
    this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
  }
  /**
   * Moves the current drawing position to x, y.
   * @param x - the X coordinate to move to
   * @param y - the Y coordinate to move to
   * @returns - This Graphics object. Good for chaining method calls
   */
  moveTo(x, y) {
    return this.startPoly(), this.currentPath.points[0] = x, this.currentPath.points[1] = y, this;
  }
  /**
   * Draws a line using the current line style from the current drawing position to (x, y);
   * The current drawing position is then set to (x, y).
   * @param x - the X coordinate to draw to
   * @param y - the Y coordinate to draw to
   * @returns - This Graphics object. Good for chaining method calls
   */
  lineTo(x, y) {
    this.currentPath || this.moveTo(0, 0);
    const points = this.currentPath.points, fromX = points[points.length - 2], fromY = points[points.length - 1];
    return (fromX !== x || fromY !== y) && points.push(x, y), this;
  }
  /**
   * Initialize the curve
   * @param x
   * @param y
   */
  _initCurve(x = 0, y = 0) {
    this.currentPath ? this.currentPath.points.length === 0 && (this.currentPath.points = [x, y]) : this.moveTo(x, y);
  }
  /**
   * Calculate the points for a quadratic bezier curve and then draws it.
   * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @returns - This Graphics object. Good for chaining method calls
   */
  quadraticCurveTo(cpX, cpY, toX, toY) {
    this._initCurve();
    const points = this.currentPath.points;
    return points.length === 0 && this.moveTo(0, 0), QuadraticUtils.QuadraticUtils.curveTo(cpX, cpY, toX, toY, points), this;
  }
  /**
   * Calculate the points for a bezier curve and then draws it.
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param cpX2 - Second Control point x
   * @param cpY2 - Second Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @returns This Graphics object. Good for chaining method calls
   */
  bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
    return this._initCurve(), BezierUtils.BezierUtils.curveTo(cpX, cpY, cpX2, cpY2, toX, toY, this.currentPath.points), this;
  }
  /**
   * The `arcTo` method creates an arc/curve between two tangents on the canvas.
   * The first tangent is from the start point to the first control point,
   * and the second tangent is from the first control point to the second control point.
   * Note that the second control point is not necessarily the end point of the arc.
   *
   * "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
   * @param x1 - The x-coordinate of the first control point of the arc
   * @param y1 - The y-coordinate of the first control point of the arc
   * @param x2 - The x-coordinate of the second control point of the arc
   * @param y2 - The y-coordinate of the second control point of the arc
   * @param radius - The radius of the arc
   * @returns - This Graphics object. Good for chaining method calls
   */
  arcTo(x1, y1, x2, y2, radius) {
    this._initCurve(x1, y1);
    const points = this.currentPath.points, result = ArcUtils.ArcUtils.curveTo(x1, y1, x2, y2, radius, points);
    if (result) {
      const { cx, cy, radius: radius2, startAngle, endAngle, anticlockwise } = result;
      this.arc(cx, cy, radius2, startAngle, endAngle, anticlockwise);
    }
    return this;
  }
  /**
   * The arc method creates an arc/curve (used to create circles, or parts of circles).
   * @param cx - The x-coordinate of the center of the circle
   * @param cy - The y-coordinate of the center of the circle
   * @param radius - The radius of the circle
   * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
   *  of the arc's circle)
   * @param endAngle - The ending angle, in radians
   * @param anticlockwise - Specifies whether the drawing should be
   *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
   *  indicates counter-clockwise.
   * @returns - This Graphics object. Good for chaining method calls
   */
  arc(cx, cy, radius, startAngle, endAngle, anticlockwise = !1) {
    if (startAngle === endAngle)
      return this;
    if (!anticlockwise && endAngle <= startAngle ? endAngle += core.PI_2 : anticlockwise && startAngle <= endAngle && (startAngle += core.PI_2), endAngle - startAngle === 0)
      return this;
    const startX = cx + Math.cos(startAngle) * radius, startY = cy + Math.sin(startAngle) * radius, eps = this._geometry.closePointEps;
    let points = this.currentPath ? this.currentPath.points : null;
    if (points) {
      const xDiff = Math.abs(points[points.length - 2] - startX), yDiff = Math.abs(points[points.length - 1] - startY);
      xDiff < eps && yDiff < eps || points.push(startX, startY);
    } else
      this.moveTo(startX, startY), points = this.currentPath.points;
    return ArcUtils.ArcUtils.arc(startX, startY, cx, cy, radius, startAngle, endAngle, anticlockwise, points), this;
  }
  /**
   * Specifies a simple one-color fill that subsequent calls to other Graphics methods
   * (such as lineTo() or drawCircle()) use when drawing.
   * @param {PIXI.ColorSource} color - the color of the fill
   * @param alpha - the alpha of the fill, will override the color's alpha
   * @returns - This Graphics object. Suitable for chaining method calls
   */
  beginFill(color = 0, alpha) {
    return this.beginTextureFill({ texture: core.Texture.WHITE, color, alpha });
  }
  /**
   * Normalize the color input from options for line style or fill
   * @param {PIXI.IFillStyleOptions} options - Fill style object.
   */
  normalizeColor(options) {
    const temp = core.Color.shared.setValue(options.color ?? 0);
    options.color = temp.toNumber(), options.alpha ?? (options.alpha = temp.alpha);
  }
  /**
   * Begin the texture fill.
   * Note: The wrap mode of the texture is forced to REPEAT on render.
   * @param options - Fill style object.
   * @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to fill
   * @param {PIXI.ColorSource} [options.color=0xffffff] - Background to fill behind texture
   * @param {number} [options.alpha] - Alpha of fill, overrides the color's alpha
   * @param {PIXI.Matrix} [options.matrix=null] - Transform matrix
   * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
   */
  beginTextureFill(options) {
    const defaultOptions = {
      texture: core.Texture.WHITE,
      color: 16777215,
      matrix: null
    };
    options = Object.assign(defaultOptions, options), this.normalizeColor(options), this.currentPath && this.startPoly();
    const visible = options.alpha > 0;
    return visible ? (options.matrix && (options.matrix = options.matrix.clone(), options.matrix.invert()), Object.assign(this._fillStyle, { visible }, options)) : this._fillStyle.reset(), this;
  }
  /**
   * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
   * @returns - This Graphics object. Good for chaining method calls
   */
  endFill() {
    return this.finishPoly(), this._fillStyle.reset(), this;
  }
  /**
   * Draws a rectangle shape.
   * @param x - The X coord of the top-left of the rectangle
   * @param y - The Y coord of the top-left of the rectangle
   * @param width - The width of the rectangle
   * @param height - The height of the rectangle
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawRect(x, y, width, height) {
    return this.drawShape(new core.Rectangle(x, y, width, height));
  }
  /**
   * Draw a rectangle shape with rounded/beveled corners.
   * @param x - The X coord of the top-left of the rectangle
   * @param y - The Y coord of the top-left of the rectangle
   * @param width - The width of the rectangle
   * @param height - The height of the rectangle
   * @param radius - Radius of the rectangle corners
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawRoundedRect(x, y, width, height, radius) {
    return this.drawShape(new core.RoundedRectangle(x, y, width, height, radius));
  }
  /**
   * Draws a circle.
   * @param x - The X coordinate of the center of the circle
   * @param y - The Y coordinate of the center of the circle
   * @param radius - The radius of the circle
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawCircle(x, y, radius) {
    return this.drawShape(new core.Circle(x, y, radius));
  }
  /**
   * Draws an ellipse.
   * @param x - The X coordinate of the center of the ellipse
   * @param y - The Y coordinate of the center of the ellipse
   * @param width - The half width of the ellipse
   * @param height - The half height of the ellipse
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawEllipse(x, y, width, height) {
    return this.drawShape(new core.Ellipse(x, y, width, height));
  }
  /**
   * Draws a polygon using the given path.
   * @param {number[]|PIXI.IPointData[]|PIXI.Polygon} path - The path data used to construct the polygon.
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawPolygon(...path) {
    let points, closeStroke = !0;
    const poly = path[0];
    poly.points ? (closeStroke = poly.closeStroke, points = poly.points) : Array.isArray(path[0]) ? points = path[0] : points = path;
    const shape = new core.Polygon(points);
    return shape.closeStroke = closeStroke, this.drawShape(shape), this;
  }
  /**
   * Draw any shape.
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - Shape to draw
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawShape(shape) {
    return this._holeMode ? this._geometry.drawHole(shape, this._matrix) : this._geometry.drawShape(
      shape,
      this._fillStyle.clone(),
      this._lineStyle.clone(),
      this._matrix
    ), this;
  }
  /**
   * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
   * @returns - This Graphics object. Good for chaining method calls
   */
  clear() {
    return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
  }
  /**
   * True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
   * masked with gl.scissor.
   * @returns - True if only 1 rect.
   */
  isFastRect() {
    const data = this._geometry.graphicsData;
    return data.length === 1 && data[0].shape.type === core.SHAPES.RECT && !data[0].matrix && !data[0].holes.length && !(data[0].lineStyle.visible && data[0].lineStyle.width);
  }
  /**
   * Renders the object using the WebGL renderer
   * @param renderer - The renderer
   */
  _render(renderer) {
    this.finishPoly();
    const geometry = this._geometry;
    geometry.updateBatches(), geometry.batchable ? (this.batchDirty !== geometry.batchDirty && this._populateBatches(), this._renderBatched(renderer)) : (renderer.batch.flush(), this._renderDirect(renderer));
  }
  /** Populating batches for rendering. */
  _populateBatches() {
    const geometry = this._geometry, blendMode = this.blendMode, len = geometry.batches.length;
    this.batchTint = -1, this._transformID = -1, this.batchDirty = geometry.batchDirty, this.batches.length = len, this.vertexData = new Float32Array(geometry.points);
    for (let i = 0; i < len; i++) {
      const gI = geometry.batches[i], color = gI.style.color, vertexData = new Float32Array(
        this.vertexData.buffer,
        gI.attribStart * 4 * 2,
        gI.attribSize * 2
      ), uvs = new Float32Array(
        geometry.uvsFloat32.buffer,
        gI.attribStart * 4 * 2,
        gI.attribSize * 2
      ), indices = new Uint16Array(
        geometry.indicesUint16.buffer,
        gI.start * 2,
        gI.size
      ), batch = {
        vertexData,
        blendMode,
        indices,
        uvs,
        _batchRGB: core.Color.shared.setValue(color).toRgbArray(),
        _tintRGB: color,
        _texture: gI.style.texture,
        alpha: gI.style.alpha,
        worldAlpha: 1
      };
      this.batches[i] = batch;
    }
  }
  /**
   * Renders the batches using the BathedRenderer plugin
   * @param renderer - The renderer
   */
  _renderBatched(renderer) {
    if (this.batches.length) {
      renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
      for (let i = 0, l = this.batches.length; i < l; i++) {
        const batch = this.batches[i];
        batch.worldAlpha = this.worldAlpha * batch.alpha, renderer.plugins[this.pluginName].render(batch);
      }
    }
  }
  /**
   * Renders the graphics direct
   * @param renderer - The renderer
   */
  _renderDirect(renderer) {
    const shader = this._resolveDirectShader(renderer), geometry = this._geometry, worldAlpha = this.worldAlpha, uniforms = shader.uniforms, drawCalls = geometry.drawCalls;
    uniforms.translationMatrix = this.transform.worldTransform, core.Color.shared.setValue(this._tintColor).premultiply(worldAlpha).toArray(uniforms.tint), renderer.shader.bind(shader), renderer.geometry.bind(geometry, shader), renderer.state.set(this.state);
    for (let i = 0, l = drawCalls.length; i < l; i++)
      this._renderDrawCallDirect(renderer, geometry.drawCalls[i]);
  }
  /**
   * Renders specific DrawCall
   * @param renderer
   * @param drawCall
   */
  _renderDrawCallDirect(renderer, drawCall) {
    const { texArray, type, size, start } = drawCall, groupTextureCount = texArray.count;
    for (let j = 0; j < groupTextureCount; j++)
      renderer.texture.bind(texArray.elements[j], j);
    renderer.geometry.draw(type, size, start);
  }
  /**
   * Resolves shader for direct rendering
   * @param renderer - The renderer
   */
  _resolveDirectShader(renderer) {
    let shader = this.shader;
    const pluginName = this.pluginName;
    if (!shader) {
      if (!DEFAULT_SHADERS[pluginName]) {
        const { maxTextures } = renderer.plugins[pluginName], sampleValues = new Int32Array(maxTextures);
        for (let i = 0; i < maxTextures; i++)
          sampleValues[i] = i;
        const uniforms = {
          tint: new Float32Array([1, 1, 1, 1]),
          translationMatrix: new core.Matrix(),
          default: core.UniformGroup.from({ uSamplers: sampleValues }, !0)
        }, program = renderer.plugins[pluginName]._shader.program;
        DEFAULT_SHADERS[pluginName] = new core.Shader(program, uniforms);
      }
      shader = DEFAULT_SHADERS[pluginName];
    }
    return shader;
  }
  /**
   * Retrieves the bounds of the graphic shape as a rectangle object.
   * @see PIXI.GraphicsGeometry#bounds
   */
  _calculateBounds() {
    this.finishPoly();
    const geometry = this._geometry;
    if (!geometry.graphicsData.length)
      return;
    const { minX, minY, maxX, maxY } = geometry.bounds;
    this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
  }
  /**
   * Tests if a point is inside this graphics object
   * @param point - the point to test
   * @returns - the result of the test
   */
  containsPoint(point) {
    return this.worldTransform.applyInverse(point, _Graphics2._TEMP_POINT), this._geometry.containsPoint(_Graphics2._TEMP_POINT);
  }
  /** Recalculate the tint by applying tint to batches using Graphics tint. */
  calculateTints() {
    if (this.batchTint !== this.tint) {
      this.batchTint = this._tintColor.toNumber();
      for (let i = 0; i < this.batches.length; i++) {
        const batch = this.batches[i];
        batch._tintRGB = core.Color.shared.setValue(this._tintColor).multiply(batch._batchRGB).toLittleEndianNumber();
      }
    }
  }
  /** If there's a transform update or a change to the shape of the geometry, recalculate the vertices. */
  calculateVertices() {
    const wtID = this.transform._worldID;
    if (this._transformID === wtID)
      return;
    this._transformID = wtID;
    const wt = this.transform.worldTransform, a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty, data = this._geometry.points, vertexData = this.vertexData;
    let count = 0;
    for (let i = 0; i < data.length; i += 2) {
      const x = data[i], y = data[i + 1];
      vertexData[count++] = a * x + c * y + tx, vertexData[count++] = d * y + b * x + ty;
    }
  }
  /**
   * Closes the current path.
   * @returns - Returns itself.
   */
  closePath() {
    const currentPath = this.currentPath;
    return currentPath && (currentPath.closeStroke = !0, this.finishPoly()), this;
  }
  /**
   * Apply a matrix to the positional data.
   * @param matrix - Matrix to use for transform current shape.
   * @returns - Returns itself.
   */
  setMatrix(matrix) {
    return this._matrix = matrix, this;
  }
  /**
   * Begin adding holes to the last draw shape
   * IMPORTANT: holes must be fully inside a shape to work
   * Also weirdness ensues if holes overlap!
   * Ellipses, Circles, Rectangles and Rounded Rectangles cannot be holes or host for holes in CanvasRenderer,
   * please use `moveTo` `lineTo`, `quadraticCurveTo` if you rely on pixi-legacy bundle.
   * @returns - Returns itself.
   */
  beginHole() {
    return this.finishPoly(), this._holeMode = !0, this;
  }
  /**
   * End adding holes to the last draw shape.
   * @returns - Returns itself.
   */
  endHole() {
    return this.finishPoly(), this._holeMode = !1, this;
  }
  /**
   * Destroys the Graphics object.
   * @param options - Options parameter. A boolean will act as if all
   *  options have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have
   *  their destroy method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the texture of the child sprite
   * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the base texture of the child sprite
   */
  destroy(options) {
    this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, super.destroy(options);
  }
};
_Graphics.curves = _const.curves, /**
* Temporary point to use for containsPoint.
* @private
*/
_Graphics._TEMP_POINT = new core.Point();
let Graphics = _Graphics;
exports.Graphics = Graphics;
//# sourceMappingURL=Graphics.js.map
