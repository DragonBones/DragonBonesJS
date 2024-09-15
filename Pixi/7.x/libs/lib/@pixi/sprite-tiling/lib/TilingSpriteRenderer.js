"use strict";
var core = require("@pixi/core"), spriteTiling$1 = require("./sprite-tiling.frag.js"), spriteTiling = require("./sprite-tiling.vert.js"), spriteTilingFallback$1 = require("./sprite-tiling-fallback.frag.js"), spriteTilingFallback = require("./sprite-tiling-fallback.vert.js"), spriteTilingSimple = require("./sprite-tiling-simple.frag.js");
const tempMat = new core.Matrix();
class TilingSpriteRenderer extends core.ObjectRenderer {
  /**
   * constructor for renderer
   * @param {PIXI.Renderer} renderer - The renderer this tiling awesomeness works for.
   */
  constructor(renderer) {
    super(renderer), renderer.runners.contextChange.add(this), this.quad = new core.QuadUv(), this.state = core.State.for2d();
  }
  /** Creates shaders when context is initialized. */
  contextChange() {
    const renderer = this.renderer, uniforms = { globals: renderer.globalUniforms };
    this.simpleShader = core.Shader.from(spriteTilingFallback.default, spriteTilingSimple.default, uniforms), this.shader = renderer.context.webGLVersion > 1 ? core.Shader.from(spriteTiling.default, spriteTiling$1.default, uniforms) : core.Shader.from(spriteTilingFallback.default, spriteTilingFallback$1.default, uniforms);
  }
  /**
   * @param {PIXI.TilingSprite} ts - tilingSprite to be rendered
   */
  render(ts) {
    const renderer = this.renderer, quad = this.quad;
    let vertices = quad.vertices;
    vertices[0] = vertices[6] = ts._width * -ts.anchor.x, vertices[1] = vertices[3] = ts._height * -ts.anchor.y, vertices[2] = vertices[4] = ts._width * (1 - ts.anchor.x), vertices[5] = vertices[7] = ts._height * (1 - ts.anchor.y);
    const anchorX = ts.uvRespectAnchor ? ts.anchor.x : 0, anchorY = ts.uvRespectAnchor ? ts.anchor.y : 0;
    vertices = quad.uvs, vertices[0] = vertices[6] = -anchorX, vertices[1] = vertices[3] = -anchorY, vertices[2] = vertices[4] = 1 - anchorX, vertices[5] = vertices[7] = 1 - anchorY, quad.invalidate();
    const tex = ts._texture, baseTex = tex.baseTexture, premultiplied = baseTex.alphaMode > 0, lt = ts.tileTransform.localTransform, uv = ts.uvMatrix;
    let isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;
    isSimple && (baseTex._glTextures[renderer.CONTEXT_UID] ? isSimple = baseTex.wrapMode !== core.WRAP_MODES.CLAMP : baseTex.wrapMode === core.WRAP_MODES.CLAMP && (baseTex.wrapMode = core.WRAP_MODES.REPEAT));
    const shader = isSimple ? this.simpleShader : this.shader, w = tex.width, h = tex.height, W = ts._width, H = ts._height;
    tempMat.set(
      lt.a * w / W,
      lt.b * w / H,
      lt.c * h / W,
      lt.d * h / H,
      lt.tx / W,
      lt.ty / H
    ), tempMat.invert(), isSimple ? tempMat.prepend(uv.mapCoord) : (shader.uniforms.uMapCoord = uv.mapCoord.toArray(!0), shader.uniforms.uClampFrame = uv.uClampFrame, shader.uniforms.uClampOffset = uv.uClampOffset), shader.uniforms.uTransform = tempMat.toArray(!0), shader.uniforms.uColor = core.Color.shared.setValue(ts.tint).premultiply(ts.worldAlpha, premultiplied).toArray(shader.uniforms.uColor), shader.uniforms.translationMatrix = ts.transform.worldTransform.toArray(!0), shader.uniforms.uSampler = tex, renderer.shader.bind(shader), renderer.geometry.bind(quad), this.state.blendMode = core.utils.correctBlendMode(ts.blendMode, premultiplied), renderer.state.set(this.state), renderer.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
  }
}
TilingSpriteRenderer.extension = {
  name: "tilingSprite",
  type: core.ExtensionType.RendererPlugin
};
core.extensions.add(TilingSpriteRenderer);
exports.TilingSpriteRenderer = TilingSpriteRenderer;
//# sourceMappingURL=TilingSpriteRenderer.js.map
