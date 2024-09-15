import { ExtensionType, extensions } from "@pixi/extensions";
import { Matrix, Rectangle } from "@pixi/math";
import { settings } from "@pixi/settings";
import { AbstractMaskSystem } from "./AbstractMaskSystem.mjs";
const tempMatrix = new Matrix(), rectPool = [], _ScissorSystem = class _ScissorSystem2 extends AbstractMaskSystem {
  /**
   * @param {PIXI.Renderer} renderer - The renderer this System works for.
   */
  constructor(renderer) {
    super(renderer), this.glConst = settings.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST;
  }
  getStackLength() {
    const maskData = this.maskStack[this.maskStack.length - 1];
    return maskData ? maskData._scissorCounter : 0;
  }
  /**
   * evaluates _boundsTransformed, _scissorRect for MaskData
   * @param maskData
   */
  calcScissorRect(maskData) {
    if (maskData._scissorRectLocal)
      return;
    const prevData = maskData._scissorRect, { maskObject } = maskData, { renderer } = this, renderTextureSystem = renderer.renderTexture, rect = maskObject.getBounds(!0, rectPool.pop() ?? new Rectangle());
    this.roundFrameToPixels(
      rect,
      renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution,
      renderTextureSystem.sourceFrame,
      renderTextureSystem.destinationFrame,
      renderer.projection.transform
    ), prevData && rect.fit(prevData), maskData._scissorRectLocal = rect;
  }
  static isMatrixRotated(matrix) {
    if (!matrix)
      return !1;
    const { a, b, c, d } = matrix;
    return (Math.abs(b) > 1e-4 || Math.abs(c) > 1e-4) && (Math.abs(a) > 1e-4 || Math.abs(d) > 1e-4);
  }
  /**
   * Test, whether the object can be scissor mask with current renderer projection.
   * Calls "calcScissorRect()" if its true.
   * @param maskData - mask data
   * @returns whether Whether the object can be scissor mask
   */
  testScissor(maskData) {
    const { maskObject } = maskData;
    if (!maskObject.isFastRect || !maskObject.isFastRect() || _ScissorSystem2.isMatrixRotated(maskObject.worldTransform) || _ScissorSystem2.isMatrixRotated(this.renderer.projection.transform))
      return !1;
    this.calcScissorRect(maskData);
    const rect = maskData._scissorRectLocal;
    return rect.width > 0 && rect.height > 0;
  }
  roundFrameToPixels(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
    _ScissorSystem2.isMatrixRotated(transform) || (transform = transform ? tempMatrix.copyFrom(transform) : tempMatrix.identity(), transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(
      bindingDestinationFrame.width / bindingSourceFrame.width,
      bindingDestinationFrame.height / bindingSourceFrame.height
    ).translate(bindingDestinationFrame.x, bindingDestinationFrame.y), this.renderer.filter.transformAABB(transform, frame), frame.fit(bindingDestinationFrame), frame.x = Math.round(frame.x * resolution), frame.y = Math.round(frame.y * resolution), frame.width = Math.round(frame.width * resolution), frame.height = Math.round(frame.height * resolution));
  }
  /**
   * Applies the Mask and adds it to the current stencil stack.
   * @author alvin
   * @param maskData - The mask data.
   */
  push(maskData) {
    maskData._scissorRectLocal || this.calcScissorRect(maskData);
    const { gl } = this.renderer;
    maskData._scissorRect || gl.enable(gl.SCISSOR_TEST), maskData._scissorCounter++, maskData._scissorRect = maskData._scissorRectLocal, this._useCurrent();
  }
  /**
   * This should be called after a mask is popped off the mask stack. It will rebind the scissor box to be latest with the
   * last mask in the stack.
   *
   * This can also be called when you directly modify the scissor box and want to restore PixiJS state.
   * @param maskData - The mask data.
   */
  pop(maskData) {
    const { gl } = this.renderer;
    maskData && rectPool.push(maskData._scissorRectLocal), this.getStackLength() > 0 ? this._useCurrent() : gl.disable(gl.SCISSOR_TEST);
  }
  /**
   * Setup renderer to use the current scissor data.
   * @private
   */
  _useCurrent() {
    const rect = this.maskStack[this.maskStack.length - 1]._scissorRect;
    let y;
    this.renderer.renderTexture.current ? y = rect.y : y = this.renderer.height - rect.height - rect.y, this.renderer.gl.scissor(rect.x, y, rect.width, rect.height);
  }
};
_ScissorSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "scissor"
};
let ScissorSystem = _ScissorSystem;
extensions.add(ScissorSystem);
export {
  ScissorSystem
};
//# sourceMappingURL=ScissorSystem.mjs.map
