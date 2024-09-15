"use strict";
var core = require("@pixi/core"), Cache = require("../../../../cache/Cache.js");
function createTexture(base, loader, url) {
  base.resource.internal = !0;
  const texture = new core.Texture(base), unload = () => {
    delete loader.promiseCache[url], Cache.Cache.has(url) && Cache.Cache.remove(url);
  };
  return texture.baseTexture.once("destroyed", () => {
    url in loader.promiseCache && (console.warn("[Assets] A BaseTexture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the BaseTexture."), unload());
  }), texture.once("destroyed", () => {
    base.destroyed || (console.warn("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), unload());
  }), texture;
}
exports.createTexture = createTexture;
//# sourceMappingURL=createTexture.js.map
