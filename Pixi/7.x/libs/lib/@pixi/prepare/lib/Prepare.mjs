import { BaseTexture, ExtensionType, extensions } from "@pixi/core";
import { Graphics } from "@pixi/graphics";
import { BasePrepare } from "./BasePrepare.mjs";
function uploadBaseTextures(renderer, item) {
  return item instanceof BaseTexture ? (item._glTextures[renderer.CONTEXT_UID] || renderer.texture.bind(item), !0) : !1;
}
function uploadGraphics(renderer, item) {
  if (!(item instanceof Graphics))
    return !1;
  const { geometry } = item;
  item.finishPoly(), geometry.updateBatches();
  const { batches } = geometry;
  for (let i = 0; i < batches.length; i++) {
    const { texture } = batches[i].style;
    texture && uploadBaseTextures(renderer, texture.baseTexture);
  }
  return geometry.batchable || renderer.geometry.bind(geometry, item._resolveDirectShader(renderer)), !0;
}
function findGraphics(item, queue) {
  return item instanceof Graphics ? (queue.push(item), !0) : !1;
}
class Prepare extends BasePrepare {
  /**
   * @param {PIXI.Renderer} renderer - A reference to the current renderer
   */
  constructor(renderer) {
    super(renderer), this.uploadHookHelper = this.renderer, this.registerFindHook(findGraphics), this.registerUploadHook(uploadBaseTextures), this.registerUploadHook(uploadGraphics);
  }
}
Prepare.extension = {
  name: "prepare",
  type: ExtensionType.RendererSystem
};
extensions.add(Prepare);
export {
  Prepare
};
//# sourceMappingURL=Prepare.mjs.map
