import { Matrix, ObjectRenderer, QuadUv, State, Shader, WRAP_MODES, Color, utils, ExtensionType, extensions } from "@pixi/core";
import gl2FragmentSrc from "./sprite-tiling.frag.mjs";
import gl2VertexSrc from "./sprite-tiling.vert.mjs";
import gl1FragmentSrc from "./sprite-tiling-fallback.frag.mjs";
import gl1VertexSrc from "./sprite-tiling-fallback.vert.mjs";
import fragmentSimpleSrc from "./sprite-tiling-simple.frag.mjs";
const tempMat = new Matrix();
class TilingSpriteRenderer extends ObjectRenderer {
  /**
   * constructor for renderer
   * @param {PIXI.Renderer} renderer - The renderer this tiling awesomeness works for.
   */
  constructor(renderer) {
    super(renderer), renderer.runners.contextChange.add(this), this.quad = new QuadUv(), this.state = State.for2d();
  }
  /** Creates shaders when context is initialized. */
  contextChange() {
    const renderer = this.renderer, uniforms = { globals: renderer.globalUniforms };
    this.simpleShader = Shader.from(gl1VertexSrc, fragmentSimpleSrc, uniforms), this.shader = renderer.context.webGLVersion > 1 ? Shader.from(gl2VertexSrc, gl2FragmentSrc, uniforms) : Shader.from(gl1VertexSrc, gl1FragmentSrc, uniforms);
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
    isSimple && (baseTex._glTextures[renderer.CONTEXT_UID] ? isSimple = baseTex.wrapMode !== WRAP_MODES.CLAMP : baseTex.wrapMode === WRAP_MODES.CLAMP && (baseTex.wrapMode = WRAP_MODES.REPEAT));
    const shader = isSimple ? this.simpleShader : this.shader, w = tex.width, h = tex.height, W = ts._width, H = ts._height;
    tempMat.set(
      lt.a * w / W,
      lt.b * w / H,
      lt.c * h / W,
      lt.d * h / H,
      lt.tx / W,
      lt.ty / H
    ), tempMat.invert(), isSimple ? tempMat.prepend(uv.mapCoord) : (shader.uniforms.uMapCoord = uv.mapCoord.toArray(!0), shader.uniforms.uClampFrame = uv.uClampFrame, shader.uniforms.uClampOffset = uv.uClampOffset), shader.uniforms.uTransform = tempMat.toArray(!0), shader.uniforms.uColor = Color.shared.setValue(ts.tint).premultiply(ts.worldAlpha, premultiplied).toArray(shader.uniforms.uColor), shader.uniforms.translationMatrix = ts.transform.worldTransform.toArray(!0), shader.uniforms.uSampler = tex, renderer.shader.bind(shader), renderer.geometry.bind(quad), this.state.blendMode = utils.correctBlendMode(ts.blendMode, premultiplied), renderer.state.set(this.state), renderer.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
  }
}
TilingSpriteRenderer.extension = {
  name: "tilingSprite",
  type: ExtensionType.RendererPlugin
};
extensions.add(TilingSpriteRenderer);
export {
  TilingSpriteRenderer
};
//# sourceMappingURL=TilingSpriteRenderer.mjs.map
