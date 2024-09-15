import { utils, ExtensionType, settings, extensions } from "@pixi/core";
import { checkDataUrl } from "../../utils/checkDataUrl.mjs";
import { checkExtension } from "../../utils/checkExtension.mjs";
import { LoaderParserPriority } from "./LoaderParser.mjs";
const validWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
], validFontExtensions = [".ttf", ".otf", ".woff", ".woff2"], validFontMIMEs = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], CSS_IDENT_TOKEN_REGEX = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function getFontFamilyName(url) {
  const ext = utils.path.extname(url), nameTokens = utils.path.basename(url, ext).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  let valid = nameTokens.length > 0;
  for (const token of nameTokens)
    if (!token.match(CSS_IDENT_TOKEN_REGEX)) {
      valid = !1;
      break;
    }
  let fontFamilyName = nameTokens.join(" ");
  return valid || (fontFamilyName = `"${fontFamilyName.replace(/[\\"]/g, "\\$&")}"`), fontFamilyName;
}
const validURICharactersRegex = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function encodeURIWhenNeeded(uri) {
  return validURICharactersRegex.test(uri) ? uri : encodeURI(uri);
}
const loadWebFont = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadWebFont",
  test(url) {
    return checkDataUrl(url, validFontMIMEs) || checkExtension(url, validFontExtensions);
  },
  async load(url, options) {
    const fonts = settings.ADAPTER.getFontFaceSet();
    if (fonts) {
      const fontFaces = [], name = options.data?.family ?? getFontFamilyName(url), weights = options.data?.weights?.filter((weight) => validWeights.includes(weight)) ?? ["normal"], data = options.data ?? {};
      for (let i = 0; i < weights.length; i++) {
        const weight = weights[i], font = new FontFace(name, `url(${encodeURIWhenNeeded(url)})`, {
          ...data,
          weight
        });
        await font.load(), fonts.add(font), fontFaces.push(font);
      }
      return fontFaces.length === 1 ? fontFaces[0] : fontFaces;
    }
    return console.warn("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(font) {
    (Array.isArray(font) ? font : [font]).forEach((t) => settings.ADAPTER.getFontFaceSet().delete(t));
  }
};
extensions.add(loadWebFont);
export {
  getFontFamilyName,
  loadWebFont
};
//# sourceMappingURL=loadWebFont.mjs.map
