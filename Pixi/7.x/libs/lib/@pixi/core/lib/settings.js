"use strict";
var constants = require("@pixi/constants"), settings = require("@pixi/settings"), utils = require("@pixi/utils"), BatchRenderer = require("./batch/BatchRenderer.js"), Filter = require("./filters/Filter.js"), Program = require("./shader/Program.js");
require("./systems.js");
var BaseTexture = require("./textures/BaseTexture.js"), ContextSystem = require("./context/ContextSystem.js"), BackgroundSystem = require("./background/BackgroundSystem.js"), ViewSystem = require("./view/ViewSystem.js"), StartupSystem = require("./startup/StartupSystem.js"), TextureGCSystem = require("./textures/TextureGCSystem.js");
settings.settings.PREFER_ENV = constants.ENV.WEBGL2;
settings.settings.STRICT_TEXTURE_CACHE = !1;
settings.settings.RENDER_OPTIONS = {
  ...ContextSystem.ContextSystem.defaultOptions,
  ...BackgroundSystem.BackgroundSystem.defaultOptions,
  ...ViewSystem.ViewSystem.defaultOptions,
  ...StartupSystem.StartupSystem.defaultOptions
};
Object.defineProperties(settings.settings, {
  /**
   * @static
   * @name WRAP_MODE
   * @memberof PIXI.settings
   * @type {PIXI.WRAP_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.wrapMode
   */
  WRAP_MODE: {
    get() {
      return BaseTexture.BaseTexture.defaultOptions.wrapMode;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.WRAP_MODE is deprecated, use BaseTexture.defaultOptions.wrapMode"), BaseTexture.BaseTexture.defaultOptions.wrapMode = value;
    }
  },
  /**
   * @static
   * @name SCALE_MODE
   * @memberof PIXI.settings
   * @type {PIXI.SCALE_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.scaleMode
   */
  SCALE_MODE: {
    get() {
      return BaseTexture.BaseTexture.defaultOptions.scaleMode;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.SCALE_MODE is deprecated, use BaseTexture.defaultOptions.scaleMode"), BaseTexture.BaseTexture.defaultOptions.scaleMode = value;
    }
  },
  /**
   * @static
   * @name MIPMAP_TEXTURES
   * @memberof PIXI.settings
   * @type {PIXI.MIPMAP_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.mipmap
   */
  MIPMAP_TEXTURES: {
    get() {
      return BaseTexture.BaseTexture.defaultOptions.mipmap;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.MIPMAP_TEXTURES is deprecated, use BaseTexture.defaultOptions.mipmap"), BaseTexture.BaseTexture.defaultOptions.mipmap = value;
    }
    // MIPMAP_MODES.POW2,
  },
  /**
   * @static
   * @name ANISOTROPIC_LEVEL
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.anisotropicLevel
   */
  ANISOTROPIC_LEVEL: {
    get() {
      return BaseTexture.BaseTexture.defaultOptions.anisotropicLevel;
    },
    set(value) {
      utils.deprecation(
        "7.1.0",
        "settings.ANISOTROPIC_LEVEL is deprecated, use BaseTexture.defaultOptions.anisotropicLevel"
      ), BaseTexture.BaseTexture.defaultOptions.anisotropicLevel = value;
    }
  },
  /**
   * Default filter resolution.
   * @static
   * @name FILTER_RESOLUTION
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @type {number|null}
   * @see PIXI.Filter.defaultResolution
   */
  FILTER_RESOLUTION: {
    get() {
      return utils.deprecation("7.1.0", "settings.FILTER_RESOLUTION is deprecated, use Filter.defaultResolution"), Filter.Filter.defaultResolution;
    },
    set(value) {
      Filter.Filter.defaultResolution = value;
    }
  },
  /**
   * Default filter samples.
   * @static
   * @name FILTER_MULTISAMPLE
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @type {PIXI.MSAA_QUALITY}
   * @see PIXI.Filter.defaultMultisample
   */
  FILTER_MULTISAMPLE: {
    get() {
      return utils.deprecation("7.1.0", "settings.FILTER_MULTISAMPLE is deprecated, use Filter.defaultMultisample"), Filter.Filter.defaultMultisample;
    },
    set(value) {
      Filter.Filter.defaultMultisample = value;
    }
  },
  /**
   * The maximum textures that this device supports.
   * @static
   * @name SPRITE_MAX_TEXTURES
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @see PIXI.BatchRenderer.defaultMaxTextures
   * @type {number}
   */
  SPRITE_MAX_TEXTURES: {
    get() {
      return BatchRenderer.BatchRenderer.defaultMaxTextures;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.SPRITE_MAX_TEXTURES is deprecated, use BatchRenderer.defaultMaxTextures"), BatchRenderer.BatchRenderer.defaultMaxTextures = value;
    }
  },
  /**
   * The default sprite batch size.
   *
   * The default aims to balance desktop and mobile devices.
   * @static
   * @name SPRITE_BATCH_SIZE
   * @memberof PIXI.settings
   * @see PIXI.BatchRenderer.defaultBatchSize
   * @deprecated since 7.1.0
   * @type {number}
   */
  SPRITE_BATCH_SIZE: {
    get() {
      return BatchRenderer.BatchRenderer.defaultBatchSize;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.SPRITE_BATCH_SIZE is deprecated, use BatchRenderer.defaultBatchSize"), BatchRenderer.BatchRenderer.defaultBatchSize = value;
    }
  },
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   * @name CAN_UPLOAD_SAME_BUFFER
   * @memberof PIXI.settings
   * @see PIXI.BatchRenderer.canUploadSameBuffer
   * @deprecated since 7.1.0
   * @type {boolean}
   */
  CAN_UPLOAD_SAME_BUFFER: {
    get() {
      return BatchRenderer.BatchRenderer.canUploadSameBuffer;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.CAN_UPLOAD_SAME_BUFFER is deprecated, use BatchRenderer.canUploadSameBuffer"), BatchRenderer.BatchRenderer.canUploadSameBuffer = value;
    }
  },
  /**
   * Default Garbage Collection mode.
   * @static
   * @name GC_MODE
   * @memberof PIXI.settings
   * @type {PIXI.GC_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.TextureGCSystem.defaultMode
   */
  GC_MODE: {
    get() {
      return TextureGCSystem.TextureGCSystem.defaultMode;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.GC_MODE is deprecated, use TextureGCSystem.defaultMode"), TextureGCSystem.TextureGCSystem.defaultMode = value;
    }
  },
  /**
   * Default Garbage Collection max idle.
   * @static
   * @name GC_MAX_IDLE
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.TextureGCSystem.defaultMaxIdle
   */
  GC_MAX_IDLE: {
    get() {
      return TextureGCSystem.TextureGCSystem.defaultMaxIdle;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.GC_MAX_IDLE is deprecated, use TextureGCSystem.defaultMaxIdle"), TextureGCSystem.TextureGCSystem.defaultMaxIdle = value;
    }
  },
  /**
   * Default Garbage Collection maximum check count.
   * @static
   * @name GC_MAX_CHECK_COUNT
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.TextureGCSystem.defaultCheckCountMax
   */
  GC_MAX_CHECK_COUNT: {
    get() {
      return TextureGCSystem.TextureGCSystem.defaultCheckCountMax;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.GC_MAX_CHECK_COUNT is deprecated, use TextureGCSystem.defaultCheckCountMax"), TextureGCSystem.TextureGCSystem.defaultCheckCountMax = value;
    }
  },
  /**
   * Default specify float precision in vertex shader.
   * @static
   * @name PRECISION_VERTEX
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @deprecated since 7.1.0
   * @see PIXI.Program.defaultVertexPrecision
   */
  PRECISION_VERTEX: {
    get() {
      return Program.Program.defaultVertexPrecision;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.PRECISION_VERTEX is deprecated, use Program.defaultVertexPrecision"), Program.Program.defaultVertexPrecision = value;
    }
  },
  /**
   * Default specify float precision in fragment shader.
   * @static
   * @name PRECISION_FRAGMENT
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @deprecated since 7.1.0
   * @see PIXI.Program.defaultFragmentPrecision
   */
  PRECISION_FRAGMENT: {
    get() {
      return Program.Program.defaultFragmentPrecision;
    },
    set(value) {
      utils.deprecation("7.1.0", "settings.PRECISION_FRAGMENT is deprecated, use Program.defaultFragmentPrecision"), Program.Program.defaultFragmentPrecision = value;
    }
  }
});
//# sourceMappingURL=settings.js.map
