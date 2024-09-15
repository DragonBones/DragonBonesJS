import { ExtensionType, utils, settings, extensions } from "@pixi/core";
const knownFormats = ["s3tc", "s3tc_sRGB", "etc", "etc1", "pvrtc", "atc", "astc", "bptc"], resolveCompressedTextureUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value) => {
    const extension = utils.path.extname(value).slice(1);
    return ["basis", "ktx", "dds"].includes(extension);
  },
  parse: (value) => {
    const parts = value.split("."), extension = parts.pop();
    if (["ktx", "dds"].includes(extension)) {
      const textureFormat = parts.pop();
      if (knownFormats.includes(textureFormat))
        return {
          resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
          format: textureFormat,
          src: value
        };
    }
    return {
      resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
      format: extension,
      src: value
    };
  }
};
extensions.add(resolveCompressedTextureUrl);
export {
  resolveCompressedTextureUrl
};
//# sourceMappingURL=resolveCompressedTextureUrl.mjs.map
