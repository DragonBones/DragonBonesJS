import { Texture, BaseTexture, Ticker, UPDATE_PRIORITY } from "@pixi/core";
import { Container } from "@pixi/display";
import { Text, TextStyle, TextMetrics } from "@pixi/text";
import { CountLimiter } from "./CountLimiter.mjs";
function findMultipleBaseTextures(item, queue) {
  let result = !1;
  if (item?._textures?.length) {
    for (let i = 0; i < item._textures.length; i++)
      if (item._textures[i] instanceof Texture) {
        const baseTexture = item._textures[i].baseTexture;
        queue.includes(baseTexture) || (queue.push(baseTexture), result = !0);
      }
  }
  return result;
}
function findBaseTexture(item, queue) {
  if (item.baseTexture instanceof BaseTexture) {
    const texture = item.baseTexture;
    return queue.includes(texture) || queue.push(texture), !0;
  }
  return !1;
}
function findTexture(item, queue) {
  if (item._texture && item._texture instanceof Texture) {
    const texture = item._texture.baseTexture;
    return queue.includes(texture) || queue.push(texture), !0;
  }
  return !1;
}
function drawText(_helper, item) {
  return item instanceof Text ? (item.updateText(!0), !0) : !1;
}
function calculateTextStyle(_helper, item) {
  if (item instanceof TextStyle) {
    const font = item.toFontString();
    return TextMetrics.measureFont(font), !0;
  }
  return !1;
}
function findText(item, queue) {
  if (item instanceof Text) {
    queue.includes(item.style) || queue.push(item.style), queue.includes(item) || queue.push(item);
    const texture = item._texture.baseTexture;
    return queue.includes(texture) || queue.push(texture), !0;
  }
  return !1;
}
function findTextStyle(item, queue) {
  return item instanceof TextStyle ? (queue.includes(item) || queue.push(item), !0) : !1;
}
const _BasePrepare = class _BasePrepare2 {
  /**
   * @param {PIXI.IRenderer} renderer - A reference to the current renderer
   */
  constructor(renderer) {
    this.limiter = new CountLimiter(_BasePrepare2.uploadsPerFrame), this.renderer = renderer, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = () => {
      this.queue && this.prepareItems();
    }, this.registerFindHook(findText), this.registerFindHook(findTextStyle), this.registerFindHook(findMultipleBaseTextures), this.registerFindHook(findBaseTexture), this.registerFindHook(findTexture), this.registerUploadHook(drawText), this.registerUploadHook(calculateTextStyle);
  }
  /**
   * Upload all the textures and graphics to the GPU.
   * @method PIXI.BasePrepare#upload
   * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text} [item] -
   *        Container or display object to search for items to upload or the items to upload themselves,
   *        or optionally ommitted, if items have been added using {@link PIXI.BasePrepare#add `prepare.add`}.
   */
  upload(item) {
    return new Promise((resolve) => {
      item && this.add(item), this.queue.length ? (this.completes.push(resolve), this.ticking || (this.ticking = !0, Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY))) : resolve();
    });
  }
  /**
   * Handle tick update
   * @private
   */
  tick() {
    setTimeout(this.delayedTick, 0);
  }
  /**
   * Actually prepare items. This is handled outside of the tick because it will take a while
   * and we do NOT want to block the current animation frame from rendering.
   * @private
   */
  prepareItems() {
    for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload(); ) {
      const item = this.queue[0];
      let uploaded = !1;
      if (item && !item._destroyed) {
        for (let i = 0, len = this.uploadHooks.length; i < len; i++)
          if (this.uploadHooks[i](this.uploadHookHelper, item)) {
            this.queue.shift(), uploaded = !0;
            break;
          }
      }
      uploaded || this.queue.shift();
    }
    if (this.queue.length)
      Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
    else {
      this.ticking = !1;
      const completes = this.completes.slice(0);
      this.completes.length = 0;
      for (let i = 0, len = completes.length; i < len; i++)
        completes[i]();
    }
  }
  /**
   * Adds hooks for finding items.
   * @param {Function} addHook - Function call that takes two parameters: `item:*, queue:Array`
   *          function must return `true` if it was able to add item to the queue.
   * @returns Instance of plugin for chaining.
   */
  registerFindHook(addHook) {
    return addHook && this.addHooks.push(addHook), this;
  }
  /**
   * Adds hooks for uploading items.
   * @param {Function} uploadHook - Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and
   *          function must return `true` if it was able to handle upload of item.
   * @returns Instance of plugin for chaining.
   */
  registerUploadHook(uploadHook) {
    return uploadHook && this.uploadHooks.push(uploadHook), this;
  }
  /**
   * Manually add an item to the uploading queue.
   * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text|*} item - Object to
   *        add to the queue
   * @returns Instance of plugin for chaining.
   */
  add(item) {
    for (let i = 0, len = this.addHooks.length; i < len && !this.addHooks[i](item, this.queue); i++)
      ;
    if (item instanceof Container)
      for (let i = item.children.length - 1; i >= 0; i--)
        this.add(item.children[i]);
    return this;
  }
  /** Destroys the plugin, don't use after this. */
  destroy() {
    this.ticking && Ticker.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
  }
};
_BasePrepare.uploadsPerFrame = 4;
let BasePrepare = _BasePrepare;
export {
  BasePrepare
};
//# sourceMappingURL=BasePrepare.mjs.map
