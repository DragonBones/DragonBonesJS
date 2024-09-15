"use strict";
var core = require("@pixi/core"), checkDataUrl = require("../../../utils/checkDataUrl.js"), checkExtension = require("../../../utils/checkExtension.js"), LoaderParser = require("../LoaderParser.js"), createTexture = require("./utils/createTexture.js");
const validVideoExtensions = [".mp4", ".m4v", ".webm", ".ogv"], validVideoMIMEs = [
  "video/mp4",
  "video/webm",
  "video/ogg"
], loadVideo = {
  name: "loadVideo",
  extension: {
    type: core.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High
  },
  config: {
    defaultAutoPlay: !0,
    defaultUpdateFPS: 0,
    defaultLoop: !1,
    defaultMuted: !1,
    defaultPlaysinline: !0
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validVideoMIMEs) || checkExtension.checkExtension(url, validVideoExtensions);
  },
  async load(url, loadAsset, loader) {
    let texture;
    const blob = await (await core.settings.ADAPTER.fetch(url)).blob(), blobURL = URL.createObjectURL(blob);
    try {
      const options = {
        autoPlay: this.config.defaultAutoPlay,
        updateFPS: this.config.defaultUpdateFPS,
        loop: this.config.defaultLoop,
        muted: this.config.defaultMuted,
        playsinline: this.config.defaultPlaysinline,
        ...loadAsset?.data?.resourceOptions,
        autoLoad: !0
      }, src = new core.VideoResource(blobURL, options);
      await src.load();
      const base = new core.BaseTexture(src, {
        alphaMode: await core.utils.detectVideoAlphaMode(),
        resolution: core.utils.getResolutionOfUrl(url),
        ...loadAsset?.data
      });
      base.resource.src = url, texture = createTexture.createTexture(base, loader, url), texture.baseTexture.once("destroyed", () => {
        URL.revokeObjectURL(blobURL);
      });
    } catch (e) {
      throw URL.revokeObjectURL(blobURL), e;
    }
    return texture;
  },
  unload(texture) {
    texture.destroy(!0);
  }
};
core.extensions.add(loadVideo);
exports.loadVideo = loadVideo;
//# sourceMappingURL=loadVideo.js.map
