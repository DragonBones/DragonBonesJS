import { BLEND_MODES, Color, Matrix, Point, Polygon, Shader, Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { LINE_CAP, LINE_JOIN } from './const';
import { GraphicsGeometry } from './GraphicsGeometry';
import { FillStyle } from './styles/FillStyle';
import { LineStyle } from './styles/LineStyle';
import type { BatchDrawCall, ColorSource, IPointData, IShape, Renderer } from '@pixi/core';
import type { IDestroyOptions } from '@pixi/display';
/**
 * Batch element computed from Graphics geometry.
 * @memberof PIXI
 */
export interface IGraphicsBatchElement {
    vertexData: Float32Array;
    blendMode: BLEND_MODES;
    indices: Uint16Array | Uint32Array;
    uvs: Float32Array;
    alpha: number;
    worldAlpha: number;
    _batchRGB: number[];
    _tintRGB: number;
    _texture: Texture;
}
export interface IFillStyleOptions {
    color?: ColorSource;
    alpha?: number;
    texture?: Texture;
    matrix?: Matrix;
}
export interface ILineStyleOptions extends IFillStyleOptions {
    width?: number;
    alignment?: number;
    native?: boolean;
    cap?: LINE_CAP;
    join?: LINE_JOIN;
    miterLimit?: number;
}
export interface Graphics extends GlobalMixins.Graphics, Container {
}
/**
 * The Graphics class is primarily used to render primitive shapes such as lines, circles and
 * rectangles to the display, and to color and fill them.  However, you can also use a Graphics
 * object to build a list of primitives to use as a mask, or as a complex hitArea.
 *
 * Please note that due to legacy naming conventions, the behavior of some functions in this class
 * can be confusing.  Each call to `drawRect()`, `drawPolygon()`, etc. actually stores that primitive
 * in the Geometry class's GraphicsGeometry object for later use in rendering or hit testing - the
 * functions do not directly draw anything to the screen.  Similarly, the `clear()` function doesn't
 * change the screen, it simply resets the list of primitives, which can be useful if you want to
 * rebuild the contents of an existing Graphics object.
 *
 * Once a GraphicsGeometry list is built, you can re-use it in other Geometry objects as
 * an optimization, by passing it into a new Geometry object's constructor.  Because of this
 * ability, it's important to call `destroy()` on Geometry objects once you are done with them, to
 * properly dereference each GraphicsGeometry and prevent memory leaks.
 * @memberof PIXI
 */
export declare class Graphics extends Container {
    /**
     * Graphics curves resolution settings. If `adaptive` flag is set to `true`,
     * the resolution is calculated based on the curve's length to ensure better visual quality.
     * Adaptive draw works with `bezierCurveTo` and `quadraticCurveTo`.
     * @static
     * @property {boolean} [adaptive=true] - flag indicating if the resolution should be adaptive
     * @property {number} [maxLength=10] - maximal length of a single segment of the curve (if adaptive = false, ignored)
     * @property {number} [minSegments=8] - minimal number of segments in the curve (if adaptive = false, ignored)
     * @property {number} [maxSegments=2048] - maximal number of segments in the curve (if adaptive = false, ignored)
     * @property {number} [epsilon=0.0001] - precision of the curve fitting
     */
    static readonly curves: {
        adaptive: boolean;
        maxLength: number;
        minSegments: number;
        maxSegments: number;
        epsilon: number;
        _segmentsCount(length: number, defaultSegments?: number): number;
    };
    /**
     * Temporary point to use for containsPoint.
     * @private
     */
    static _TEMP_POINT: Point;
    /**
     * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
     * Can be shared between multiple Graphics objects.
     */
    shader: Shader;
    /** Renderer plugin for batching */
    pluginName: string;
    /**
     * Current path
     * @readonly
     */
    currentPath: Polygon;
    /** A collections of batches! These can be drawn by the renderer batch system. */
    protected batches: Array<IGraphicsBatchElement>;
    /** Update dirty for limiting calculating tints for batches. */
    protected batchTint: number;
    /** Update dirty for limiting calculating batches.*/
    protected batchDirty: number;
    /** Copy of the object vertex data. */
    protected vertexData: Float32Array;
    /** Current fill style. */
    protected _fillStyle: FillStyle;
    /** Current line style. */
    protected _lineStyle: LineStyle;
    /** Current shape transform matrix. */
    protected _matrix: Matrix;
    /** Current hole mode is enabled. */
    protected _holeMode: boolean;
    protected _transformID: number;
    protected _tintColor: Color;
    /**
     * Represents the WebGL state the Graphics required to render, excludes shader and geometry. E.g.,
     * blend mode, culling, depth testing, direction of rendering triangles, backface, etc.
     */
    private state;
    private _geometry;
    /**
     * Includes vertex positions, face indices, normals, colors, UVs, and
     * custom attributes within buffers, reducing the cost of passing all
     * this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
     * @readonly
     */
    get geometry(): GraphicsGeometry;
    /**
     * @param geometry - Geometry to use, if omitted will create a new GraphicsGeometry instance.
     */
    constructor(geometry?: GraphicsGeometry);
    /**
     * Creates a new Graphics object with the same values as this one.
     * Note that only the geometry of the object is cloned, not its transform (position,scale,etc)
     * @returns - A clone of the graphics object
     */
    clone(): Graphics;
    /**
     * The blend mode to be applied to the graphic shape. Apply a value of
     * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
     * primitive in the GraphicsGeometry list is rendered sequentially, modes
     * such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
     * be applied per-primitive.
     * @default PIXI.BLEND_MODES.NORMAL
     */
    set blendMode(value: BLEND_MODES);
    get blendMode(): BLEND_MODES;
    /**
     * The tint applied to each graphic shape. This is a hex value. A value of
     * 0xFFFFFF will remove any tint effect.
     * @default 0xFFFFFF
     */
    get tint(): ColorSource;
    set tint(value: ColorSource);
    /**
     * The current fill style.
     * @readonly
     */
    get fill(): FillStyle;
    /**
     * The current line style.
     * @readonly
     */
    get line(): LineStyle;
    /**
     * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
     * method or the drawCircle() method.
     * @param [width=0] - width of the line to draw, will update the objects stored style
     * @param [color=0x0] - color of the line to draw, will update the objects stored style
     * @param [alpha=1] - alpha of the line to draw, will update the objects stored style
     * @param [alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
     *        WebGL only.
     * @param [native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
     * @returns - This Graphics object. Good for chaining method calls
     */
    lineStyle(width: number, color?: ColorSource, alpha?: number, alignment?: number, native?: boolean): this;
    /**
     * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
     * method or the drawCircle() method.
     * @param options - Line style options
     * @param {number} [options.width=0] - width of the line to draw, will update the objects stored style
     * @param {PIXI.ColorSource} [options.color=0x0] - color of the line to draw, will update the objects stored style
     * @param {number} [options.alpha] - alpha of the line to draw, will update the objects stored style
     * @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
     *        WebGL only.
     * @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
     * @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style
     * @param {PIXI.LINE_JOIN}[options.join=PIXI.LINE_JOIN.MITER] - line join style
     * @param {number}[options.miterLimit=10] - miter limit ratio
     * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    lineStyle(options?: ILineStyleOptions): this;
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
    lineTextureStyle(options?: ILineStyleOptions): this;
    /**
     * Start a polygon object internally.
     * @protected
     */
    protected startPoly(): void;
    /**
     * Finish the polygon object.
     * @protected
     */
    finishPoly(): void;
    /**
     * Moves the current drawing position to x, y.
     * @param x - the X coordinate to move to
     * @param y - the Y coordinate to move to
     * @returns - This Graphics object. Good for chaining method calls
     */
    moveTo(x: number, y: number): this;
    /**
     * Draws a line using the current line style from the current drawing position to (x, y);
     * The current drawing position is then set to (x, y).
     * @param x - the X coordinate to draw to
     * @param y - the Y coordinate to draw to
     * @returns - This Graphics object. Good for chaining method calls
     */
    lineTo(x: number, y: number): this;
    /**
     * Initialize the curve
     * @param x
     * @param y
     */
    protected _initCurve(x?: number, y?: number): void;
    /**
     * Calculate the points for a quadratic bezier curve and then draws it.
     * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
     * @param cpX - Control point x
     * @param cpY - Control point y
     * @param toX - Destination point x
     * @param toY - Destination point y
     * @returns - This Graphics object. Good for chaining method calls
     */
    quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): this;
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
    bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): this;
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
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
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
    arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
    /**
     * Specifies a simple one-color fill that subsequent calls to other Graphics methods
     * (such as lineTo() or drawCircle()) use when drawing.
     * @param {PIXI.ColorSource} color - the color of the fill
     * @param alpha - the alpha of the fill, will override the color's alpha
     * @returns - This Graphics object. Suitable for chaining method calls
     */
    beginFill(color?: ColorSource, alpha?: number): this;
    /**
     * Normalize the color input from options for line style or fill
     * @param {PIXI.IFillStyleOptions} options - Fill style object.
     */
    private normalizeColor;
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
    beginTextureFill(options?: IFillStyleOptions): this;
    /**
     * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
     * @returns - This Graphics object. Good for chaining method calls
     */
    endFill(): this;
    /**
     * Draws a rectangle shape.
     * @param x - The X coord of the top-left of the rectangle
     * @param y - The Y coord of the top-left of the rectangle
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     * @returns - This Graphics object. Good for chaining method calls
     */
    drawRect(x: number, y: number, width: number, height: number): this;
    /**
     * Draw a rectangle shape with rounded/beveled corners.
     * @param x - The X coord of the top-left of the rectangle
     * @param y - The Y coord of the top-left of the rectangle
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     * @param radius - Radius of the rectangle corners
     * @returns - This Graphics object. Good for chaining method calls
     */
    drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): this;
    /**
     * Draws a circle.
     * @param x - The X coordinate of the center of the circle
     * @param y - The Y coordinate of the center of the circle
     * @param radius - The radius of the circle
     * @returns - This Graphics object. Good for chaining method calls
     */
    drawCircle(x: number, y: number, radius: number): this;
    /**
     * Draws an ellipse.
     * @param x - The X coordinate of the center of the ellipse
     * @param y - The Y coordinate of the center of the ellipse
     * @param width - The half width of the ellipse
     * @param height - The half height of the ellipse
     * @returns - This Graphics object. Good for chaining method calls
     */
    drawEllipse(x: number, y: number, width: number, height: number): this;
    drawPolygon(...path: Array<number> | Array<IPointData>): this;
    drawPolygon(path: Array<number> | Array<IPointData> | Polygon): this;
    /**
     * Draw any shape.
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - Shape to draw
     * @returns - This Graphics object. Good for chaining method calls
     */
    drawShape(shape: IShape): this;
    /**
     * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
     * @returns - This Graphics object. Good for chaining method calls
     */
    clear(): this;
    /**
     * True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
     * masked with gl.scissor.
     * @returns - True if only 1 rect.
     */
    isFastRect(): boolean;
    /**
     * Renders the object using the WebGL renderer
     * @param renderer - The renderer
     */
    protected _render(renderer: Renderer): void;
    /** Populating batches for rendering. */
    protected _populateBatches(): void;
    /**
     * Renders the batches using the BathedRenderer plugin
     * @param renderer - The renderer
     */
    protected _renderBatched(renderer: Renderer): void;
    /**
     * Renders the graphics direct
     * @param renderer - The renderer
     */
    protected _renderDirect(renderer: Renderer): void;
    /**
     * Renders specific DrawCall
     * @param renderer
     * @param drawCall
     */
    protected _renderDrawCallDirect(renderer: Renderer, drawCall: BatchDrawCall): void;
    /**
     * Resolves shader for direct rendering
     * @param renderer - The renderer
     */
    protected _resolveDirectShader(renderer: Renderer): Shader;
    /**
     * Retrieves the bounds of the graphic shape as a rectangle object.
     * @see PIXI.GraphicsGeometry#bounds
     */
    protected _calculateBounds(): void;
    /**
     * Tests if a point is inside this graphics object
     * @param point - the point to test
     * @returns - the result of the test
     */
    containsPoint(point: IPointData): boolean;
    /** Recalculate the tint by applying tint to batches using Graphics tint. */
    protected calculateTints(): void;
    /** If there's a transform update or a change to the shape of the geometry, recalculate the vertices. */
    protected calculateVertices(): void;
    /**
     * Closes the current path.
     * @returns - Returns itself.
     */
    closePath(): this;
    /**
     * Apply a matrix to the positional data.
     * @param matrix - Matrix to use for transform current shape.
     * @returns - Returns itself.
     */
    setMatrix(matrix: Matrix): this;
    /**
     * Begin adding holes to the last draw shape
     * IMPORTANT: holes must be fully inside a shape to work
     * Also weirdness ensues if holes overlap!
     * Ellipses, Circles, Rectangles and Rounded Rectangles cannot be holes or host for holes in CanvasRenderer,
     * please use `moveTo` `lineTo`, `quadraticCurveTo` if you rely on pixi-legacy bundle.
     * @returns - Returns itself.
     */
    beginHole(): this;
    /**
     * End adding holes to the last draw shape.
     * @returns - Returns itself.
     */
    endHole(): this;
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
    destroy(options?: IDestroyOptions | boolean): void;
}
