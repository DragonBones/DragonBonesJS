import { ENV } from "@pixi/constants";
import { settings } from "@pixi/settings";
const unknownContext = {};
let context = unknownContext;
function getTestContext() {
  if (context === unknownContext || context?.isContextLost()) {
    const canvas = settings.ADAPTER.createCanvas();
    let gl;
    settings.PREFER_ENV >= ENV.WEBGL2 && (gl = canvas.getContext("webgl2", {})), gl || (gl = canvas.getContext("webgl", {}) || canvas.getContext("experimental-webgl", {}), gl ? gl.getExtension("WEBGL_draw_buffers") : gl = null), context = gl;
  }
  return context;
}
export {
  getTestContext
};
//# sourceMappingURL=getTestContext.mjs.map
