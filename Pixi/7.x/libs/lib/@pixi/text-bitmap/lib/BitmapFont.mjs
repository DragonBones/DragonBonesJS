import { utils, ALPHA_MODES, MIPMAP_MODES, Rectangle, Texture, settings, BaseTexture } from "@pixi/core";
import { TextStyle, TextMetrics } from "@pixi/text";
import { BitmapFontData } from "./BitmapFontData.mjs";
import { autoDetectFormat } from "./formats/index.mjs";
import "./utils/index.mjs";
import { resolveCharacters } from "./utils/resolveCharacters.mjs";
import { drawGlyph } from "./utils/drawGlyph.mjs";
import { extractCharCode } from "./utils/extractCharCode.mjs";
const _BitmapFont = class _BitmapFont2 {
  /**
   * @param data
   * @param textures
   * @param ownsTextures - Setting to `true` will destroy page textures
   *        when the font is uninstalled.
   */
  constructor(data, textures, ownsTextures) {
    const [info] = data.info, [common] = data.common, [page] = data.page, [distanceField] = data.distanceField, res = utils.getResolutionOfUrl(page.file), pageTextures = {};
    this._ownsTextures = ownsTextures, this.font = info.face, this.size = info.size, this.lineHeight = common.lineHeight / res, this.chars = {}, this.pageTextures = pageTextures;
    for (let i = 0; i < data.page.length; i++) {
      const { id, file } = data.page[i];
      pageTextures[id] = textures instanceof Array ? textures[i] : textures[file], distanceField?.fieldType && distanceField.fieldType !== "none" && (pageTextures[id].baseTexture.alphaMode = ALPHA_MODES.NO_PREMULTIPLIED_ALPHA, pageTextures[id].baseTexture.mipmap = MIPMAP_MODES.OFF);
    }
    for (let i = 0; i < data.char.length; i++) {
      const { id, page: page2 } = data.char[i];
      let { x, y, width, height, xoffset, yoffset, xadvance } = data.char[i];
      x /= res, y /= res, width /= res, height /= res, xoffset /= res, yoffset /= res, xadvance /= res;
      const rect = new Rectangle(
        x + pageTextures[page2].frame.x / res,
        y + pageTextures[page2].frame.y / res,
        width,
        height
      );
      this.chars[id] = {
        xOffset: xoffset,
        yOffset: yoffset,
        xAdvance: xadvance,
        kerning: {},
        texture: new Texture(
          pageTextures[page2].baseTexture,
          rect
        ),
        page: page2
      };
    }
    for (let i = 0; i < data.kerning.length; i++) {
      let { first, second, amount } = data.kerning[i];
      first /= res, second /= res, amount /= res, this.chars[second] && (this.chars[second].kerning[first] = amount);
    }
    this.distanceFieldRange = distanceField?.distanceRange, this.distanceFieldType = distanceField?.fieldType?.toLowerCase() ?? "none";
  }
  /** Remove references to created glyph textures. */
  destroy() {
    for (const id in this.chars)
      this.chars[id].texture.destroy(), this.chars[id].texture = null;
    for (const id in this.pageTextures)
      this._ownsTextures && this.pageTextures[id].destroy(!0), this.pageTextures[id] = null;
    this.chars = null, this.pageTextures = null;
  }
  /**
   * Register a new bitmap font.
   * @param data - The
   *        characters map that could be provided as xml or raw string.
   * @param textures - List of textures for each page.
   * @param ownsTextures - Set to `true` to destroy page textures
   *        when the font is uninstalled. By default fonts created with
   *        `BitmapFont.from` or from the `BitmapFontLoader` are `true`.
   * @returns {PIXI.BitmapFont} Result font object with font, size, lineHeight
   *         and char fields.
   */
  static install(data, textures, ownsTextures) {
    let fontData;
    if (data instanceof BitmapFontData)
      fontData = data;
    else {
      const format = autoDetectFormat(data);
      if (!format)
        throw new Error("Unrecognized data format for font.");
      fontData = format.parse(data);
    }
    textures instanceof Texture && (textures = [textures]);
    const font = new _BitmapFont2(fontData, textures, ownsTextures);
    return _BitmapFont2.available[font.font] = font, font;
  }
  /**
   * Remove bitmap font by name.
   * @param name - Name of the font to uninstall.
   */
  static uninstall(name) {
    const font = _BitmapFont2.available[name];
    if (!font)
      throw new Error(`No font found named '${name}'`);
    font.destroy(), delete _BitmapFont2.available[name];
  }
  /**
   * Generates a bitmap-font for the given style and character set. This does not support
   * kernings yet. With `style` properties, only the following non-layout properties are used:
   *
   * - {@link PIXI.TextStyle#dropShadow|dropShadow}
   * - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
   * - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
   * - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
   * - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
   * - {@link PIXI.TextStyle#fill|fill}
   * - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
   * - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
   * - {@link PIXI.TextStyle#fontFamily|fontFamily}
   * - {@link PIXI.TextStyle#fontSize|fontSize}
   * - {@link PIXI.TextStyle#fontVariant|fontVariant}
   * - {@link PIXI.TextStyle#fontWeight|fontWeight}
   * - {@link PIXI.TextStyle#lineJoin|lineJoin}
   * - {@link PIXI.TextStyle#miterLimit|miterLimit}
   * - {@link PIXI.TextStyle#stroke|stroke}
   * - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
   * - {@link PIXI.TextStyle#textBaseline|textBaseline}
   * @param name - The name of the custom font to use with BitmapText.
   * @param textStyle - Style options to render with BitmapFont.
   * @param options - Setup options for font or name of the font.
   * @returns Font generated by style options.
   * @example
   * import { BitmapFont, BitmapText } from 'pixi.js';
   *
   * BitmapFont.from('TitleFont', {
   *     fontFamily: 'Arial',
   *     fontSize: 12,
   *     strokeThickness: 2,
   *     fill: 'purple',
   * });
   *
   * const title = new BitmapText('This is the title', { fontName: 'TitleFont' });
   */
  static from(name, textStyle, options) {
    if (!name)
      throw new Error("[BitmapFont] Property `name` is required.");
    const {
      chars,
      padding,
      resolution,
      textureWidth,
      textureHeight,
      ...baseOptions
    } = Object.assign({}, _BitmapFont2.defaultOptions, options), charsList = resolveCharacters(chars), style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle), lineWidth = textureWidth, fontData = new BitmapFontData();
    fontData.info[0] = {
      face: style.fontFamily,
      size: style.fontSize
    }, fontData.common[0] = {
      lineHeight: style.fontSize
    };
    let positionX = 0, positionY = 0, canvas, context, baseTexture, maxCharHeight = 0;
    const baseTextures = [], textures = [];
    for (let i = 0; i < charsList.length; i++) {
      canvas || (canvas = settings.ADAPTER.createCanvas(), canvas.width = textureWidth, canvas.height = textureHeight, context = canvas.getContext("2d"), baseTexture = new BaseTexture(canvas, { resolution, ...baseOptions }), baseTextures.push(baseTexture), textures.push(new Texture(baseTexture)), fontData.page.push({
        id: textures.length - 1,
        file: ""
      }));
      const character = charsList[i], metrics = TextMetrics.measureText(character, style, !1, canvas), width = metrics.width, height = Math.ceil(metrics.height), textureGlyphWidth = Math.ceil((style.fontStyle === "italic" ? 2 : 1) * width);
      if (positionY >= textureHeight - height * resolution) {
        if (positionY === 0)
          throw new Error(`[BitmapFont] textureHeight ${textureHeight}px is too small (fontFamily: '${style.fontFamily}', fontSize: ${style.fontSize}px, char: '${character}')`);
        --i, canvas = null, context = null, baseTexture = null, positionY = 0, positionX = 0, maxCharHeight = 0;
        continue;
      }
      if (maxCharHeight = Math.max(height + metrics.fontProperties.descent, maxCharHeight), textureGlyphWidth * resolution + positionX >= lineWidth) {
        if (positionX === 0)
          throw new Error(`[BitmapFont] textureWidth ${textureWidth}px is too small (fontFamily: '${style.fontFamily}', fontSize: ${style.fontSize}px, char: '${character}')`);
        --i, positionY += maxCharHeight * resolution, positionY = Math.ceil(positionY), positionX = 0, maxCharHeight = 0;
        continue;
      }
      drawGlyph(canvas, context, metrics, positionX, positionY, resolution, style);
      const id = extractCharCode(metrics.text);
      fontData.char.push({
        id,
        page: textures.length - 1,
        x: positionX / resolution,
        y: positionY / resolution,
        width: textureGlyphWidth,
        height,
        xoffset: 0,
        yoffset: 0,
        xadvance: width - (style.dropShadow ? style.dropShadowDistance : 0) - (style.stroke ? style.strokeThickness : 0)
      }), positionX += (textureGlyphWidth + 2 * padding) * resolution, positionX = Math.ceil(positionX);
    }
    if (!options?.skipKerning)
      for (let i = 0, len = charsList.length; i < len; i++) {
        const first = charsList[i];
        for (let j = 0; j < len; j++) {
          const second = charsList[j], c1 = context.measureText(first).width, c2 = context.measureText(second).width, amount = context.measureText(first + second).width - (c1 + c2);
          amount && fontData.kerning.push({
            first: extractCharCode(first),
            second: extractCharCode(second),
            amount
          });
        }
      }
    const font = new _BitmapFont2(fontData, textures, !0);
    return _BitmapFont2.available[name] !== void 0 && _BitmapFont2.uninstall(name), _BitmapFont2.available[name] = font, font;
  }
};
_BitmapFont.ALPHA = [["a", "z"], ["A", "Z"], " "], /**
* This character set includes all decimal digits (from 0 to 9).
* @type {string[][]}
* @example
* BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
*/
_BitmapFont.NUMERIC = [["0", "9"]], /**
* This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
* @type {string[][]}
*/
_BitmapFont.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], /**
* This character set consists of all the ASCII table.
* @member {string[][]}
* @see http://www.asciitable.com/
*/
_BitmapFont.ASCII = [[" ", "~"]], /**
* Collection of default options when using `BitmapFont.from`.
* @property {number} [resolution=1] -
* @property {number} [textureWidth=512] -
* @property {number} [textureHeight=512] -
* @property {number} [padding=4] -
* @property {string|string[]|string[][]} chars = PIXI.BitmapFont.ALPHANUMERIC
*/
_BitmapFont.defaultOptions = {
  resolution: 1,
  textureWidth: 512,
  textureHeight: 512,
  padding: 4,
  chars: _BitmapFont.ALPHANUMERIC
}, /** Collection of available/installed fonts. */
_BitmapFont.available = {};
let BitmapFont = _BitmapFont;
export {
  BitmapFont
};
//# sourceMappingURL=BitmapFont.mjs.map
