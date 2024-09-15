"use strict";
var constants = require("@pixi/constants"), extensions = require("@pixi/extensions");
class MultisampleSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  contextChange(gl) {
    let samples;
    if (this.renderer.context.webGLVersion === 1) {
      const framebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null), samples = gl.getParameter(gl.SAMPLES), gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    } else {
      const framebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null), samples = gl.getParameter(gl.SAMPLES), gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer);
    }
    samples >= constants.MSAA_QUALITY.HIGH ? this.multisample = constants.MSAA_QUALITY.HIGH : samples >= constants.MSAA_QUALITY.MEDIUM ? this.multisample = constants.MSAA_QUALITY.MEDIUM : samples >= constants.MSAA_QUALITY.LOW ? this.multisample = constants.MSAA_QUALITY.LOW : this.multisample = constants.MSAA_QUALITY.NONE;
  }
  destroy() {
  }
}
MultisampleSystem.extension = {
  type: extensions.ExtensionType.RendererSystem,
  name: "_multisample"
};
extensions.extensions.add(MultisampleSystem);
exports.MultisampleSystem = MultisampleSystem;
//# sourceMappingURL=MultisampleSystem.js.map
