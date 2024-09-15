import { Texture } from "@pixi/core";
import { Cache } from "../../../../cache/Cache.mjs";
function createTexture(base, loader, url) {
  base.resource.internal = !0;
  const texture = new Texture(base), unload = () => {
    delete loader.promiseCache[url], Cache.has(url) && Cache.remove(url);
  };
  return texture.baseTexture.once("destroyed", () => {
    url in loader.promiseCache && (console.warn("[Assets] A BaseTexture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the BaseTexture."), unload());
  }), texture.once("destroyed", () => {
    base.destroyed || (console.warn("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), unload());
  }), texture;
}
export {
  createTexture
};
//# sourceMappingURL=createTexture.mjs.map
