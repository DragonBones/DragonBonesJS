"use strict";
var core = require("@pixi/core");
require("../../loader/index.js");
var loadTextures = require("../../loader/parsers/textures/loadTextures.js");
const resolveTextureUrl = {
  extension: core.ExtensionType.ResolveParser,
  test: loadTextures.loadTextures.test,
  parse: (value) => ({
    resolution: parseFloat(core.settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
    format: core.utils.path.extname(value).slice(1),
    src: value
  })
};
core.extensions.add(resolveTextureUrl);
exports.resolveTextureUrl = resolveTextureUrl;
//# sourceMappingURL=resolveTextureUrl.js.map
