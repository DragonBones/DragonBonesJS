import { ExtensionType, settings, VideoResource, BaseTexture, utils, extensions } from "@pixi/core";
import { checkDataUrl } from "../../../utils/checkDataUrl.mjs";
import { checkExtension } from "../../../utils/checkExtension.mjs";
import { LoaderParserPriority } from "../LoaderParser.mjs";
import { createTexture } from "./utils/createTexture.mjs";
const validVideoExtensions = [".mp4", ".m4v", ".webm", ".ogv"], validVideoMIMEs = [
  "video/mp4",
  "video/webm",
  "video/ogg"
], loadVideo = {
  name: "loadVideo",
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  config: {
    defaultAutoPlay: !0,
    defaultUpdateFPS: 0,
    defaultLoop: !1,
    defaultMuted: !1,
    defaultPlaysinline: !0
  },
  test(url) {
    return checkDataUrl(url, validVideoMIMEs) || checkExtension(url, validVideoExtensions);
  },
  async load(url, loadAsset, loader) {
    let texture;
    const blob = await (await settings.ADAPTER.fetch(url)).blob(), blobURL = URL.createObjectURL(blob);
    try {
      const options = {
        autoPlay: this.config.defaultAutoPlay,
        updateFPS: this.config.defaultUpdateFPS,
        loop: this.config.defaultLoop,
        muted: this.config.defaultMuted,
        playsinline: this.config.defaultPlaysinline,
        ...loadAsset?.data?.resourceOptions,
        autoLoad: !0
      }, src = new VideoResource(blobURL, options);
      await src.load();
      const base = new BaseTexture(src, {
        alphaMode: await utils.detectVideoAlphaMode(),
        resolution: utils.getResolutionOfUrl(url),
        ...loadAsset?.data
      });
      base.resource.src = url, texture = createTexture(base, loader, url), texture.baseTexture.once("destroyed", () => {
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
extensions.add(loadVideo);
export {
  loadVideo
};
//# sourceMappingURL=loadVideo.mjs.map
