import { settings, Texture, Rectangle, utils, Color } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { TEXT_GRADIENT } from "./const.mjs";
import { TextMetrics } from "./TextMetrics.mjs";
import { TextStyle } from "./TextStyle.mjs";
const defaultDestroyOptions = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, _Text = class _Text2 extends Sprite {
  /**
   * @param text - The string that you would like the text to display
   * @param style - The style parameters
   * @param canvas - The canvas element for drawing text
   */
  constructor(text, style, canvas) {
    let ownCanvas = !1;
    canvas || (canvas = settings.ADAPTER.createCanvas(), ownCanvas = !0), canvas.width = 3, canvas.height = 3;
    const texture = Texture.from(canvas);
    texture.orig = new Rectangle(), texture.trim = new Rectangle(), super(texture), this._ownCanvas = ownCanvas, this.canvas = canvas, this.context = canvas.getContext("2d", {
      // required for trimming to work without warnings
      willReadFrequently: !0
    }), this._resolution = _Text2.defaultResolution ?? settings.RESOLUTION, this._autoResolution = _Text2.defaultAutoResolution, this._text = null, this._style = null, this._styleListener = null, this._font = "", this.text = text, this.style = style, this.localStyleID = -1;
  }
  /**
   * @see PIXI.TextMetrics.experimentalLetterSpacing
   * @deprecated since 7.1.0
   */
  static get experimentalLetterSpacing() {
    return TextMetrics.experimentalLetterSpacing;
  }
  static set experimentalLetterSpacing(value) {
    utils.deprecation(
      "7.1.0",
      "Text.experimentalLetterSpacing is deprecated, use TextMetrics.experimentalLetterSpacing"
    ), TextMetrics.experimentalLetterSpacing = value;
  }
  /**
   * Renders text to its canvas, and updates its texture.
   *
   * By default this is used internally to ensure the texture is correct before rendering,
   * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
   * and then shared across multiple Sprites.
   * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
   */
  updateText(respectDirty) {
    const style = this._style;
    if (this.localStyleID !== style.styleID && (this.dirty = !0, this.localStyleID = style.styleID), !this.dirty && respectDirty)
      return;
    this._font = this._style.toFontString();
    const context = this.context, measured = TextMetrics.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), width = measured.width, height = measured.height, lines = measured.lines, lineHeight = measured.lineHeight, lineWidths = measured.lineWidths, maxLineWidth = measured.maxLineWidth, fontProperties = measured.fontProperties;
    this.canvas.width = Math.ceil(Math.ceil(Math.max(1, width) + style.padding * 2) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, height) + style.padding * 2) * this._resolution), context.scale(this._resolution, this._resolution), context.clearRect(0, 0, this.canvas.width, this.canvas.height), context.font = this._font, context.lineWidth = style.strokeThickness, context.textBaseline = style.textBaseline, context.lineJoin = style.lineJoin, context.miterLimit = style.miterLimit;
    let linePositionX, linePositionY;
    const passesCount = style.dropShadow ? 2 : 1;
    for (let i = 0; i < passesCount; ++i) {
      const isShadowPass = style.dropShadow && i === 0, dsOffsetText = isShadowPass ? Math.ceil(Math.max(1, height) + style.padding * 2) : 0, dsOffsetShadow = dsOffsetText * this._resolution;
      if (isShadowPass) {
        context.fillStyle = "black", context.strokeStyle = "black";
        const dropShadowColor = style.dropShadowColor, dropShadowBlur = style.dropShadowBlur * this._resolution, dropShadowDistance = style.dropShadowDistance * this._resolution;
        context.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(style.dropShadowAlpha).toRgbaString(), context.shadowBlur = dropShadowBlur, context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance, context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance + dsOffsetShadow;
      } else
        context.fillStyle = this._generateFillStyle(style, lines, measured), context.strokeStyle = style.stroke, context.shadowColor = "black", context.shadowBlur = 0, context.shadowOffsetX = 0, context.shadowOffsetY = 0;
      let linePositionYShift = (lineHeight - fontProperties.fontSize) / 2;
      lineHeight - fontProperties.fontSize < 0 && (linePositionYShift = 0);
      for (let i2 = 0; i2 < lines.length; i2++)
        linePositionX = style.strokeThickness / 2, linePositionY = style.strokeThickness / 2 + i2 * lineHeight + fontProperties.ascent + linePositionYShift, style.align === "right" ? linePositionX += maxLineWidth - lineWidths[i2] : style.align === "center" && (linePositionX += (maxLineWidth - lineWidths[i2]) / 2), style.stroke && style.strokeThickness && this.drawLetterSpacing(
          lines[i2],
          linePositionX + style.padding,
          linePositionY + style.padding - dsOffsetText,
          !0
        ), style.fill && this.drawLetterSpacing(
          lines[i2],
          linePositionX + style.padding,
          linePositionY + style.padding - dsOffsetText
        );
    }
    this.updateTexture();
  }
  /**
   * Render the text with letter-spacing.
   * @param text - The text to draw
   * @param x - Horizontal position to draw the text
   * @param y - Vertical position to draw the text
   * @param isStroke - Is this drawing for the outside stroke of the
   *  text? If not, it's for the inside fill
   */
  drawLetterSpacing(text, x, y, isStroke = !1) {
    const letterSpacing = this._style.letterSpacing;
    let useExperimentalLetterSpacing = !1;
    if (TextMetrics.experimentalLetterSpacingSupported && (TextMetrics.experimentalLetterSpacing ? (this.context.letterSpacing = `${letterSpacing}px`, this.context.textLetterSpacing = `${letterSpacing}px`, useExperimentalLetterSpacing = !0) : (this.context.letterSpacing = "0px", this.context.textLetterSpacing = "0px")), letterSpacing === 0 || useExperimentalLetterSpacing) {
      isStroke ? this.context.strokeText(text, x, y) : this.context.fillText(text, x, y);
      return;
    }
    let currentPosition = x;
    const stringArray = TextMetrics.graphemeSegmenter(text);
    let previousWidth = this.context.measureText(text).width, currentWidth = 0;
    for (let i = 0; i < stringArray.length; ++i) {
      const currentChar = stringArray[i];
      isStroke ? this.context.strokeText(currentChar, currentPosition, y) : this.context.fillText(currentChar, currentPosition, y);
      let textStr = "";
      for (let j = i + 1; j < stringArray.length; ++j)
        textStr += stringArray[j];
      currentWidth = this.context.measureText(textStr).width, currentPosition += previousWidth - currentWidth + letterSpacing, previousWidth = currentWidth;
    }
  }
  /** Updates texture size based on canvas size. */
  updateTexture() {
    const canvas = this.canvas;
    if (this._style.trim) {
      const trimmed = utils.trimCanvas(canvas);
      trimmed.data && (canvas.width = trimmed.width, canvas.height = trimmed.height, this.context.putImageData(trimmed.data, 0, 0));
    }
    const texture = this._texture, style = this._style, padding = style.trim ? 0 : style.padding, baseTexture = texture.baseTexture;
    texture.trim.width = texture._frame.width = canvas.width / this._resolution, texture.trim.height = texture._frame.height = canvas.height / this._resolution, texture.trim.x = -padding, texture.trim.y = -padding, texture.orig.width = texture._frame.width - padding * 2, texture.orig.height = texture._frame.height - padding * 2, this._onTextureUpdate(), baseTexture.setRealSize(canvas.width, canvas.height, this._resolution), texture.updateUvs(), this.dirty = !1;
  }
  /**
   * Renders the object using the WebGL renderer
   * @param renderer - The renderer
   */
  _render(renderer) {
    this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0), this.updateText(!0), super._render(renderer);
  }
  /** Updates the transform on all children of this container for rendering. */
  updateTransform() {
    this.updateText(!0), super.updateTransform();
  }
  getBounds(skipUpdate, rect) {
    return this.updateText(!0), this._textureID === -1 && (skipUpdate = !1), super.getBounds(skipUpdate, rect);
  }
  /**
   * Gets the local bounds of the text object.
   * @param rect - The output rectangle.
   * @returns The bounds.
   */
  getLocalBounds(rect) {
    return this.updateText(!0), super.getLocalBounds.call(this, rect);
  }
  /** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
  _calculateBounds() {
    this.calculateVertices(), this._bounds.addQuad(this.vertexData);
  }
  /**
   * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
   * @param style - The style.
   * @param lines - The lines of text.
   * @param metrics
   * @returns The fill style
   */
  _generateFillStyle(style, lines, metrics) {
    const fillStyle = style.fill;
    if (Array.isArray(fillStyle)) {
      if (fillStyle.length === 1)
        return fillStyle[0];
    } else
      return fillStyle;
    let gradient;
    const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0, padding = style.padding || 0, width = this.canvas.width / this._resolution - dropShadowCorrection - padding * 2, height = this.canvas.height / this._resolution - dropShadowCorrection - padding * 2, fill = fillStyle.slice(), fillGradientStops = style.fillGradientStops.slice();
    if (!fillGradientStops.length) {
      const lengthPlus1 = fill.length + 1;
      for (let i = 1; i < lengthPlus1; ++i)
        fillGradientStops.push(i / lengthPlus1);
    }
    if (fill.unshift(fillStyle[0]), fillGradientStops.unshift(0), fill.push(fillStyle[fillStyle.length - 1]), fillGradientStops.push(1), style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
      gradient = this.context.createLinearGradient(width / 2, padding, width / 2, height + padding);
      const textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
      for (let i = 0; i < lines.length; i++) {
        const lastLineBottom = metrics.lineHeight * (i - 1) + textHeight, thisLineTop = metrics.lineHeight * i;
        let thisLineGradientStart = thisLineTop;
        i > 0 && lastLineBottom > thisLineTop && (thisLineGradientStart = (thisLineTop + lastLineBottom) / 2);
        const thisLineBottom = thisLineTop + textHeight, nextLineTop = metrics.lineHeight * (i + 1);
        let thisLineGradientEnd = thisLineBottom;
        i + 1 < lines.length && nextLineTop < thisLineBottom && (thisLineGradientEnd = (thisLineBottom + nextLineTop) / 2);
        const gradStopLineHeight = (thisLineGradientEnd - thisLineGradientStart) / height;
        for (let j = 0; j < fill.length; j++) {
          let lineStop = 0;
          typeof fillGradientStops[j] == "number" ? lineStop = fillGradientStops[j] : lineStop = j / fill.length;
          let globalStop = Math.min(1, Math.max(
            0,
            thisLineGradientStart / height + lineStop * gradStopLineHeight
          ));
          globalStop = Number(globalStop.toFixed(5)), gradient.addColorStop(globalStop, fill[j]);
        }
      }
    } else {
      gradient = this.context.createLinearGradient(padding, height / 2, width + padding, height / 2);
      const totalIterations = fill.length + 1;
      let currentIteration = 1;
      for (let i = 0; i < fill.length; i++) {
        let stop;
        typeof fillGradientStops[i] == "number" ? stop = fillGradientStops[i] : stop = currentIteration / totalIterations, gradient.addColorStop(stop, fill[i]), currentIteration++;
      }
    }
    return gradient;
  }
  /**
   * Destroys this text object.
   *
   * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
   * the majority of the time the texture will not be shared with any other Sprites.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their
   *  destroy method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
   * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
   */
  destroy(options) {
    typeof options == "boolean" && (options = { children: options }), options = Object.assign({}, defaultDestroyOptions, options), super.destroy(options), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
  }
  /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(value) {
    this.updateText(!0);
    const s = utils.sign(this.scale.x) || 1;
    this.scale.x = s * value / this._texture.orig.width, this._width = value;
  }
  /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(value) {
    this.updateText(!0);
    const s = utils.sign(this.scale.y) || 1;
    this.scale.y = s * value / this._texture.orig.height, this._height = value;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link PIXI.ITextStyle}.
   */
  get style() {
    return this._style;
  }
  set style(style) {
    style = style || {}, style instanceof TextStyle ? this._style = style : this._style = new TextStyle(style), this.localStyleID = -1, this.dirty = !0;
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  get text() {
    return this._text;
  }
  set text(text) {
    text = String(text ?? ""), this._text !== text && (this._text = text, this.dirty = !0);
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   *
   * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
   * @default 1
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(value) {
    this._autoResolution = !1, this._resolution !== value && (this._resolution = value, this.dirty = !0);
  }
};
_Text.defaultAutoResolution = !0;
let Text = _Text;
export {
  Text
};
//# sourceMappingURL=Text.mjs.map
