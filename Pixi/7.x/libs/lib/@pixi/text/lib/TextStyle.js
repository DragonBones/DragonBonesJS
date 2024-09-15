"use strict";
var _const = require("./const.js"), core = require("@pixi/core");
const genericFontFamilies = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
], _TextStyle = class _TextStyle2 {
  /**
   * @param style - TextStyle properties to be set on the text. See {@link PIXI.TextStyle.defaultStyle}
   *       for the default values.
   */
  constructor(style) {
    this.styleID = 0, this.reset(), deepCopyProperties(this, style, style);
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * Note that the only the properties of the object are cloned.
   *
   * @return New cloned TextStyle object
   */
  clone() {
    const clonedProperties = {};
    return deepCopyProperties(clonedProperties, this, _TextStyle2.defaultStyle), new _TextStyle2(clonedProperties);
  }
  /** Resets all properties to the defaults specified in TextStyle.prototype._default */
  reset() {
    deepCopyProperties(this, _TextStyle2.defaultStyle, _TextStyle2.defaultStyle);
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   *
   * @member {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(align) {
    this._align !== align && (this._align = align, this.styleID++);
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(breakWords) {
    this._breakWords !== breakWords && (this._breakWords = breakWords, this.styleID++);
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(dropShadow) {
    this._dropShadow !== dropShadow && (this._dropShadow = dropShadow, this.styleID++);
  }
  /** Set alpha for the drop shadow. */
  get dropShadowAlpha() {
    return this._dropShadowAlpha;
  }
  set dropShadowAlpha(dropShadowAlpha) {
    this._dropShadowAlpha !== dropShadowAlpha && (this._dropShadowAlpha = dropShadowAlpha, this.styleID++);
  }
  /** Set a angle of the drop shadow. */
  get dropShadowAngle() {
    return this._dropShadowAngle;
  }
  set dropShadowAngle(dropShadowAngle) {
    this._dropShadowAngle !== dropShadowAngle && (this._dropShadowAngle = dropShadowAngle, this.styleID++);
  }
  /** Set a shadow blur radius. */
  get dropShadowBlur() {
    return this._dropShadowBlur;
  }
  set dropShadowBlur(dropShadowBlur) {
    this._dropShadowBlur !== dropShadowBlur && (this._dropShadowBlur = dropShadowBlur, this.styleID++);
  }
  /** A fill style to be used on the dropshadow e.g., 'red', '#00FF00'. */
  get dropShadowColor() {
    return this._dropShadowColor;
  }
  set dropShadowColor(dropShadowColor) {
    const outputColor = getColor(dropShadowColor);
    this._dropShadowColor !== outputColor && (this._dropShadowColor = outputColor, this.styleID++);
  }
  /** Set a distance of the drop shadow. */
  get dropShadowDistance() {
    return this._dropShadowDistance;
  }
  set dropShadowDistance(dropShadowDistance) {
    this._dropShadowDistance !== dropShadowDistance && (this._dropShadowDistance = dropShadowDistance, this.styleID++);
  }
  /**
   * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
   *
   * Can be an array to create a gradient e.g., `['#000000','#FFFFFF']`
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
   *
   * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  get fill() {
    return this._fill;
  }
  set fill(fill) {
    const outputColor = getColor(fill);
    this._fill !== outputColor && (this._fill = outputColor, this.styleID++);
  }
  /**
   * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
   *
   * @type {PIXI.TEXT_GRADIENT}
   */
  get fillGradientType() {
    return this._fillGradientType;
  }
  set fillGradientType(fillGradientType) {
    this._fillGradientType !== fillGradientType && (this._fillGradientType = fillGradientType, this.styleID++);
  }
  /**
   * If fill is an array of colours to create a gradient, this array can set the stop points
   * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
   */
  get fillGradientStops() {
    return this._fillGradientStops;
  }
  set fillGradientStops(fillGradientStops) {
    areArraysEqual(this._fillGradientStops, fillGradientStops) || (this._fillGradientStops = fillGradientStops, this.styleID++);
  }
  /**
   * The font family, can be a single font name, or a list of names where the first
   * is the preferred font.
   */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(fontFamily) {
    this.fontFamily !== fontFamily && (this._fontFamily = fontFamily, this.styleID++);
  }
  /**
   * The font size
   * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
   */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(fontSize) {
    this._fontSize !== fontSize && (this._fontSize = fontSize, this.styleID++);
  }
  /**
   * The font style.
   *
   * @member {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(fontStyle) {
    this._fontStyle !== fontStyle && (this._fontStyle = fontStyle, this.styleID++);
  }
  /**
   * The font variant.
   *
   * @member {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(fontVariant) {
    this._fontVariant !== fontVariant && (this._fontVariant = fontVariant, this.styleID++);
  }
  /**
   * The font weight.
   *
   * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(fontWeight) {
    this._fontWeight !== fontWeight && (this._fontWeight = fontWeight, this.styleID++);
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(letterSpacing) {
    this._letterSpacing !== letterSpacing && (this._letterSpacing = letterSpacing, this.styleID++);
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(lineHeight) {
    this._lineHeight !== lineHeight && (this._lineHeight = lineHeight, this.styleID++);
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(leading) {
    this._leading !== leading && (this._leading = leading, this.styleID++);
  }
  /**
   * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
   * Default is 'miter' (creates a sharp corner).
   *
   * @member {'miter'|'round'|'bevel'}
   */
  get lineJoin() {
    return this._lineJoin;
  }
  set lineJoin(lineJoin) {
    this._lineJoin !== lineJoin && (this._lineJoin = lineJoin, this.styleID++);
  }
  /**
   * The miter limit to use when using the 'miter' lineJoin mode.
   *
   * This can reduce or increase the spikiness of rendered text.
   */
  get miterLimit() {
    return this._miterLimit;
  }
  set miterLimit(miterLimit) {
    this._miterLimit !== miterLimit && (this._miterLimit = miterLimit, this.styleID++);
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(padding) {
    this._padding !== padding && (this._padding = padding, this.styleID++);
  }
  /**
   * A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'
   */
  get stroke() {
    return this._stroke;
  }
  set stroke(stroke) {
    const outputColor = getColor(stroke);
    this._stroke !== outputColor && (this._stroke = outputColor, this.styleID++);
  }
  /**
   * A number that represents the thickness of the stroke.
   *
   * @default 0
   */
  get strokeThickness() {
    return this._strokeThickness;
  }
  set strokeThickness(strokeThickness) {
    this._strokeThickness !== strokeThickness && (this._strokeThickness = strokeThickness, this.styleID++);
  }
  /**
   * The baseline of the text that is rendered.
   *
   * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(textBaseline) {
    this._textBaseline !== textBaseline && (this._textBaseline = textBaseline, this.styleID++);
  }
  /** Trim transparent borders. */
  get trim() {
    return this._trim;
  }
  set trim(trim) {
    this._trim !== trim && (this._trim = trim, this.styleID++);
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   *
   * @member {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(whiteSpace) {
    this._whiteSpace !== whiteSpace && (this._whiteSpace = whiteSpace, this.styleID++);
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(wordWrap) {
    this._wordWrap !== wordWrap && (this._wordWrap = wordWrap, this.styleID++);
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(wordWrapWidth) {
    this._wordWrapWidth !== wordWrapWidth && (this._wordWrapWidth = wordWrapWidth, this.styleID++);
  }
  /**
   * Generates a font style string to use for `TextMetrics.measureFont()`.
   *
   * @return Font style string, for passing to `TextMetrics.measureFont()`
   */
  toFontString() {
    const fontSizeString = typeof this.fontSize == "number" ? `${this.fontSize}px` : this.fontSize;
    let fontFamilies = this.fontFamily;
    Array.isArray(this.fontFamily) || (fontFamilies = this.fontFamily.split(","));
    for (let i = fontFamilies.length - 1; i >= 0; i--) {
      let fontFamily = fontFamilies[i].trim();
      !/([\"\'])[^\'\"]+\1/.test(fontFamily) && !genericFontFamilies.includes(fontFamily) && (fontFamily = `"${fontFamily}"`), fontFamilies[i] = fontFamily;
    }
    return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${fontSizeString} ${fontFamilies.join(",")}`;
  }
};
_TextStyle.defaultStyle = {
  /**
   * See {@link PIXI.TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link PIXI.TextStyle.breakWords} */
  breakWords: !1,
  /** See {@link PIXI.TextStyle.dropShadow} */
  dropShadow: !1,
  /** See {@link PIXI.TextStyle.dropShadowAlpha} */
  dropShadowAlpha: 1,
  /**
   * See {@link PIXI.TextStyle.dropShadowAngle}
   * @type {number}
   * @default Math.PI / 6
   */
  dropShadowAngle: Math.PI / 6,
  /** See {@link PIXI.TextStyle.dropShadowBlur} */
  dropShadowBlur: 0,
  /**
   * See {@link PIXI.TextStyle.dropShadowColor}
   * @type {string|number}
   */
  dropShadowColor: "black",
  /** See {@link PIXI.TextStyle.dropShadowDistance} */
  dropShadowDistance: 5,
  /**
   * See {@link PIXI.TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link PIXI.TextStyle.fillGradientType}
   * @type {PIXI.TEXT_GRADIENT}
   * @default PIXI.TEXT_GRADIENT.LINEAR_VERTICAL
   */
  fillGradientType: _const.TEXT_GRADIENT.LINEAR_VERTICAL,
  /**
   * See {@link PIXI.TextStyle.fillGradientStops}
   * @type {number[]}
   * @default []
   */
  fillGradientStops: [],
  /**
   * See {@link PIXI.TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link PIXI.TextStyle.fontSize}
   * @type {number|string} 
   */
  fontSize: 26,
  /**
   * See {@link PIXI.TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link PIXI.TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link PIXI.TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link PIXI.TextStyle.leading} */
  leading: 0,
  /** See {@link PIXI.TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link PIXI.TextStyle.lineHeight} */
  lineHeight: 0,
  /**
   * See {@link PIXI.TextStyle.lineJoin}
   * @type {'miter'|'round'|'bevel'}
   */
  lineJoin: "miter",
  /** See {@link PIXI.TextStyle.miterLimit} */
  miterLimit: 10,
  /** See {@link PIXI.TextStyle.padding} */
  padding: 0,
  /**
   * See {@link PIXI.TextStyle.stroke}
   * @type {string|number}
   */
  stroke: "black",
  /** See {@link PIXI.TextStyle.strokeThickness} */
  strokeThickness: 0,
  /**
   * See {@link PIXI.TextStyle.textBaseline} 
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link PIXI.TextStyle.trim} */
  trim: !1,
  /**
   * See {@link PIXI.TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link PIXI.TextStyle.wordWrap} */
  wordWrap: !1,
  /** See {@link PIXI.TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
let TextStyle = _TextStyle;
function getColor(color) {
  const temp = core.Color.shared, format = (color2) => {
    const res = temp.setValue(color2);
    return res.alpha === 1 ? res.toHex() : res.toRgbaString();
  };
  return Array.isArray(color) ? color.map(format) : format(color);
}
function areArraysEqual(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length)
    return !1;
  for (let i = 0; i < array1.length; ++i)
    if (array1[i] !== array2[i])
      return !1;
  return !0;
}
function deepCopyProperties(target, source, propertyObj) {
  for (const prop in propertyObj)
    Array.isArray(source[prop]) ? target[prop] = source[prop].slice() : target[prop] = source[prop];
}
exports.TextStyle = TextStyle;
//# sourceMappingURL=TextStyle.js.map
