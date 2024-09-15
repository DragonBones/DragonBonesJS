"use strict";
var constants = require("@pixi/constants"), extensions = require("@pixi/extensions");
const _TextureGCSystem = class _TextureGCSystem2 {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this.renderer = renderer, this.count = 0, this.checkCount = 0, this.maxIdle = _TextureGCSystem2.defaultMaxIdle, this.checkCountMax = _TextureGCSystem2.defaultCheckCountMax, this.mode = _TextureGCSystem2.defaultMode;
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  postrender() {
    this.renderer.objectRenderer.renderingToScreen && (this.count++, this.mode !== constants.GC_MODES.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  run() {
    const tm = this.renderer.texture, managedTextures = tm.managedTextures;
    let wasRemoved = !1;
    for (let i = 0; i < managedTextures.length; i++) {
      const texture = managedTextures[i];
      texture.resource && this.count - texture.touched > this.maxIdle && (tm.destroyTexture(texture, !0), managedTextures[i] = null, wasRemoved = !0);
    }
    if (wasRemoved) {
      let j = 0;
      for (let i = 0; i < managedTextures.length; i++)
        managedTextures[i] !== null && (managedTextures[j++] = managedTextures[i]);
      managedTextures.length = j;
    }
  }
  /**
   * Removes all the textures within the specified displayObject and its children from the GPU.
   * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
   */
  unload(displayObject) {
    const tm = this.renderer.texture, texture = displayObject._texture;
    texture && !texture.framebuffer && tm.destroyTexture(texture);
    for (let i = displayObject.children.length - 1; i >= 0; i--)
      this.unload(displayObject.children[i]);
  }
  destroy() {
    this.renderer = null;
  }
};
_TextureGCSystem.defaultMode = constants.GC_MODES.AUTO, /**
* Default maximum idle frames before a texture is destroyed by garbage collection.
* @static
* @default 3600
* @see PIXI.TextureGCSystem#maxIdle
*/
_TextureGCSystem.defaultMaxIdle = 60 * 60, /**
* Default frames between two garbage collections.
* @static
* @default 600
* @see PIXI.TextureGCSystem#checkCountMax
*/
_TextureGCSystem.defaultCheckCountMax = 60 * 10, /** @ignore */
_TextureGCSystem.extension = {
  type: extensions.ExtensionType.RendererSystem,
  name: "textureGC"
};
let TextureGCSystem = _TextureGCSystem;
extensions.extensions.add(TextureGCSystem);
exports.TextureGCSystem = TextureGCSystem;
//# sourceMappingURL=TextureGCSystem.js.map
