import { MSAA_QUALITY } from "@pixi/constants";
class GLFramebuffer {
  constructor(framebuffer) {
    this.framebuffer = framebuffer, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = MSAA_QUALITY.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
  }
}
export {
  GLFramebuffer
};
//# sourceMappingURL=GLFramebuffer.mjs.map
