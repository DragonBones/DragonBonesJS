"use strict";
var core = require("@pixi/core"), display = require("@pixi/display"), mesh = require("@pixi/mesh"), BitmapFont = require("./BitmapFont.js"), msdf$1 = require("./shader/msdf.frag.js"), msdf = require("./shader/msdf.vert.js");
require("./utils/index.js");
var splitTextToCharacters = require("./utils/splitTextToCharacters.js"), extractCharCode = require("./utils/extractCharCode.js");
const pageMeshDataDefaultPageMeshData = [], pageMeshDataMSDFPageMeshData = [], charRenderDataPool = [], _BitmapText = class _BitmapText2 extends display.Container {
  /**
   * @param text - A string that you would like the text to display.
   * @param style - The style parameters.
   * @param {string} style.fontName - The installed BitmapFont name.
   * @param {number} [style.fontSize] - The size of the font in pixels, e.g. 24. If undefined,
   *.     this will default to the BitmapFont size.
   * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center', 'right' or 'justify'),
   *      does not affect single line text.
   * @param {PIXI.ColorSource} [style.tint=0xFFFFFF] - The tint color.
   * @param {number} [style.letterSpacing=0] - The amount of spacing between letters.
   * @param {number} [style.maxWidth=0] - The max width of the text before line wrapping.
   */
  constructor(text, style = {}) {
    super();
    const { align, tint, maxWidth, letterSpacing, fontName, fontSize } = Object.assign(
      {},
      _BitmapText2.styleDefaults,
      style
    );
    if (!BitmapFont.BitmapFont.available[fontName])
      throw new Error(`Missing BitmapFont "${fontName}"`);
    this._activePagesMeshData = [], this._textWidth = 0, this._textHeight = 0, this._align = align, this._tintColor = new core.Color(tint), this._font = void 0, this._fontName = fontName, this._fontSize = fontSize, this.text = text, this._maxWidth = maxWidth, this._maxLineHeight = 0, this._letterSpacing = letterSpacing, this._anchor = new core.ObservablePoint(() => {
      this.dirty = !0;
    }, this, 0, 0), this._roundPixels = core.settings.ROUND_PIXELS, this.dirty = !0, this._resolution = core.settings.RESOLUTION, this._autoResolution = !0, this._textureCache = {};
  }
  /** Renders text and updates it when needed. This should only be called if the BitmapFont is regenerated. */
  updateText() {
    const data = BitmapFont.BitmapFont.available[this._fontName], fontSize = this.fontSize, scale = fontSize / data.size, pos = new core.Point(), chars = [], lineWidths = [], lineSpaces = [], text = this._text.replace(/(?:\r\n|\r)/g, `
`) || " ", charsInput = splitTextToCharacters.splitTextToCharacters(text), maxWidth = this._maxWidth * data.size / fontSize, pageMeshDataPool = data.distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
    let prevCharCode = null, lastLineWidth = 0, maxLineWidth = 0, line = 0, lastBreakPos = -1, lastBreakWidth = 0, spacesRemoved = 0, maxLineHeight = 0, spaceCount = 0;
    for (let i = 0; i < charsInput.length; i++) {
      const char = charsInput[i], charCode = extractCharCode.extractCharCode(char);
      if (/(?:\s)/.test(char) && (lastBreakPos = i, lastBreakWidth = lastLineWidth, spaceCount++), char === "\r" || char === `
`) {
        lineWidths.push(lastLineWidth), lineSpaces.push(-1), maxLineWidth = Math.max(maxLineWidth, lastLineWidth), ++line, ++spacesRemoved, pos.x = 0, pos.y += data.lineHeight, prevCharCode = null, spaceCount = 0;
        continue;
      }
      const charData = data.chars[charCode];
      if (!charData)
        continue;
      prevCharCode && charData.kerning[prevCharCode] && (pos.x += charData.kerning[prevCharCode]);
      const charRenderData = charRenderDataPool.pop() || {
        texture: core.Texture.EMPTY,
        line: 0,
        charCode: 0,
        prevSpaces: 0,
        position: new core.Point()
      };
      charRenderData.texture = charData.texture, charRenderData.line = line, charRenderData.charCode = charCode, charRenderData.position.x = Math.round(pos.x + charData.xOffset + this._letterSpacing / 2), charRenderData.position.y = Math.round(pos.y + charData.yOffset), charRenderData.prevSpaces = spaceCount, chars.push(charRenderData), lastLineWidth = charRenderData.position.x + Math.max(charData.xAdvance - charData.xOffset, charData.texture.orig.width), pos.x += charData.xAdvance + this._letterSpacing, maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height), prevCharCode = charCode, lastBreakPos !== -1 && maxWidth > 0 && pos.x > maxWidth && (++spacesRemoved, core.utils.removeItems(chars, 1 + lastBreakPos - spacesRemoved, 1 + i - lastBreakPos), i = lastBreakPos, lastBreakPos = -1, lineWidths.push(lastBreakWidth), lineSpaces.push(chars.length > 0 ? chars[chars.length - 1].prevSpaces : 0), maxLineWidth = Math.max(maxLineWidth, lastBreakWidth), line++, pos.x = 0, pos.y += data.lineHeight, prevCharCode = null, spaceCount = 0);
    }
    const lastChar = charsInput[charsInput.length - 1];
    lastChar !== "\r" && lastChar !== `
` && (/(?:\s)/.test(lastChar) && (lastLineWidth = lastBreakWidth), lineWidths.push(lastLineWidth), maxLineWidth = Math.max(maxLineWidth, lastLineWidth), lineSpaces.push(-1));
    const lineAlignOffsets = [];
    for (let i = 0; i <= line; i++) {
      let alignOffset = 0;
      this._align === "right" ? alignOffset = maxLineWidth - lineWidths[i] : this._align === "center" ? alignOffset = (maxLineWidth - lineWidths[i]) / 2 : this._align === "justify" && (alignOffset = lineSpaces[i] < 0 ? 0 : (maxLineWidth - lineWidths[i]) / lineSpaces[i]), lineAlignOffsets.push(alignOffset);
    }
    const lenChars = chars.length, pagesMeshData = {}, newPagesMeshData = [], activePagesMeshData = this._activePagesMeshData;
    pageMeshDataPool.push(...activePagesMeshData);
    for (let i = 0; i < lenChars; i++) {
      const texture = chars[i].texture, baseTextureUid = texture.baseTexture.uid;
      if (!pagesMeshData[baseTextureUid]) {
        let pageMeshData = pageMeshDataPool.pop();
        if (!pageMeshData) {
          const geometry = new mesh.MeshGeometry();
          let material, meshBlendMode;
          data.distanceFieldType === "none" ? (material = new mesh.MeshMaterial(core.Texture.EMPTY), meshBlendMode = core.BLEND_MODES.NORMAL) : (material = new mesh.MeshMaterial(
            core.Texture.EMPTY,
            { program: core.Program.from(msdf.default, msdf$1.default), uniforms: { uFWidth: 0 } }
          ), meshBlendMode = core.BLEND_MODES.NORMAL_NPM);
          const mesh$1 = new mesh.Mesh(geometry, material);
          mesh$1.blendMode = meshBlendMode, pageMeshData = {
            index: 0,
            indexCount: 0,
            vertexCount: 0,
            uvsCount: 0,
            total: 0,
            mesh: mesh$1,
            vertices: null,
            uvs: null,
            indices: null
          };
        }
        pageMeshData.index = 0, pageMeshData.indexCount = 0, pageMeshData.vertexCount = 0, pageMeshData.uvsCount = 0, pageMeshData.total = 0;
        const { _textureCache } = this;
        _textureCache[baseTextureUid] = _textureCache[baseTextureUid] || new core.Texture(texture.baseTexture), pageMeshData.mesh.texture = _textureCache[baseTextureUid], pageMeshData.mesh.tint = this._tintColor.value, newPagesMeshData.push(pageMeshData), pagesMeshData[baseTextureUid] = pageMeshData;
      }
      pagesMeshData[baseTextureUid].total++;
    }
    for (let i = 0; i < activePagesMeshData.length; i++)
      newPagesMeshData.includes(activePagesMeshData[i]) || this.removeChild(activePagesMeshData[i].mesh);
    for (let i = 0; i < newPagesMeshData.length; i++)
      newPagesMeshData[i].mesh.parent !== this && this.addChild(newPagesMeshData[i].mesh);
    this._activePagesMeshData = newPagesMeshData;
    for (const i in pagesMeshData) {
      const pageMeshData = pagesMeshData[i], total = pageMeshData.total;
      if (!(pageMeshData.indices?.length > 6 * total) || pageMeshData.vertices.length < mesh.Mesh.BATCHABLE_SIZE * 2)
        pageMeshData.vertices = new Float32Array(4 * 2 * total), pageMeshData.uvs = new Float32Array(4 * 2 * total), pageMeshData.indices = new Uint16Array(6 * total);
      else {
        const total2 = pageMeshData.total, vertices = pageMeshData.vertices;
        for (let i2 = total2 * 4 * 2; i2 < vertices.length; i2++)
          vertices[i2] = 0;
      }
      pageMeshData.mesh.size = 6 * total;
    }
    for (let i = 0; i < lenChars; i++) {
      const char = chars[i];
      let offset = char.position.x + lineAlignOffsets[char.line] * (this._align === "justify" ? char.prevSpaces : 1);
      this._roundPixels && (offset = Math.round(offset));
      const xPos = offset * scale, yPos = char.position.y * scale, texture = char.texture, pageMesh = pagesMeshData[texture.baseTexture.uid], textureFrame = texture.frame, textureUvs = texture._uvs, index = pageMesh.index++;
      pageMesh.indices[index * 6 + 0] = 0 + index * 4, pageMesh.indices[index * 6 + 1] = 1 + index * 4, pageMesh.indices[index * 6 + 2] = 2 + index * 4, pageMesh.indices[index * 6 + 3] = 0 + index * 4, pageMesh.indices[index * 6 + 4] = 2 + index * 4, pageMesh.indices[index * 6 + 5] = 3 + index * 4, pageMesh.vertices[index * 8 + 0] = xPos, pageMesh.vertices[index * 8 + 1] = yPos, pageMesh.vertices[index * 8 + 2] = xPos + textureFrame.width * scale, pageMesh.vertices[index * 8 + 3] = yPos, pageMesh.vertices[index * 8 + 4] = xPos + textureFrame.width * scale, pageMesh.vertices[index * 8 + 5] = yPos + textureFrame.height * scale, pageMesh.vertices[index * 8 + 6] = xPos, pageMesh.vertices[index * 8 + 7] = yPos + textureFrame.height * scale, pageMesh.uvs[index * 8 + 0] = textureUvs.x0, pageMesh.uvs[index * 8 + 1] = textureUvs.y0, pageMesh.uvs[index * 8 + 2] = textureUvs.x1, pageMesh.uvs[index * 8 + 3] = textureUvs.y1, pageMesh.uvs[index * 8 + 4] = textureUvs.x2, pageMesh.uvs[index * 8 + 5] = textureUvs.y2, pageMesh.uvs[index * 8 + 6] = textureUvs.x3, pageMesh.uvs[index * 8 + 7] = textureUvs.y3;
    }
    this._textWidth = maxLineWidth * scale, this._textHeight = (pos.y + data.lineHeight) * scale;
    for (const i in pagesMeshData) {
      const pageMeshData = pagesMeshData[i];
      if (this.anchor.x !== 0 || this.anchor.y !== 0) {
        let vertexCount = 0;
        const anchorOffsetX = this._textWidth * this.anchor.x, anchorOffsetY = this._textHeight * this.anchor.y;
        for (let i2 = 0; i2 < pageMeshData.total; i2++)
          pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY, pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY, pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY, pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
      }
      this._maxLineHeight = maxLineHeight * scale;
      const vertexBuffer = pageMeshData.mesh.geometry.getBuffer("aVertexPosition"), textureBuffer = pageMeshData.mesh.geometry.getBuffer("aTextureCoord"), indexBuffer = pageMeshData.mesh.geometry.getIndex();
      vertexBuffer.data = pageMeshData.vertices, textureBuffer.data = pageMeshData.uvs, indexBuffer.data = pageMeshData.indices, vertexBuffer.update(), textureBuffer.update(), indexBuffer.update();
    }
    for (let i = 0; i < chars.length; i++)
      charRenderDataPool.push(chars[i]);
    this._font = data, this.dirty = !1;
  }
  updateTransform() {
    this.validate(), this.containerUpdateTransform();
  }
  _render(renderer) {
    this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0);
    const { distanceFieldRange, distanceFieldType, size } = BitmapFont.BitmapFont.available[this._fontName];
    if (distanceFieldType !== "none") {
      const { a, b, c, d } = this.worldTransform, dx = Math.sqrt(a * a + b * b), dy = Math.sqrt(c * c + d * d), worldScale = (Math.abs(dx) + Math.abs(dy)) / 2, fontScale = this.fontSize / size, resolution = renderer._view.resolution;
      for (const mesh2 of this._activePagesMeshData)
        mesh2.mesh.shader.uniforms.uFWidth = worldScale * distanceFieldRange * fontScale * resolution;
    }
    super._render(renderer);
  }
  /**
   * Validates text before calling parent's getLocalBounds
   * @returns - The rectangular bounding area
   */
  getLocalBounds() {
    return this.validate(), super.getLocalBounds();
  }
  /**
   * Updates text when needed
   * @private
   */
  validate() {
    const font = BitmapFont.BitmapFont.available[this._fontName];
    if (!font)
      throw new Error(`Missing BitmapFont "${this._fontName}"`);
    this._font !== font && (this.dirty = !0), this.dirty && this.updateText();
  }
  /**
   * The tint of the BitmapText object.
   * @default 0xffffff
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    if (this.tint !== value) {
      this._tintColor.setValue(value);
      for (let i = 0; i < this._activePagesMeshData.length; i++)
        this._activePagesMeshData[i].mesh.tint = value;
    }
  }
  /**
   * The alignment of the BitmapText object.
   * @member {string}
   * @default 'left'
   */
  get align() {
    return this._align;
  }
  set align(value) {
    this._align !== value && (this._align = value, this.dirty = !0);
  }
  /** The name of the BitmapFont. */
  get fontName() {
    return this._fontName;
  }
  set fontName(value) {
    if (!BitmapFont.BitmapFont.available[value])
      throw new Error(`Missing BitmapFont "${value}"`);
    this._fontName !== value && (this._fontName = value, this.dirty = !0);
  }
  /** The size of the font to display. */
  get fontSize() {
    return this._fontSize ?? BitmapFont.BitmapFont.available[this._fontName].size;
  }
  set fontSize(value) {
    this._fontSize !== value && (this._fontSize = value, this.dirty = !0);
  }
  /**
   * The anchor sets the origin point of the text.
   *
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    typeof value == "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
  }
  /** The text of the BitmapText object. */
  get text() {
    return this._text;
  }
  set text(text) {
    text = String(text ?? ""), this._text !== text && (this._text = text, this.dirty = !0);
  }
  /**
   * The max width of this bitmap text in pixels. If the text provided is longer than the
   * value provided, line breaks will be automatically inserted in the last whitespace.
   * Disable by setting the value to 0.
   */
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(value) {
    this._maxWidth !== value && (this._maxWidth = value, this.dirty = !0);
  }
  /**
   * The max line height. This is useful when trying to use the total height of the Text,
   * i.e. when trying to vertically align.
   * @readonly
   */
  get maxLineHeight() {
    return this.validate(), this._maxLineHeight;
  }
  /**
   * The width of the overall text, different from fontSize,
   * which is defined in the style object.
   * @readonly
   */
  get textWidth() {
    return this.validate(), this._textWidth;
  }
  /** Additional space between characters. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(value) {
    this._letterSpacing !== value && (this._letterSpacing = value, this.dirty = !0);
  }
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
   * @default PIXI.settings.ROUND_PIXELS
   */
  get roundPixels() {
    return this._roundPixels;
  }
  set roundPixels(value) {
    value !== this._roundPixels && (this._roundPixels = value, this.dirty = !0);
  }
  /**
   * The height of the overall text, different from fontSize,
   * which is defined in the style object.
   * @readonly
   */
  get textHeight() {
    return this.validate(), this._textHeight;
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
  destroy(options) {
    const { _textureCache } = this, pageMeshDataPool = BitmapFont.BitmapFont.available[this._fontName].distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
    pageMeshDataPool.push(...this._activePagesMeshData);
    for (const pageMeshData of this._activePagesMeshData)
      this.removeChild(pageMeshData.mesh);
    this._activePagesMeshData = [], pageMeshDataPool.filter((page) => _textureCache[page.mesh.texture.baseTexture.uid]).forEach((page) => {
      page.mesh.texture = core.Texture.EMPTY;
    });
    for (const id in _textureCache)
      _textureCache[id].destroy(), delete _textureCache[id];
    this._font = null, this._tintColor = null, this._textureCache = null, super.destroy(options);
  }
};
_BitmapText.styleDefaults = {
  align: "left",
  tint: 16777215,
  maxWidth: 0,
  letterSpacing: 0
};
let BitmapText = _BitmapText;
exports.BitmapText = BitmapText;
//# sourceMappingURL=BitmapText.js.map
