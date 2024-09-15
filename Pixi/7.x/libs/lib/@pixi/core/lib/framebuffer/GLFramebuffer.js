"use strict";
var constants = require("@pixi/constants");
class GLFramebuffer {
  constructor(framebuffer) {
    this.framebuffer = framebuffer, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = constants.MSAA_QUALITY.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
  }
}
exports.GLFramebuffer = GLFramebuffer;
//# sourceMappingURL=GLFramebuffer.js.map
