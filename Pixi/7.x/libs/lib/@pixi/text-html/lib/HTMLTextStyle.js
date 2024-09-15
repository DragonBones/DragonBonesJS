"use strict";
var core = require("@pixi/core"), text = require("@pixi/text");
const _HTMLTextStyle = class _HTMLTextStyle2 extends text.TextStyle {
  constructor() {
    super(...arguments), this._fonts = [], this._overrides = [], this._stylesheet = "", this.fontsDirty = !1;
  }
  /**
   * Convert a TextStyle to HTMLTextStyle
   * @param originalStyle
   * @example
   * import {TextStyle } from 'pixi.js';
   * import {HTMLTextStyle} from '@pixi/text-html';
   * const style = new TextStyle();
   * const htmlStyle = HTMLTextStyle.from(style);
   */
  static from(originalStyle) {
    return new _HTMLTextStyle2(
      Object.keys(_HTMLTextStyle2.defaultOptions).reduce((obj, prop) => ({ ...obj, [prop]: originalStyle[prop] }), {})
    );
  }
  /** Clear the current font */
  cleanFonts() {
    this._fonts.length > 0 && (this._fonts.forEach((font) => {
      URL.revokeObjectURL(font.src), font.refs--, font.refs === 0 && (font.fontFace && document.fonts.delete(font.fontFace), delete _HTMLTextStyle2.availableFonts[font.originalUrl]);
    }), this.fontFamily = "Arial", this._fonts.length = 0, this.styleID++, this.fontsDirty = !0);
  }
  /**
   * Because of how HTMLText renders, fonts need to be imported
   * @param url
   * @param options
   */
  loadFont(url, options = {}) {
    const { availableFonts } = _HTMLTextStyle2;
    if (availableFonts[url]) {
      const font = availableFonts[url];
      return this._fonts.push(font), font.refs++, this.styleID++, this.fontsDirty = !0, Promise.resolve();
    }
    return core.settings.ADAPTER.fetch(url).then((response) => response.blob()).then(async (blob) => new Promise((resolve, reject) => {
      const src = URL.createObjectURL(blob), reader = new FileReader();
      reader.onload = () => resolve([src, reader.result]), reader.onerror = reject, reader.readAsDataURL(blob);
    })).then(async ([src, dataSrc]) => {
      const font = Object.assign({
        family: core.utils.path.basename(url, core.utils.path.extname(url)),
        weight: "normal",
        style: "normal",
        display: "auto",
        src,
        dataSrc,
        refs: 1,
        originalUrl: url,
        fontFace: null
      }, options);
      availableFonts[url] = font, this._fonts.push(font), this.styleID++;
      const fontFace = new FontFace(font.family, `url(${font.src})`, {
        weight: font.weight,
        style: font.style,
        display: font.display
      });
      font.fontFace = fontFace, await fontFace.load(), document.fonts.add(fontFace), await document.fonts.ready, this.styleID++, this.fontsDirty = !0;
    });
  }
  /**
   * Add a style override, this can be any CSS property
   * it will override any built-in style. This is the
   * property and the value as a string (e.g., `color: red`).
   * This will override any other internal style.
   * @param {string} value - CSS style(s) to add.
   * @example
   * style.addOverride('background-color: red');
   */
  addOverride(...value) {
    const toAdd = value.filter((v) => !this._overrides.includes(v));
    toAdd.length > 0 && (this._overrides.push(...toAdd), this.styleID++);
  }
  /**
   * Remove any overrides that match the value.
   * @param {string} value - CSS style to remove.
   * @example
   * style.removeOverride('background-color: red');
   */
  removeOverride(...value) {
    const toRemove = value.filter((v) => this._overrides.includes(v));
    toRemove.length > 0 && (this._overrides = this._overrides.filter((v) => !toRemove.includes(v)), this.styleID++);
  }
  /**
   * Internally converts all of the style properties into CSS equivalents.
   * @param scale
   * @returns The CSS style string, for setting `style` property of root HTMLElement.
   */
  toCSS(scale) {
    return [
      `transform: scale(${scale})`,
      "transform-origin: top left",
      "display: inline-block",
      `color: ${this.normalizeColor(this.fill)}`,
      `font-size: ${this.fontSize}px`,
      `font-family: ${this.fontFamily}`,
      `font-weight: ${this.fontWeight}`,
      `font-style: ${this.fontStyle}`,
      `font-variant: ${this.fontVariant}`,
      `letter-spacing: ${this.letterSpacing}px`,
      `text-align: ${this.align}`,
      `padding: ${this.padding}px`,
      `white-space: ${this.whiteSpace}`,
      ...this.lineHeight ? [`line-height: ${this.lineHeight}px`] : [],
      ...this.wordWrap ? [
        `word-wrap: ${this.breakWords ? "break-all" : "break-word"}`,
        `max-width: ${this.wordWrapWidth}px`
      ] : [],
      ...this.strokeThickness ? [
        `-webkit-text-stroke-width: ${this.strokeThickness}px`,
        `-webkit-text-stroke-color: ${this.normalizeColor(this.stroke)}`,
        `text-stroke-width: ${this.strokeThickness}px`,
        `text-stroke-color: ${this.normalizeColor(this.stroke)}`,
        "paint-order: stroke"
      ] : [],
      ...this.dropShadow ? [this.dropShadowToCSS()] : [],
      ...this._overrides
    ].join(";");
  }
  /** Get the font CSS styles from the loaded font, If available. */
  toGlobalCSS() {
    return this._fonts.reduce((result, font) => `${result}
            @font-face {
                font-family: "${font.family}";
                src: url('${font.dataSrc}');
                font-weight: ${font.weight};
                font-style: ${font.style};
                font-display: ${font.display};
            }`, this._stylesheet);
  }
  /** Internal stylesheet contents, useful for creating rules for rendering */
  get stylesheet() {
    return this._stylesheet;
  }
  set stylesheet(value) {
    this._stylesheet !== value && (this._stylesheet = value, this.styleID++);
  }
  /**
   * Convert numerical colors into hex-strings
   * @param color
   */
  normalizeColor(color) {
    return Array.isArray(color) && (color = core.utils.rgb2hex(color)), typeof color == "number" ? core.utils.hex2string(color) : color;
  }
  /** Convert the internal drop-shadow settings to CSS text-shadow */
  dropShadowToCSS() {
    let color = this.normalizeColor(this.dropShadowColor);
    const alpha = this.dropShadowAlpha, x = Math.round(Math.cos(this.dropShadowAngle) * this.dropShadowDistance), y = Math.round(Math.sin(this.dropShadowAngle) * this.dropShadowDistance);
    color.startsWith("#") && alpha < 1 && (color += (alpha * 255 | 0).toString(16).padStart(2, "0"));
    const position = `${x}px ${y}px`;
    return this.dropShadowBlur > 0 ? `text-shadow: ${position} ${this.dropShadowBlur}px ${color}` : `text-shadow: ${position} ${color}`;
  }
  /** Resets all properties to the defaults specified in TextStyle.prototype._default */
  reset() {
    Object.assign(this, _HTMLTextStyle2.defaultOptions);
  }
  /**
   * Called after the image is loaded but before drawing to the canvas.
   * Mostly used to handle Safari's font loading bug.
   * @ignore
   */
  onBeforeDraw() {
    const { fontsDirty: prevFontsDirty } = this;
    return this.fontsDirty = !1, this.isSafari && this._fonts.length > 0 && prevFontsDirty ? new Promise((resolve) => setTimeout(resolve, 100)) : Promise.resolve();
  }
  /**
   * Proving that Safari is the new IE
   * @ignore
   */
  get isSafari() {
    const { userAgent } = core.settings.ADAPTER.getNavigator();
    return /^((?!chrome|android).)*safari/i.test(userAgent);
  }
  set fillGradientStops(_value) {
    console.warn("[HTMLTextStyle] fillGradientStops is not supported by HTMLText");
  }
  get fillGradientStops() {
    return super.fillGradientStops;
  }
  set fillGradientType(_value) {
    console.warn("[HTMLTextStyle] fillGradientType is not supported by HTMLText");
  }
  get fillGradientType() {
    return super.fillGradientType;
  }
  set miterLimit(_value) {
    console.warn("[HTMLTextStyle] miterLimit is not supported by HTMLText");
  }
  get miterLimit() {
    return super.miterLimit;
  }
  set trim(_value) {
    console.warn("[HTMLTextStyle] trim is not supported by HTMLText");
  }
  get trim() {
    return super.trim;
  }
  set textBaseline(_value) {
    console.warn("[HTMLTextStyle] textBaseline is not supported by HTMLText");
  }
  get textBaseline() {
    return super.textBaseline;
  }
  set leading(_value) {
    console.warn("[HTMLTextStyle] leading is not supported by HTMLText");
  }
  get leading() {
    return super.leading;
  }
  set lineJoin(_value) {
    console.warn("[HTMLTextStyle] lineJoin is not supported by HTMLText");
  }
  get lineJoin() {
    return super.lineJoin;
  }
};
_HTMLTextStyle.availableFonts = {}, /**
* List of default options, these are largely the same as TextStyle,
* with the exception of whiteSpace, which is set to 'normal' by default.
*/
_HTMLTextStyle.defaultOptions = {
  /** Align */
  align: "left",
  /** Break words */
  breakWords: !1,
  /** Drop shadow */
  dropShadow: !1,
  /** Drop shadow alpha */
  dropShadowAlpha: 1,
  /**
   * Drop shadow angle
   * @type {number}
   * @default Math.PI / 6
   */
  dropShadowAngle: Math.PI / 6,
  /** Drop shadow blur */
  dropShadowBlur: 0,
  /** Drop shadow color */
  dropShadowColor: "black",
  /** Drop shadow distance */
  dropShadowDistance: 5,
  /** Fill */
  fill: "black",
  /** Font family */
  fontFamily: "Arial",
  /** Font size */
  fontSize: 26,
  /** Font style */
  fontStyle: "normal",
  /** Font variant */
  fontVariant: "normal",
  /** Font weight */
  fontWeight: "normal",
  /** Letter spacing */
  letterSpacing: 0,
  /** Line height */
  lineHeight: 0,
  /** Padding */
  padding: 0,
  /** Stroke */
  stroke: "black",
  /** Stroke thickness */
  strokeThickness: 0,
  /** White space */
  whiteSpace: "normal",
  /** Word wrap */
  wordWrap: !1,
  /** Word wrap width */
  wordWrapWidth: 100
};
let HTMLTextStyle = _HTMLTextStyle;
exports.HTMLTextStyle = HTMLTextStyle;
//# sourceMappingURL=HTMLTextStyle.js.map
