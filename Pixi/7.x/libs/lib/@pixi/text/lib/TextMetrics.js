"use strict";
var core = require("@pixi/core");
const contextSettings = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, _TextMetrics = class _TextMetrics2 {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see PIXI.TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let result = _TextMetrics2._experimentalLetterSpacingSupported;
    if (result !== void 0) {
      const proto = core.settings.ADAPTER.getCanvasRenderingContext2D().prototype;
      result = _TextMetrics2._experimentalLetterSpacingSupported = "letterSpacing" in proto || "textLetterSpacing" in proto;
    }
    return result;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
    this.text = text, this.style = style, this.width = width, this.height = height, this.lines = lines, this.lineWidths = lineWidths, this.lineHeight = lineHeight, this.maxLineWidth = maxLineWidth, this.fontProperties = fontProperties;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param wordWrap - Override for if word-wrap should be applied to the text.
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns Measured width and height of the text.
   */
  static measureText(text, style, wordWrap, canvas = _TextMetrics2._canvas) {
    wordWrap = wordWrap ?? style.wordWrap;
    const font = style.toFontString(), fontProperties = _TextMetrics2.measureFont(font);
    fontProperties.fontSize === 0 && (fontProperties.fontSize = style.fontSize, fontProperties.ascent = style.fontSize);
    const context = canvas.getContext("2d", contextSettings);
    context.font = font;
    const lines = (wordWrap ? _TextMetrics2.wordWrap(text, style, canvas) : text).split(/(?:\r\n|\r|\n)/), lineWidths = new Array(lines.length);
    let maxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineWidth = _TextMetrics2._measureText(lines[i], style.letterSpacing, context);
      lineWidths[i] = lineWidth, maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }
    let width = maxLineWidth + style.strokeThickness;
    style.dropShadow && (width += style.dropShadowDistance);
    const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
    let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness * 2) + style.leading + (lines.length - 1) * (lineHeight + style.leading);
    return style.dropShadow && (height += style.dropShadowDistance), new _TextMetrics2(
      text,
      style,
      width,
      height,
      lines,
      lineWidths,
      lineHeight + style.leading,
      maxLineWidth,
      fontProperties
    );
  }
  static _measureText(text, letterSpacing, context) {
    let useExperimentalLetterSpacing = !1;
    _TextMetrics2.experimentalLetterSpacingSupported && (_TextMetrics2.experimentalLetterSpacing ? (context.letterSpacing = `${letterSpacing}px`, context.textLetterSpacing = `${letterSpacing}px`, useExperimentalLetterSpacing = !0) : (context.letterSpacing = "0px", context.textLetterSpacing = "0px"));
    let width = context.measureText(text).width;
    return width > 0 && (useExperimentalLetterSpacing ? width -= letterSpacing : width += (_TextMetrics2.graphemeSegmenter(text).length - 1) * letterSpacing), width;
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static wordWrap(text, style, canvas = _TextMetrics2._canvas) {
    const context = canvas.getContext("2d", contextSettings);
    let width = 0, line = "", lines = "";
    const cache = /* @__PURE__ */ Object.create(null), { letterSpacing, whiteSpace } = style, collapseSpaces = _TextMetrics2.collapseSpaces(whiteSpace), collapseNewlines = _TextMetrics2.collapseNewlines(whiteSpace);
    let canPrependSpaces = !collapseSpaces;
    const wordWrapWidth = style.wordWrapWidth + letterSpacing, tokens = _TextMetrics2.tokenize(text);
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (_TextMetrics2.isNewline(token)) {
        if (!collapseNewlines) {
          lines += _TextMetrics2.addLine(line), canPrependSpaces = !collapseSpaces, line = "", width = 0;
          continue;
        }
        token = " ";
      }
      if (collapseSpaces) {
        const currIsBreakingSpace = _TextMetrics2.isBreakingSpace(token), lastIsBreakingSpace = _TextMetrics2.isBreakingSpace(line[line.length - 1]);
        if (currIsBreakingSpace && lastIsBreakingSpace)
          continue;
      }
      const tokenWidth = _TextMetrics2.getFromCache(token, letterSpacing, cache, context);
      if (tokenWidth > wordWrapWidth)
        if (line !== "" && (lines += _TextMetrics2.addLine(line), line = "", width = 0), _TextMetrics2.canBreakWords(token, style.breakWords)) {
          const characters = _TextMetrics2.wordWrapSplit(token);
          for (let j = 0; j < characters.length; j++) {
            let char = characters[j], lastChar = char, k = 1;
            for (; characters[j + k]; ) {
              const nextChar = characters[j + k];
              if (!_TextMetrics2.canBreakChars(lastChar, nextChar, token, j, style.breakWords))
                char += nextChar;
              else
                break;
              lastChar = nextChar, k++;
            }
            j += k - 1;
            const characterWidth = _TextMetrics2.getFromCache(char, letterSpacing, cache, context);
            characterWidth + width > wordWrapWidth && (lines += _TextMetrics2.addLine(line), canPrependSpaces = !1, line = "", width = 0), line += char, width += characterWidth;
          }
        } else {
          line.length > 0 && (lines += _TextMetrics2.addLine(line), line = "", width = 0);
          const isLastToken = i === tokens.length - 1;
          lines += _TextMetrics2.addLine(token, !isLastToken), canPrependSpaces = !1, line = "", width = 0;
        }
      else
        tokenWidth + width > wordWrapWidth && (canPrependSpaces = !1, lines += _TextMetrics2.addLine(line), line = "", width = 0), (line.length > 0 || !_TextMetrics2.isBreakingSpace(token) || canPrependSpaces) && (line += token, width += tokenWidth);
    }
    return lines += _TextMetrics2.addLine(line, !1), lines;
  }
  /**
   * Convienience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static addLine(line, newLine = !0) {
    return line = _TextMetrics2.trimRight(line), line = newLine ? `${line}
` : line, line;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static getFromCache(key, letterSpacing, cache, context) {
    let width = cache[key];
    return typeof width != "number" && (width = _TextMetrics2._measureText(key, letterSpacing, context) + letterSpacing, cache[key] = width), width;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static collapseSpaces(whiteSpace) {
    return whiteSpace === "normal" || whiteSpace === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static collapseNewlines(whiteSpace) {
    return whiteSpace === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static trimRight(text) {
    if (typeof text != "string")
      return "";
    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      if (!_TextMetrics2.isBreakingSpace(char))
        break;
      text = text.slice(0, -1);
    }
    return text;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static isNewline(char) {
    return typeof char != "string" ? !1 : _TextMetrics2._newlines.includes(char.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(char, _nextChar) {
    return typeof char != "string" ? !1 : _TextMetrics2._breakingSpaces.includes(char.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static tokenize(text) {
    const tokens = [];
    let token = "";
    if (typeof text != "string")
      return tokens;
    for (let i = 0; i < text.length; i++) {
      const char = text[i], nextChar = text[i + 1];
      if (_TextMetrics2.isBreakingSpace(char, nextChar) || _TextMetrics2.isNewline(char)) {
        token !== "" && (tokens.push(token), token = ""), tokens.push(char);
        continue;
      }
      token += char;
    }
    return token !== "" && tokens.push(token), tokens;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(_token, breakWords) {
    return breakWords;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(_char, _nextChar, _token, _index, _breakWords) {
    return !0;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see TextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(token) {
    return _TextMetrics2.graphemeSegmenter(token);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(font) {
    if (_TextMetrics2._fonts[font])
      return _TextMetrics2._fonts[font];
    const properties = {
      ascent: 0,
      descent: 0,
      fontSize: 0
    }, canvas = _TextMetrics2._canvas, context = _TextMetrics2._context;
    context.font = font;
    const metricsString = _TextMetrics2.METRICS_STRING + _TextMetrics2.BASELINE_SYMBOL, width = Math.ceil(context.measureText(metricsString).width);
    let baseline = Math.ceil(context.measureText(_TextMetrics2.BASELINE_SYMBOL).width);
    const height = Math.ceil(_TextMetrics2.HEIGHT_MULTIPLIER * baseline);
    if (baseline = baseline * _TextMetrics2.BASELINE_MULTIPLIER | 0, width === 0 || height === 0)
      return _TextMetrics2._fonts[font] = properties, properties;
    canvas.width = width, canvas.height = height, context.fillStyle = "#f00", context.fillRect(0, 0, width, height), context.font = font, context.textBaseline = "alphabetic", context.fillStyle = "#000", context.fillText(metricsString, 0, baseline);
    const imagedata = context.getImageData(0, 0, width, height).data, pixels = imagedata.length, line = width * 4;
    let i = 0, idx = 0, stop = !1;
    for (i = 0; i < baseline; ++i) {
      for (let j = 0; j < line; j += 4)
        if (imagedata[idx + j] !== 255) {
          stop = !0;
          break;
        }
      if (!stop)
        idx += line;
      else
        break;
    }
    for (properties.ascent = baseline - i, idx = pixels - line, stop = !1, i = height; i > baseline; --i) {
      for (let j = 0; j < line; j += 4)
        if (imagedata[idx + j] !== 255) {
          stop = !0;
          break;
        }
      if (!stop)
        idx -= line;
      else
        break;
    }
    return properties.descent = i - baseline, properties.fontSize = properties.ascent + properties.descent, _TextMetrics2._fonts[font] = properties, properties;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(font = "") {
    font ? delete _TextMetrics2._fonts[font] : _TextMetrics2._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!_TextMetrics2.__canvas) {
      let canvas;
      try {
        const c = new OffscreenCanvas(0, 0);
        if (c.getContext("2d", contextSettings)?.measureText)
          return _TextMetrics2.__canvas = c, c;
        canvas = core.settings.ADAPTER.createCanvas();
      } catch {
        canvas = core.settings.ADAPTER.createCanvas();
      }
      canvas.width = canvas.height = 10, _TextMetrics2.__canvas = canvas;
    }
    return _TextMetrics2.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return _TextMetrics2.__context || (_TextMetrics2.__context = _TextMetrics2._canvas.getContext("2d", contextSettings)), _TextMetrics2.__context;
  }
};
_TextMetrics.METRICS_STRING = "|\xC9q\xC5", /** Baseline symbol for calculate font metrics. */
_TextMetrics.BASELINE_SYMBOL = "M", /** Baseline multiplier for calculate font metrics. */
_TextMetrics.BASELINE_MULTIPLIER = 1.4, /** Height multiplier for setting height of canvas to calculate font metrics. */
_TextMetrics.HEIGHT_MULTIPLIER = 2, /**
* A Unicode "character", or "grapheme cluster", can be composed of multiple Unicode code points,
* such as letters with diacritical marks (e.g. `'\u0065\u0301'`, letter e with acute)
* or emojis with modifiers (e.g. `'\uD83E\uDDD1\u200D\uD83D\uDCBB'`, technologist).
* The new `Intl.Segmenter` API in ES2022 can split the string into grapheme clusters correctly. If it is not available,
* PixiJS will fallback to use the iterator of String, which can only spilt the string into code points.
* If you want to get full functionality in environments that don't support `Intl.Segmenter` (such as Firefox),
* you can use other libraries such as [grapheme-splitter]{@link https://www.npmjs.com/package/grapheme-splitter}
* or [graphemer]{@link https://www.npmjs.com/package/graphemer} to create a polyfill. Since these libraries can be
* relatively large in size to handle various Unicode grapheme clusters properly, PixiJS won't use them directly.
*/
_TextMetrics.graphemeSegmenter = (() => {
  if (typeof Intl?.Segmenter == "function") {
    const segmenter = new Intl.Segmenter();
    return (s) => [...segmenter.segment(s)].map((x) => x.segment);
  }
  return (s) => [...s];
})(), /**
* New rendering behavior for letter-spacing which uses Chrome's new native API. This will
* lead to more accurate letter-spacing results because it does not try to manually draw
* each character. However, this Chrome API is experimental and may not serve all cases yet.
* @see PIXI.TextMetrics.experimentalLetterSpacingSupported
*/
_TextMetrics.experimentalLetterSpacing = !1, /** Cache of {@see PIXI.TextMetrics.FontMetrics} objects. */
_TextMetrics._fonts = {}, /** Cache of new line chars. */
_TextMetrics._newlines = [
  10,
  // line feed
  13
  // carriage return
], /** Cache of breaking spaces. */
_TextMetrics._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
let TextMetrics = _TextMetrics;
exports.TextMetrics = TextMetrics;
//# sourceMappingURL=TextMetrics.js.map
