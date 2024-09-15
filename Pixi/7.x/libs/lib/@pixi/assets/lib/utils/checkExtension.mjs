import { utils } from "@pixi/core";
function checkExtension(url, extension) {
  const tempURL = url.split("?")[0], ext = utils.path.extname(tempURL).toLowerCase();
  return Array.isArray(extension) ? extension.includes(ext) : ext === extension;
}
export {
  checkExtension
};
//# sourceMappingURL=checkExtension.mjs.map
