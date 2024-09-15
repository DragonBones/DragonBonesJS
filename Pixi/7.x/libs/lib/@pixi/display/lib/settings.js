"use strict";
var core = require("@pixi/core"), Container = require("./Container.js");
Object.defineProperties(core.settings, {
  /**
   * Sets the default value for the container property 'sortableChildren'.
   * @static
   * @name SORTABLE_CHILDREN
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @type {boolean}
   * @see PIXI.Container.defaultSortableChildren
   */
  SORTABLE_CHILDREN: {
    get() {
      return Container.Container.defaultSortableChildren;
    },
    set(value) {
      core.utils.deprecation("7.1.0", "settings.SORTABLE_CHILDREN is deprecated, use Container.defaultSortableChildren"), Container.Container.defaultSortableChildren = value;
    }
  }
});
Object.defineProperty(exports, "settings", {
  enumerable: !0,
  get: function() {
    return core.settings;
  }
});
//# sourceMappingURL=settings.js.map
