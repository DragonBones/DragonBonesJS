import { Texture, settings, Rectangle, utils } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { TextStyle } from "@pixi/text";
import { HTMLTextStyle } from "./HTMLTextStyle.mjs";
const _HTMLText = class _HTMLText2 extends Sprite {
  /**
   * @param {string} [text] - Text contents
   * @param {PIXI.HTMLTextStyle|PIXI.TextStyle|PIXI.ITextStyle} [style] - Style setting to use.
   *        Strongly recommend using an HTMLTextStyle object. Providing a PIXI.TextStyle
   *        will convert the TextStyle to an HTMLTextStyle and will no longer be linked.
   */
  constructor(text = "", style = {}) {
    super(Texture.EMPTY), this._text = null, this._style = null, this._autoResolution = !0, this.localStyleID = -1, this.dirty = !1, this._updateID = 0, this.ownsStyle = !1;
    const image = new Image(), texture = Texture.from(image, {
      scaleMode: settings.SCALE_MODE,
      resourceOptions: {
        autoLoad: !1
      }
    });
    texture.orig = new Rectangle(), texture.trim = new Rectangle(), this.texture = texture;
    const nssvg = "http://www.w3.org/2000/svg", nsxhtml = "http://www.w3.org/1999/xhtml", svgRoot = document.createElementNS(nssvg, "svg"), foreignObject = document.createElementNS(nssvg, "foreignObject"), domElement = document.createElementNS(nsxhtml, "div"), styleElement = document.createElementNS(nsxhtml, "style");
    foreignObject.setAttribute("width", "10000"), foreignObject.setAttribute("height", "10000"), foreignObject.style.overflow = "hidden", svgRoot.appendChild(foreignObject), this.maxWidth = _HTMLText2.defaultMaxWidth, this.maxHeight = _HTMLText2.defaultMaxHeight, this._domElement = domElement, this._styleElement = styleElement, this._svgRoot = svgRoot, this._foreignObject = foreignObject, this._foreignObject.appendChild(styleElement), this._foreignObject.appendChild(domElement), this._image = image, this._loadImage = new Image(), this._autoResolution = _HTMLText2.defaultAutoResolution, this._resolution = _HTMLText2.defaultResolution ?? settings.RESOLUTION, this.text = text, this.style = style;
  }
  /**
   * Calculate the size of the output text without actually drawing it.
   * This includes the `padding` in the `style` object.
   * This can be used as a fast-pass to do things like text-fitting.
   * @param {object} [overrides] - Overrides for the text, style, and resolution.
   * @param {string} [overrides.text] - The text to measure, if not specified, the current text is used.
   * @param {PIXI.HTMLTextStyle} [overrides.style] - The style to measure, if not specified, the current style is used.
   * @param {number} [overrides.resolution] - The resolution to measure, if not specified, the current resolution is used.
   * @returns {PIXI.ISize} Width and height of the measured text.
   */
  measureText(overrides) {
    const { text, style, resolution } = Object.assign({
      text: this._text,
      style: this._style,
      resolution: this._resolution
    }, overrides);
    Object.assign(this._domElement, {
      innerHTML: text,
      style: style.toCSS(resolution)
    }), this._styleElement.textContent = style.toGlobalCSS(), document.body.appendChild(this._svgRoot);
    const contentBounds = this._domElement.getBoundingClientRect();
    this._svgRoot.remove();
    const { width, height } = contentBounds;
    (width > this.maxWidth || height > this.maxHeight) && console.warn("[HTMLText] Large expanse of text, increase HTMLText.maxWidth or HTMLText.maxHeight property.");
    const contentWidth = Math.min(this.maxWidth, Math.ceil(width)), contentHeight = Math.min(this.maxHeight, Math.ceil(height));
    return this._svgRoot.setAttribute("width", contentWidth.toString()), this._svgRoot.setAttribute("height", contentHeight.toString()), text !== this._text && (this._domElement.innerHTML = this._text), style !== this._style && (Object.assign(this._domElement, { style: this._style?.toCSS(resolution) }), this._styleElement.textContent = this._style?.toGlobalCSS()), {
      width: contentWidth + style.padding * 2,
      height: contentHeight + style.padding * 2
    };
  }
  /**
   * Manually refresh the text.
   * @public
   * @param {boolean} respectDirty - Whether to abort updating the
   *        text if the Text isn't dirty and the function is called.
   */
  async updateText(respectDirty = !0) {
    const { style, _image: image, _loadImage: loadImage } = this;
    if (this.localStyleID !== style.styleID && (this.dirty = !0, this.localStyleID = style.styleID), !this.dirty && respectDirty)
      return;
    const { width, height } = this.measureText();
    image.width = loadImage.width = Math.ceil(Math.max(1, width)), image.height = loadImage.height = Math.ceil(Math.max(1, height)), this._updateID++;
    const updateID = this._updateID;
    await new Promise((resolve) => {
      loadImage.onload = async () => {
        if (updateID < this._updateID) {
          resolve();
          return;
        }
        await style.onBeforeDraw(), image.src = loadImage.src, loadImage.onload = null, loadImage.src = "", this.updateTexture(), resolve();
      };
      const svgURL = new XMLSerializer().serializeToString(this._svgRoot);
      loadImage.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(svgURL)}`;
    });
  }
  /** The raw image element that is rendered under-the-hood. */
  get source() {
    return this._image;
  }
  /**
   * Update the texture resource.
   * @private
   */
  updateTexture() {
    const { style, texture, _image: image, resolution } = this, { padding } = style, { baseTexture } = texture;
    texture.trim.width = texture._frame.width = image.width / resolution, texture.trim.height = texture._frame.height = image.height / resolution, texture.trim.x = -padding, texture.trim.y = -padding, texture.orig.width = texture._frame.width - padding * 2, texture.orig.height = texture._frame.height - padding * 2, this._onTextureUpdate(), baseTexture.setRealSize(image.width, image.height, resolution), this.dirty = !1;
  }
  /**
   * Renders the object using the WebGL renderer
   * @param {PIXI.Renderer} renderer - The renderer
   * @private
   */
  _render(renderer) {
    this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0), this.updateText(!0), super._render(renderer);
  }
  /**
   * Renders the object using the Canvas Renderer.
   * @private
   * @param {PIXI.CanvasRenderer} renderer - The renderer
   */
  _renderCanvas(renderer) {
    this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0), this.updateText(!0), super._renderCanvas(renderer);
  }
  /**
   * Get the local bounds.
   * @param {PIXI.Rectangle} rect - Input rectangle.
   * @returns {PIXI.Rectangle} Local bounds
   */
  getLocalBounds(rect) {
    return this.updateText(!0), super.getLocalBounds(rect);
  }
  _calculateBounds() {
    this.updateText(!0), this.calculateVertices(), this._bounds.addQuad(this.vertexData);
  }
  /**
   * Handle dirty style changes
   * @private
   */
  _onStyleChange() {
    this.dirty = !0;
  }
  /**
   * Destroy this Text object. Don't use after calling.
   * @param {boolean|object} options - Same as Sprite destroy options.
   */
  destroy(options) {
    typeof options == "boolean" && (options = { children: options }), options = Object.assign({}, _HTMLText2.defaultDestroyOptions, options), super.destroy(options);
    const forceClear = null;
    this.ownsStyle && this._style?.cleanFonts(), this._style = forceClear, this._svgRoot?.remove(), this._svgRoot = forceClear, this._domElement?.remove(), this._domElement = forceClear, this._foreignObject?.remove(), this._foreignObject = forceClear, this._styleElement?.remove(), this._styleElement = forceClear, this._loadImage.src = "", this._loadImage.onload = null, this._loadImage = forceClear, this._image.src = "", this._image = forceClear;
  }
  /**
   * Get the width in pixels.
   * @member {number}
   */
  get width() {
    return this.updateText(!0), Math.abs(this.scale.x) * this._image.width / this.resolution;
  }
  set width(value) {
    this.updateText(!0);
    const s = utils.sign(this.scale.x) || 1;
    this.scale.x = s * value / this._image.width / this.resolution, this._width = value;
  }
  /**
   * Get the height in pixels.
   * @member {number}
   */
  get height() {
    return this.updateText(!0), Math.abs(this.scale.y) * this._image.height / this.resolution;
  }
  set height(value) {
    this.updateText(!0);
    const s = utils.sign(this.scale.y) || 1;
    this.scale.y = s * value / this._image.height / this.resolution, this._height = value;
  }
  /** The base style to render with text. */
  get style() {
    return this._style;
  }
  set style(style) {
    this._style !== style && (style = style || {}, style instanceof HTMLTextStyle ? (this.ownsStyle = !1, this._style = style) : style instanceof TextStyle ? (console.warn("[HTMLText] Cloning TextStyle, if this is not what you want, use HTMLTextStyle"), this.ownsStyle = !0, this._style = HTMLTextStyle.from(style)) : (this.ownsStyle = !0, this._style = new HTMLTextStyle(style)), this.localStyleID = -1, this.dirty = !0);
  }
  /**
   * Contents of text. This can be HTML text and include tags.
   * @example
   * const text = new HTMLText('This is a <em>styled</em> text!');
   * @member {string}
   */
  get text() {
    return this._text;
  }
  set text(text) {
    text = String(text === "" || text === null || text === void 0 ? " " : text), text = this.sanitiseText(text), this._text !== text && (this._text = text, this.dirty = !0);
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
   * @member {number}
   * @default 1
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(value) {
    this._autoResolution = !1, this._resolution !== value && (this._resolution = value, this.dirty = !0);
  }
  /**
   * Sanitise text - replace `<br>` with `<br/>`, `&nbsp;` with `&#160;`
   * @param text
   * @see https://www.sitepoint.com/community/t/xhtml-1-0-transitional-xml-parsing-error-entity-nbsp-not-defined/3392/3
   */
  sanitiseText(text) {
    return text.replace(/<br>/gi, "<br/>").replace(/<hr>/gi, "<hr/>").replace(/&nbsp;/gi, "&#160;");
  }
};
_HTMLText.defaultDestroyOptions = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, /** Default maxWidth, set at construction */
_HTMLText.defaultMaxWidth = 2024, /** Default maxHeight, set at construction */
_HTMLText.defaultMaxHeight = 2024, /** Default autoResolution for all HTMLText objects */
_HTMLText.defaultAutoResolution = !0;
let HTMLText = _HTMLText;
export {
  HTMLText
};
//# sourceMappingURL=HTMLText.mjs.map
