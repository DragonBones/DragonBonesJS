"use strict";
var core = require("@pixi/core"), checkDataUrl = require("../../../utils/checkDataUrl.js"), checkExtension = require("../../../utils/checkExtension.js"), LoaderParser = require("../LoaderParser.js"), WorkerManager = require("../WorkerManager.js"), createTexture = require("./utils/createTexture.js");
const validImageExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"], validImageMIMEs = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function loadImageBitmap(url) {
  const response = await core.settings.ADAPTER.fetch(url);
  if (!response.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  const imageBlob = await response.blob();
  return await createImageBitmap(imageBlob);
}
const loadTextures = {
  name: "loadTextures",
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validImageMIMEs) || checkExtension.checkExtension(url, validImageExtensions);
  },
  async load(url, asset, loader) {
    const useImageBitmap = globalThis.createImageBitmap && this.config.preferCreateImageBitmap;
    let src;
    useImageBitmap ? this.config.preferWorkers && await WorkerManager.WorkerManager.isImageBitmapSupported() ? src = await WorkerManager.WorkerManager.loadImageBitmap(url) : src = await loadImageBitmap(url) : src = await new Promise((resolve, reject) => {
      const src2 = new Image();
      src2.crossOrigin = this.config.crossOrigin, src2.src = url, src2.complete ? resolve(src2) : (src2.onload = () => resolve(src2), src2.onerror = (e) => reject(e));
    });
    const options = { ...asset.data };
    options.resolution ?? (options.resolution = core.utils.getResolutionOfUrl(url)), useImageBitmap && options.resourceOptions?.ownsImageBitmap === void 0 && (options.resourceOptions = { ...options.resourceOptions }, options.resourceOptions.ownsImageBitmap = !0);
    const base = new core.BaseTexture(src, options);
    return base.resource.src = url, createTexture.createTexture(base, loader, url);
  },
  unload(texture) {
    texture.destroy(!0);
  }
};
core.extensions.add(loadTextures);
exports.loadImageBitmap = loadImageBitmap;
exports.loadTextures = loadTextures;
//# sourceMappingURL=loadTextures.js.map
