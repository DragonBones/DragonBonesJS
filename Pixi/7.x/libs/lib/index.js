"use strict";
require("@pixi/mixin-cache-as-bitmap");
require("@pixi/mixin-get-child-by-name");
require("@pixi/mixin-get-global-position");
var filters = require("./filters.js"), accessibility = require("@pixi/accessibility"), app = require("@pixi/app"), assets = require("@pixi/assets"), compressedTextures = require("@pixi/compressed-textures"), core = require("@pixi/core"), display = require("@pixi/display"), events = require("@pixi/events"), extract = require("@pixi/extract"), filterAlpha = require("@pixi/filter-alpha"), filterBlur = require("@pixi/filter-blur"), filterColorMatrix = require("@pixi/filter-color-matrix"), filterDisplacement = require("@pixi/filter-displacement"), filterFxaa = require("@pixi/filter-fxaa"), filterNoise = require("@pixi/filter-noise"), graphics = require("@pixi/graphics"), mesh = require("@pixi/mesh"), meshExtras = require("@pixi/mesh-extras"), particleContainer = require("@pixi/particle-container"), prepare = require("@pixi/prepare"), sprite = require("@pixi/sprite"), spriteAnimated = require("@pixi/sprite-animated"), spriteTiling = require("@pixi/sprite-tiling"), spritesheet = require("@pixi/spritesheet"), text = require("@pixi/text"), textBitmap = require("@pixi/text-bitmap"), textHtml = require("@pixi/text-html");
exports.filters = filters.filters;
Object.keys(accessibility).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return accessibility[k];
    }
  });
});
Object.keys(app).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return app[k];
    }
  });
});
Object.keys(assets).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return assets[k];
    }
  });
});
Object.keys(compressedTextures).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return compressedTextures[k];
    }
  });
});
Object.keys(core).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return core[k];
    }
  });
});
Object.keys(display).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return display[k];
    }
  });
});
Object.keys(events).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return events[k];
    }
  });
});
Object.keys(extract).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return extract[k];
    }
  });
});
Object.keys(filterAlpha).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return filterAlpha[k];
    }
  });
});
Object.keys(filterBlur).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return filterBlur[k];
    }
  });
});
Object.keys(filterColorMatrix).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return filterColorMatrix[k];
    }
  });
});
Object.keys(filterDisplacement).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return filterDisplacement[k];
    }
  });
});
Object.keys(filterFxaa).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return filterFxaa[k];
    }
  });
});
Object.keys(filterNoise).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return filterNoise[k];
    }
  });
});
Object.keys(graphics).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return graphics[k];
    }
  });
});
Object.keys(mesh).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return mesh[k];
    }
  });
});
Object.keys(meshExtras).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return meshExtras[k];
    }
  });
});
Object.keys(particleContainer).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return particleContainer[k];
    }
  });
});
Object.keys(prepare).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return prepare[k];
    }
  });
});
Object.keys(sprite).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return sprite[k];
    }
  });
});
Object.keys(spriteAnimated).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return spriteAnimated[k];
    }
  });
});
Object.keys(spriteTiling).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return spriteTiling[k];
    }
  });
});
Object.keys(spritesheet).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return spritesheet[k];
    }
  });
});
Object.keys(text).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return text[k];
    }
  });
});
Object.keys(textBitmap).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return textBitmap[k];
    }
  });
});
Object.keys(textHtml).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return textHtml[k];
    }
  });
});
//# sourceMappingURL=index.js.map
