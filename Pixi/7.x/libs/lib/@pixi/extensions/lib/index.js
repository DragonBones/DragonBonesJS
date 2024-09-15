"use strict";
var ExtensionType = /* @__PURE__ */ ((ExtensionType2) => (ExtensionType2.Renderer = "renderer", ExtensionType2.Application = "application", ExtensionType2.RendererSystem = "renderer-webgl-system", ExtensionType2.RendererPlugin = "renderer-webgl-plugin", ExtensionType2.CanvasRendererSystem = "renderer-canvas-system", ExtensionType2.CanvasRendererPlugin = "renderer-canvas-plugin", ExtensionType2.Asset = "asset", ExtensionType2.LoadParser = "load-parser", ExtensionType2.ResolveParser = "resolve-parser", ExtensionType2.CacheParser = "cache-parser", ExtensionType2.DetectionParser = "detection-parser", ExtensionType2))(ExtensionType || {});
const normalizeExtension = (ext) => {
  if (typeof ext == "function" || typeof ext == "object" && ext.extension) {
    if (!ext.extension)
      throw new Error("Extension class must have an extension object");
    ext = { ...typeof ext.extension != "object" ? { type: ext.extension } : ext.extension, ref: ext };
  }
  if (typeof ext == "object")
    ext = { ...ext };
  else
    throw new Error("Invalid extension type");
  return typeof ext.type == "string" && (ext.type = [ext.type]), ext;
}, normalizePriority = (ext, defaultPriority) => normalizeExtension(ext).priority ?? defaultPriority, extensions = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {PIXI.extensions} For chaining.
   */
  remove(...extensions2) {
    return extensions2.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => this._removeHandlers[type]?.(ext));
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {PIXI.extensions} For chaining.
   */
  add(...extensions2) {
    return extensions2.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => {
        const handlers = this._addHandlers, queue = this._queue;
        handlers[type] ? handlers[type]?.(ext) : (queue[type] = queue[type] || [], queue[type]?.push(ext));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function for handling when extensions are added/registered passes {@link PIXI.ExtensionFormat}.
   * @param onRemove  - Function for handling when extensions are removed/unregistered passes {@link PIXI.ExtensionFormat}.
   * @returns {PIXI.extensions} For chaining.
   */
  handle(type, onAdd, onRemove) {
    const addHandlers = this._addHandlers, removeHandlers = this._removeHandlers;
    if (addHandlers[type] || removeHandlers[type])
      throw new Error(`Extension type ${type} already has a handler`);
    addHandlers[type] = onAdd, removeHandlers[type] = onRemove;
    const queue = this._queue;
    return queue[type] && (queue[type]?.forEach((ext) => onAdd(ext)), delete queue[type]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByMap(type, map) {
    return this.handle(
      type,
      (extension) => {
        extension.name && (map[extension.name] = extension.ref);
      },
      (extension) => {
        extension.name && delete map[extension.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByList(type, list, defaultPriority = -1) {
    return this.handle(
      type,
      (extension) => {
        list.includes(extension.ref) || (list.push(extension.ref), list.sort((a, b) => normalizePriority(b, defaultPriority) - normalizePriority(a, defaultPriority)));
      },
      (extension) => {
        const index = list.indexOf(extension.ref);
        index !== -1 && list.splice(index, 1);
      }
    );
  }
};
exports.ExtensionType = ExtensionType;
exports.extensions = extensions;
//# sourceMappingURL=index.js.map
