import { ObjectRenderer, Matrix, TYPES, Shader, State, utils, Color, ExtensionType, extensions } from "@pixi/core";
import { ParticleBuffer } from "./ParticleBuffer.mjs";
import fragment from "./particles.frag.mjs";
import vertex from "./particles.vert.mjs";
class ParticleRenderer extends ObjectRenderer {
  /**
   * @param renderer - The renderer this sprite batch works for.
   */
  constructor(renderer) {
    super(renderer), this.shader = null, this.properties = null, this.tempMatrix = new Matrix(), this.properties = [
      // verticesData
      {
        attributeName: "aVertexPosition",
        size: 2,
        uploadFunction: this.uploadVertices,
        offset: 0
      },
      // positionData
      {
        attributeName: "aPositionCoord",
        size: 2,
        uploadFunction: this.uploadPosition,
        offset: 0
      },
      // rotationData
      {
        attributeName: "aRotation",
        size: 1,
        uploadFunction: this.uploadRotation,
        offset: 0
      },
      // uvsData
      {
        attributeName: "aTextureCoord",
        size: 2,
        uploadFunction: this.uploadUvs,
        offset: 0
      },
      // tintData
      {
        attributeName: "aColor",
        size: 1,
        type: TYPES.UNSIGNED_BYTE,
        uploadFunction: this.uploadTint,
        offset: 0
      }
    ], this.shader = Shader.from(vertex, fragment, {}), this.state = State.for2d();
  }
  /**
   * Renders the particle container object.
   * @param container - The container to render using this ParticleRenderer.
   */
  render(container) {
    const children = container.children, maxSize = container._maxSize, batchSize = container._batchSize, renderer = this.renderer;
    let totalChildren = children.length;
    if (totalChildren === 0)
      return;
    totalChildren > maxSize && !container.autoResize && (totalChildren = maxSize);
    let buffers = container._buffers;
    buffers || (buffers = container._buffers = this.generateBuffers(container));
    const baseTexture = children[0]._texture.baseTexture, premultiplied = baseTexture.alphaMode > 0;
    this.state.blendMode = utils.correctBlendMode(container.blendMode, premultiplied), renderer.state.set(this.state);
    const gl = renderer.gl, m = container.worldTransform.copyTo(this.tempMatrix);
    m.prepend(renderer.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = m.toArray(!0), this.shader.uniforms.uColor = Color.shared.setValue(container.tintRgb).premultiply(container.worldAlpha, premultiplied).toArray(this.shader.uniforms.uColor), this.shader.uniforms.uSampler = baseTexture, this.renderer.shader.bind(this.shader);
    let updateStatic = !1;
    for (let i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
      let amount = totalChildren - i;
      amount > batchSize && (amount = batchSize), j >= buffers.length && buffers.push(this._generateOneMoreBuffer(container));
      const buffer = buffers[j];
      buffer.uploadDynamic(children, i, amount);
      const bid = container._bufferUpdateIDs[j] || 0;
      updateStatic = updateStatic || buffer._updateID < bid, updateStatic && (buffer._updateID = container._updateID, buffer.uploadStatic(children, i, amount)), renderer.geometry.bind(buffer.geometry), gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
    }
  }
  /**
   * Creates one particle buffer for each child in the container we want to render and updates internal properties.
   * @param container - The container to render using this ParticleRenderer
   * @returns - The buffers
   */
  generateBuffers(container) {
    const buffers = [], size = container._maxSize, batchSize = container._batchSize, dynamicPropertyFlags = container._properties;
    for (let i = 0; i < size; i += batchSize)
      buffers.push(new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize));
    return buffers;
  }
  /**
   * Creates one more particle buffer, because container has autoResize feature.
   * @param container - The container to render using this ParticleRenderer
   * @returns - The generated buffer
   */
  _generateOneMoreBuffer(container) {
    const batchSize = container._batchSize, dynamicPropertyFlags = container._properties;
    return new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize);
  }
  /**
   * Uploads the vertices.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their vertices uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadVertices(children, startIndex, amount, array, stride, offset) {
    let w0 = 0, w1 = 0, h0 = 0, h1 = 0;
    for (let i = 0; i < amount; ++i) {
      const sprite = children[startIndex + i], texture = sprite._texture, sx = sprite.scale.x, sy = sprite.scale.y, trim = texture.trim, orig = texture.orig;
      trim ? (w1 = trim.x - sprite.anchor.x * orig.width, w0 = w1 + trim.width, h1 = trim.y - sprite.anchor.y * orig.height, h0 = h1 + trim.height) : (w0 = orig.width * (1 - sprite.anchor.x), w1 = orig.width * -sprite.anchor.x, h0 = orig.height * (1 - sprite.anchor.y), h1 = orig.height * -sprite.anchor.y), array[offset] = w1 * sx, array[offset + 1] = h1 * sy, array[offset + stride] = w0 * sx, array[offset + stride + 1] = h1 * sy, array[offset + stride * 2] = w0 * sx, array[offset + stride * 2 + 1] = h0 * sy, array[offset + stride * 3] = w1 * sx, array[offset + stride * 3 + 1] = h0 * sy, offset += stride * 4;
    }
  }
  /**
   * Uploads the position.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their positions uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadPosition(children, startIndex, amount, array, stride, offset) {
    for (let i = 0; i < amount; i++) {
      const spritePosition = children[startIndex + i].position;
      array[offset] = spritePosition.x, array[offset + 1] = spritePosition.y, array[offset + stride] = spritePosition.x, array[offset + stride + 1] = spritePosition.y, array[offset + stride * 2] = spritePosition.x, array[offset + stride * 2 + 1] = spritePosition.y, array[offset + stride * 3] = spritePosition.x, array[offset + stride * 3 + 1] = spritePosition.y, offset += stride * 4;
    }
  }
  /**
   * Uploads the rotation.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their rotation uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadRotation(children, startIndex, amount, array, stride, offset) {
    for (let i = 0; i < amount; i++) {
      const spriteRotation = children[startIndex + i].rotation;
      array[offset] = spriteRotation, array[offset + stride] = spriteRotation, array[offset + stride * 2] = spriteRotation, array[offset + stride * 3] = spriteRotation, offset += stride * 4;
    }
  }
  /**
   * Uploads the UVs.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their rotation uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadUvs(children, startIndex, amount, array, stride, offset) {
    for (let i = 0; i < amount; ++i) {
      const textureUvs = children[startIndex + i]._texture._uvs;
      textureUvs ? (array[offset] = textureUvs.x0, array[offset + 1] = textureUvs.y0, array[offset + stride] = textureUvs.x1, array[offset + stride + 1] = textureUvs.y1, array[offset + stride * 2] = textureUvs.x2, array[offset + stride * 2 + 1] = textureUvs.y2, array[offset + stride * 3] = textureUvs.x3, array[offset + stride * 3 + 1] = textureUvs.y3, offset += stride * 4) : (array[offset] = 0, array[offset + 1] = 0, array[offset + stride] = 0, array[offset + stride + 1] = 0, array[offset + stride * 2] = 0, array[offset + stride * 2 + 1] = 0, array[offset + stride * 3] = 0, array[offset + stride * 3 + 1] = 0, offset += stride * 4);
    }
  }
  /**
   * Uploads the tint.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their rotation uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadTint(children, startIndex, amount, array, stride, offset) {
    for (let i = 0; i < amount; ++i) {
      const sprite = children[startIndex + i], result = Color.shared.setValue(sprite._tintRGB).toPremultiplied(sprite.alpha, sprite.texture.baseTexture.alphaMode > 0);
      array[offset] = result, array[offset + stride] = result, array[offset + stride * 2] = result, array[offset + stride * 3] = result, offset += stride * 4;
    }
  }
  /** Destroys the ParticleRenderer. */
  destroy() {
    super.destroy(), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
  }
}
ParticleRenderer.extension = {
  name: "particle",
  type: ExtensionType.RendererPlugin
};
extensions.add(ParticleRenderer);
export {
  ParticleRenderer
};
//# sourceMappingURL=ParticleRenderer.mjs.map
