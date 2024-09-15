"use strict";
var constants = require("@pixi/constants");
class GLTexture {
  constructor(texture) {
    this.texture = texture, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = constants.TYPES.UNSIGNED_BYTE, this.internalFormat = constants.FORMATS.RGBA, this.samplerType = 0;
  }
}
exports.GLTexture = GLTexture;
//# sourceMappingURL=GLTexture.js.map
