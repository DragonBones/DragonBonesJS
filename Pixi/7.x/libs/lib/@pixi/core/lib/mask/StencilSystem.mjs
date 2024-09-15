import { ExtensionType, extensions } from "@pixi/extensions";
import { settings } from "@pixi/settings";
import { AbstractMaskSystem } from "./AbstractMaskSystem.mjs";
class StencilSystem extends AbstractMaskSystem {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(renderer) {
    super(renderer), this.glConst = settings.ADAPTER.getWebGLRenderingContext().STENCIL_TEST;
  }
  getStackLength() {
    const maskData = this.maskStack[this.maskStack.length - 1];
    return maskData ? maskData._stencilCounter : 0;
  }
  /**
   * Applies the Mask and adds it to the current stencil stack.
   * @param maskData - The mask data
   */
  push(maskData) {
    const maskObject = maskData.maskObject, { gl } = this.renderer, prevMaskCount = maskData._stencilCounter;
    prevMaskCount === 0 && (this.renderer.framebuffer.forceStencil(), gl.clearStencil(0), gl.clear(gl.STENCIL_BUFFER_BIT), gl.enable(gl.STENCIL_TEST)), maskData._stencilCounter++;
    const colorMask = maskData._colorMask;
    colorMask !== 0 && (maskData._colorMask = 0, gl.colorMask(!1, !1, !1, !1)), gl.stencilFunc(gl.EQUAL, prevMaskCount, 4294967295), gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR), maskObject.renderable = !0, maskObject.render(this.renderer), this.renderer.batch.flush(), maskObject.renderable = !1, colorMask !== 0 && (maskData._colorMask = colorMask, gl.colorMask(
      (colorMask & 1) !== 0,
      (colorMask & 2) !== 0,
      (colorMask & 4) !== 0,
      (colorMask & 8) !== 0
    )), this._useCurrent();
  }
  /**
   * Pops stencil mask. MaskData is already removed from stack
   * @param {PIXI.DisplayObject} maskObject - object of popped mask data
   */
  pop(maskObject) {
    const gl = this.renderer.gl;
    if (this.getStackLength() === 0)
      gl.disable(gl.STENCIL_TEST);
    else {
      const maskData = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null, colorMask = maskData ? maskData._colorMask : 15;
      colorMask !== 0 && (maskData._colorMask = 0, gl.colorMask(!1, !1, !1, !1)), gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR), maskObject.renderable = !0, maskObject.render(this.renderer), this.renderer.batch.flush(), maskObject.renderable = !1, colorMask !== 0 && (maskData._colorMask = colorMask, gl.colorMask(
        (colorMask & 1) !== 0,
        (colorMask & 2) !== 0,
        (colorMask & 4) !== 0,
        (colorMask & 8) !== 0
      )), this._useCurrent();
    }
  }
  /**
   * Setup renderer to use the current stencil data.
   * @private
   */
  _useCurrent() {
    const gl = this.renderer.gl;
    gl.stencilFunc(gl.EQUAL, this.getStackLength(), 4294967295), gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  }
}
StencilSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "stencil"
};
extensions.add(StencilSystem);
export {
  StencilSystem
};
//# sourceMappingURL=StencilSystem.mjs.map
