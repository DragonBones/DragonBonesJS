"use strict";
const ProgramCache = {}, TextureCache = /* @__PURE__ */ Object.create(null), BaseTextureCache = /* @__PURE__ */ Object.create(null);
function destroyTextureCache() {
  let key;
  for (key in TextureCache)
    TextureCache[key].destroy();
  for (key in BaseTextureCache)
    BaseTextureCache[key].destroy();
}
function clearTextureCache() {
  let key;
  for (key in TextureCache)
    delete TextureCache[key];
  for (key in BaseTextureCache)
    delete BaseTextureCache[key];
}
exports.BaseTextureCache = BaseTextureCache;
exports.ProgramCache = ProgramCache;
exports.TextureCache = TextureCache;
exports.clearTextureCache = clearTextureCache;
exports.destroyTextureCache = destroyTextureCache;
//# sourceMappingURL=caches.js.map
