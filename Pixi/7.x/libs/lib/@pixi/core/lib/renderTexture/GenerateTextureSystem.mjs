import { ExtensionType, extensions } from "@pixi/extensions";
import { Transform, Rectangle, Matrix } from "@pixi/math";
import { RenderTexture } from "./RenderTexture.mjs";
const tempTransform = new Transform(), tempRect = new Rectangle();
class GenerateTextureSystem {
  constructor(renderer) {
    this.renderer = renderer, this._tempMatrix = new Matrix();
  }
  /**
   * A Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
   * @param displayObject - The displayObject the object will be generated from.
   * @param {IGenerateTextureOptions} options - Generate texture options.
   * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
   *        if no region is specified, defaults to the local bounds of the displayObject.
   * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
   * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
   * @returns a shiny new texture of the display object passed in
   */
  generateTexture(displayObject, options) {
    const { region: manualRegion, ...textureOptions } = options || {}, region = manualRegion?.copyTo(tempRect) || displayObject.getLocalBounds(tempRect, !0), resolution = textureOptions.resolution || this.renderer.resolution;
    region.width = Math.max(region.width, 1 / resolution), region.height = Math.max(region.height, 1 / resolution), textureOptions.width = region.width, textureOptions.height = region.height, textureOptions.resolution = resolution, textureOptions.multisample ?? (textureOptions.multisample = this.renderer.multisample);
    const renderTexture = RenderTexture.create(textureOptions);
    this._tempMatrix.tx = -region.x, this._tempMatrix.ty = -region.y;
    const transform = displayObject.transform;
    return displayObject.transform = tempTransform, this.renderer.render(displayObject, {
      renderTexture,
      transform: this._tempMatrix,
      skipUpdateTransform: !!displayObject.parent,
      blit: !0
    }), displayObject.transform = transform, renderTexture;
  }
  destroy() {
  }
}
GenerateTextureSystem.extension = {
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ],
  name: "textureGenerator"
};
extensions.add(GenerateTextureSystem);
export {
  GenerateTextureSystem
};
//# sourceMappingURL=GenerateTextureSystem.mjs.map
