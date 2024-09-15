import { Rectangle, utils, RenderTexture, FORMATS, ExtensionType, extensions } from "@pixi/core";
const TEMP_RECT = new Rectangle(), BYTES_PER_PIXEL = 4, _Extract = class _Extract2 {
  /**
   * @param renderer - A reference to the current renderer
   */
  constructor(renderer) {
    this.renderer = renderer, this._rendererPremultipliedAlpha = !1;
  }
  contextChange() {
    const attributes = this.renderer?.gl.getContextAttributes();
    this._rendererPremultipliedAlpha = !!(attributes && attributes.alpha && attributes.premultipliedAlpha);
  }
  /**
   * Will return a HTML Image of the target
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param format - Image format, e.g. "image/jpeg" or "image/webp".
   * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
   * @param frame - The frame the extraction is restricted to.
   * @returns - HTML Image of the target
   */
  async image(target, format, quality, frame) {
    const image = new Image();
    return image.src = await this.base64(target, format, quality, frame), image;
  }
  /**
   * Will return a base64 encoded string of this target. It works by calling
   *  `Extract.canvas` and then running toDataURL on that.
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param format - Image format, e.g. "image/jpeg" or "image/webp".
   * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
   * @param frame - The frame the extraction is restricted to.
   * @returns - A base64 encoded string of the texture.
   */
  async base64(target, format, quality, frame) {
    const canvas = this.canvas(target, frame);
    if (canvas.toBlob !== void 0)
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("ICanvas.toBlob failed!"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result), reader.onerror = reject, reader.readAsDataURL(blob);
        }, format, quality);
      });
    if (canvas.toDataURL !== void 0)
      return canvas.toDataURL(format, quality);
    if (canvas.convertToBlob !== void 0) {
      const blob = await canvas.convertToBlob({ type: format, quality });
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result), reader.onerror = reject, reader.readAsDataURL(blob);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  /**
   * Creates a Canvas element, renders this target to it and then returns it.
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param frame - The frame the extraction is restricted to.
   * @returns - A Canvas element with the texture rendered on.
   */
  canvas(target, frame) {
    const { pixels, width, height, flipY, premultipliedAlpha } = this._rawPixels(target, frame);
    flipY && _Extract2._flipY(pixels, width, height), premultipliedAlpha && _Extract2._unpremultiplyAlpha(pixels);
    const canvasBuffer = new utils.CanvasRenderTarget(width, height, 1), imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
    return canvasBuffer.context.putImageData(imageData, 0, 0), canvasBuffer.canvas;
  }
  /**
   * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
   * order, with integer values between 0 and 255 (included).
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param frame - The frame the extraction is restricted to.
   * @returns - One-dimensional array containing the pixel data of the entire texture
   */
  pixels(target, frame) {
    const { pixels, width, height, flipY, premultipliedAlpha } = this._rawPixels(target, frame);
    return flipY && _Extract2._flipY(pixels, width, height), premultipliedAlpha && _Extract2._unpremultiplyAlpha(pixels), pixels;
  }
  _rawPixels(target, frame) {
    const renderer = this.renderer;
    if (!renderer)
      throw new Error("The Extract has already been destroyed");
    let resolution, flipY = !1, premultipliedAlpha = !1, renderTexture, generated = !1;
    target && (target instanceof RenderTexture ? renderTexture = target : (renderTexture = renderer.generateTexture(target, {
      region: frame,
      resolution: renderer.resolution,
      multisample: renderer.multisample
    }), generated = !0, frame && (TEMP_RECT.width = frame.width, TEMP_RECT.height = frame.height, frame = TEMP_RECT)));
    const gl = renderer.gl;
    if (renderTexture) {
      if (resolution = renderTexture.baseTexture.resolution, frame = frame ?? renderTexture.frame, flipY = !1, premultipliedAlpha = renderTexture.baseTexture.alphaMode > 0 && renderTexture.baseTexture.format === FORMATS.RGBA, !generated) {
        renderer.renderTexture.bind(renderTexture);
        const fbo = renderTexture.framebuffer.glFramebuffers[renderer.CONTEXT_UID];
        fbo.blitFramebuffer && renderer.framebuffer.bind(fbo.blitFramebuffer);
      }
    } else
      resolution = renderer.resolution, frame || (frame = TEMP_RECT, frame.width = renderer.width / resolution, frame.height = renderer.height / resolution), flipY = !0, premultipliedAlpha = this._rendererPremultipliedAlpha, renderer.renderTexture.bind();
    const width = Math.max(Math.round(frame.width * resolution), 1), height = Math.max(Math.round(frame.height * resolution), 1), pixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
    return gl.readPixels(
      Math.round(frame.x * resolution),
      Math.round(frame.y * resolution),
      width,
      height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    ), generated && renderTexture?.destroy(!0), { pixels, width, height, flipY, premultipliedAlpha };
  }
  /** Destroys the extract. */
  destroy() {
    this.renderer = null;
  }
  static _flipY(pixels, width, height) {
    const w = width << 2, h = height >> 1, temp = new Uint8Array(w);
    for (let y = 0; y < h; y++) {
      const t = y * w, b = (height - y - 1) * w;
      temp.set(pixels.subarray(t, t + w)), pixels.copyWithin(t, b, b + w), pixels.set(temp, b);
    }
  }
  static _unpremultiplyAlpha(pixels) {
    pixels instanceof Uint8ClampedArray && (pixels = new Uint8Array(pixels.buffer));
    const n = pixels.length;
    for (let i = 0; i < n; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha !== 0) {
        const a = 255.001 / alpha;
        pixels[i] = pixels[i] * a + 0.5, pixels[i + 1] = pixels[i + 1] * a + 0.5, pixels[i + 2] = pixels[i + 2] * a + 0.5;
      }
    }
  }
};
_Extract.extension = {
  name: "extract",
  type: ExtensionType.RendererSystem
};
let Extract = _Extract;
extensions.add(Extract);
export {
  Extract
};
//# sourceMappingURL=Extract.mjs.map
