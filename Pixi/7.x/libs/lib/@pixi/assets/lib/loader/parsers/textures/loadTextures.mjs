import { settings, ExtensionType, utils, BaseTexture, extensions } from "@pixi/core";
import { checkDataUrl } from "../../../utils/checkDataUrl.mjs";
import { checkExtension } from "../../../utils/checkExtension.mjs";
import { LoaderParserPriority } from "../LoaderParser.mjs";
import { WorkerManager } from "../WorkerManager.mjs";
import { createTexture } from "./utils/createTexture.mjs";
const validImageExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"], validImageMIMEs = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function loadImageBitmap(url) {
  const response = await settings.ADAPTER.fetch(url);
  if (!response.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  const imageBlob = await response.blob();
  return await createImageBitmap(imageBlob);
}
const loadTextures = {
  name: "loadTextures",
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(url) {
    return checkDataUrl(url, validImageMIMEs) || checkExtension(url, validImageExtensions);
  },
  async load(url, asset, loader) {
    const useImageBitmap = globalThis.createImageBitmap && this.config.preferCreateImageBitmap;
    let src;
    useImageBitmap ? this.config.preferWorkers && await WorkerManager.isImageBitmapSupported() ? src = await WorkerManager.loadImageBitmap(url) : src = await loadImageBitmap(url) : src = await new Promise((resolve, reject) => {
      const src2 = new Image();
      src2.crossOrigin = this.config.crossOrigin, src2.src = url, src2.complete ? resolve(src2) : (src2.onload = () => resolve(src2), src2.onerror = (e) => reject(e));
    });
    const options = { ...asset.data };
    options.resolution ?? (options.resolution = utils.getResolutionOfUrl(url)), useImageBitmap && options.resourceOptions?.ownsImageBitmap === void 0 && (options.resourceOptions = { ...options.resourceOptions }, options.resourceOptions.ownsImageBitmap = !0);
    const base = new BaseTexture(src, options);
    return base.resource.src = url, createTexture(base, loader, url);
  },
  unload(texture) {
    texture.destroy(!0);
  }
};
extensions.add(loadTextures);
export {
  loadImageBitmap,
  loadTextures
};
//# sourceMappingURL=loadTextures.mjs.map
