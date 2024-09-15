import { Matrix, Rectangle, RenderTexture, utils, BaseTexture, Texture } from "@pixi/core";
import { DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
const _tempMatrix = new Matrix();
DisplayObject.prototype._cacheAsBitmap = !1;
DisplayObject.prototype._cacheData = null;
DisplayObject.prototype._cacheAsBitmapResolution = null;
DisplayObject.prototype._cacheAsBitmapMultisample = null;
class CacheData {
  constructor() {
    this.textureCacheId = null, this.originalRender = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.originalContainsPoint = null, this.sprite = null;
  }
}
Object.defineProperties(DisplayObject.prototype, {
  /**
   * The resolution to use for cacheAsBitmap. By default this will use the renderer's resolution
   * but can be overriden for performance. Lower values will reduce memory usage at the expense
   * of render quality. A falsey value of `null` or `0` will default to the renderer's resolution.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new resolution.
   * @member {number|null} cacheAsBitmapResolution
   * @memberof PIXI.DisplayObject#
   * @default null
   */
  cacheAsBitmapResolution: {
    get() {
      return this._cacheAsBitmapResolution;
    },
    set(resolution) {
      resolution !== this._cacheAsBitmapResolution && (this._cacheAsBitmapResolution = resolution, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * The number of samples to use for cacheAsBitmap. If set to `null`, the renderer's
   * sample count is used.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new number of samples.
   * @member {number|null} cacheAsBitmapMultisample
   * @memberof PIXI.DisplayObject#
   * @default null
   */
  cacheAsBitmapMultisample: {
    get() {
      return this._cacheAsBitmapMultisample;
    },
    set(multisample) {
      multisample !== this._cacheAsBitmapMultisample && (this._cacheAsBitmapMultisample = multisample, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * Set this to true if you want this display object to be cached as a bitmap.
   * This basically takes a snapshot of the display object as it is at that moment. It can
   * provide a performance benefit for complex static displayObjects.
   * To remove simply set this property to `false`
   *
   * IMPORTANT GOTCHA - Make sure that all your textures are preloaded BEFORE setting this property to true
   * as it will take a snapshot of what is currently there. If the textures have not loaded then they will not appear.
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  cacheAsBitmap: {
    get() {
      return this._cacheAsBitmap;
    },
    set(value) {
      if (this._cacheAsBitmap === value)
        return;
      this._cacheAsBitmap = value;
      let data;
      value ? (this._cacheData || (this._cacheData = new CacheData()), data = this._cacheData, data.originalRender = this.render, data.originalRenderCanvas = this.renderCanvas, data.originalUpdateTransform = this.updateTransform, data.originalCalculateBounds = this.calculateBounds, data.originalGetLocalBounds = this.getLocalBounds, data.originalDestroy = this.destroy, data.originalContainsPoint = this.containsPoint, data.originalMask = this._mask, data.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : (data = this._cacheData, data.sprite && this._destroyCachedDisplayObject(), this.render = data.originalRender, this.renderCanvas = data.originalRenderCanvas, this.calculateBounds = data.originalCalculateBounds, this.getLocalBounds = data.originalGetLocalBounds, this.destroy = data.originalDestroy, this.updateTransform = data.originalUpdateTransform, this.containsPoint = data.originalContainsPoint, this._mask = data.originalMask, this.filterArea = data.originalFilterArea);
    }
  }
});
DisplayObject.prototype._renderCached = function(renderer) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(renderer), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(renderer));
};
DisplayObject.prototype._initCachedDisplayObject = function(renderer) {
  if (this._cacheData?.sprite)
    return;
  const cacheAlpha = this.alpha;
  this.alpha = 1, renderer.batch.flush();
  const bounds = this.getLocalBounds(new Rectangle(), !0);
  if (this.filters?.length) {
    const padding = this.filters[0].padding;
    bounds.pad(padding);
  }
  const resolution = this.cacheAsBitmapResolution || renderer.resolution;
  bounds.ceil(resolution), bounds.width = Math.max(bounds.width, 1 / resolution), bounds.height = Math.max(bounds.height, 1 / resolution);
  const cachedRenderTexture = renderer.renderTexture.current, cachedSourceFrame = renderer.renderTexture.sourceFrame.clone(), cachedDestinationFrame = renderer.renderTexture.destinationFrame.clone(), cachedProjectionTransform = renderer.projection.transform, renderTexture = RenderTexture.create({
    width: bounds.width,
    height: bounds.height,
    resolution,
    multisample: this.cacheAsBitmapMultisample ?? renderer.multisample
  }), textureCacheId = `cacheAsBitmap_${utils.uid()}`;
  this._cacheData.textureCacheId = textureCacheId, BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId), Texture.addToCache(renderTexture, textureCacheId);
  const m = this.transform.localTransform.copyTo(_tempMatrix).invert().translate(-bounds.x, -bounds.y);
  this.render = this._cacheData.originalRender, renderer.render(this, { renderTexture, clear: !0, transform: m, skipUpdateTransform: !1 }), renderer.framebuffer.blit(), renderer.projection.transform = cachedProjectionTransform, renderer.renderTexture.bind(cachedRenderTexture, cachedSourceFrame, cachedDestinationFrame), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = cacheAlpha;
  const cachedSprite = new Sprite(renderTexture);
  cachedSprite.transform.worldTransform = this.transform.worldTransform, cachedSprite.anchor.x = -(bounds.x / bounds.width), cachedSprite.anchor.y = -(bounds.y / bounds.height), cachedSprite.alpha = cacheAlpha, cachedSprite._bounds = this._bounds, this._cacheData.sprite = cachedSprite, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
DisplayObject.prototype._renderCachedCanvas = function(renderer) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(renderer), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(renderer));
};
DisplayObject.prototype._initCachedDisplayObjectCanvas = function(renderer) {
  if (this._cacheData?.sprite)
    return;
  const bounds = this.getLocalBounds(new Rectangle(), !0), cacheAlpha = this.alpha;
  this.alpha = 1;
  const cachedRenderTarget = renderer.canvasContext.activeContext, cachedProjectionTransform = renderer._projTransform, resolution = this.cacheAsBitmapResolution || renderer.resolution;
  bounds.ceil(resolution), bounds.width = Math.max(bounds.width, 1 / resolution), bounds.height = Math.max(bounds.height, 1 / resolution);
  const renderTexture = RenderTexture.create({
    width: bounds.width,
    height: bounds.height,
    resolution
  }), textureCacheId = `cacheAsBitmap_${utils.uid()}`;
  this._cacheData.textureCacheId = textureCacheId, BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId), Texture.addToCache(renderTexture, textureCacheId);
  const m = _tempMatrix;
  this.transform.localTransform.copyTo(m), m.invert(), m.tx -= bounds.x, m.ty -= bounds.y, this.renderCanvas = this._cacheData.originalRenderCanvas, renderer.render(this, { renderTexture, clear: !0, transform: m, skipUpdateTransform: !1 }), renderer.canvasContext.activeContext = cachedRenderTarget, renderer._projTransform = cachedProjectionTransform, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = cacheAlpha;
  const cachedSprite = new Sprite(renderTexture);
  cachedSprite.transform.worldTransform = this.transform.worldTransform, cachedSprite.anchor.x = -(bounds.x / bounds.width), cachedSprite.anchor.y = -(bounds.y / bounds.height), cachedSprite.alpha = cacheAlpha, cachedSprite._bounds = this._bounds, this._cacheData.sprite = cachedSprite, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = renderer._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
DisplayObject.prototype._calculateCachedBounds = function() {
  this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
};
DisplayObject.prototype._getCachedLocalBounds = function() {
  return this._cacheData.sprite.getLocalBounds(null);
};
DisplayObject.prototype._destroyCachedDisplayObject = function() {
  this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, BaseTexture.removeFromCache(this._cacheData.textureCacheId), Texture.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
};
DisplayObject.prototype._cacheAsBitmapDestroy = function(options) {
  this.cacheAsBitmap = !1, this.destroy(options);
};
export {
  CacheData
};
//# sourceMappingURL=index.mjs.map
