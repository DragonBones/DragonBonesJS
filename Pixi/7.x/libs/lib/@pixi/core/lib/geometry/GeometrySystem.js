"use strict";
var constants = require("@pixi/constants"), extensions = require("@pixi/extensions"), settings = require("@pixi/settings");
const byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
class GeometrySystem {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this.renderer = renderer, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this.canUseUInt32ElementIndex = !1, this.managedGeometries = {};
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.disposeAll(!0);
    const gl = this.gl = this.renderer.gl, context = this.renderer.context;
    if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, context.webGLVersion !== 2) {
      let nativeVaoExtension = this.renderer.context.extensions.vertexArrayObject;
      settings.settings.PREFER_ENV === constants.ENV.WEBGL_LEGACY && (nativeVaoExtension = null), nativeVaoExtension ? (gl.createVertexArray = () => nativeVaoExtension.createVertexArrayOES(), gl.bindVertexArray = (vao) => nativeVaoExtension.bindVertexArrayOES(vao), gl.deleteVertexArray = (vao) => nativeVaoExtension.deleteVertexArrayOES(vao)) : (this.hasVao = !1, gl.createVertexArray = () => null, gl.bindVertexArray = () => null, gl.deleteVertexArray = () => null);
    }
    if (context.webGLVersion !== 2) {
      const instanceExt = gl.getExtension("ANGLE_instanced_arrays");
      instanceExt ? (gl.vertexAttribDivisor = (a, b) => instanceExt.vertexAttribDivisorANGLE(a, b), gl.drawElementsInstanced = (a, b, c, d, e) => instanceExt.drawElementsInstancedANGLE(a, b, c, d, e), gl.drawArraysInstanced = (a, b, c, d) => instanceExt.drawArraysInstancedANGLE(a, b, c, d)) : this.hasInstance = !1;
    }
    this.canUseUInt32ElementIndex = context.webGLVersion === 2 || !!context.extensions.uint32ElementIndex;
  }
  /**
   * Binds geometry so that is can be drawn. Creating a Vao if required
   * @param geometry - Instance of geometry to bind.
   * @param shader - Instance of shader to use vao for.
   */
  bind(geometry, shader) {
    shader = shader || this.renderer.shader.shader;
    const { gl } = this;
    let vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID], incRefCount = !1;
    vaos || (this.managedGeometries[geometry.id] = geometry, geometry.disposeRunner.add(this), geometry.glVertexArrayObjects[this.CONTEXT_UID] = vaos = {}, incRefCount = !0);
    const vao = vaos[shader.program.id] || this.initGeometryVao(geometry, shader, incRefCount);
    this._activeGeometry = geometry, this._activeVao !== vao && (this._activeVao = vao, this.hasVao ? gl.bindVertexArray(vao) : this.activateVao(geometry, shader.program)), this.updateBuffers();
  }
  /** Reset and unbind any active VAO and geometry. */
  reset() {
    this.unbind();
  }
  /** Update buffers of the currently bound geometry. */
  updateBuffers() {
    const geometry = this._activeGeometry, bufferSystem = this.renderer.buffer;
    for (let i = 0; i < geometry.buffers.length; i++) {
      const buffer = geometry.buffers[i];
      bufferSystem.update(buffer);
    }
  }
  /**
   * Check compatibility between a geometry and a program
   * @param geometry - Geometry instance.
   * @param program - Program instance.
   */
  checkCompatibility(geometry, program) {
    const geometryAttributes = geometry.attributes, shaderAttributes = program.attributeData;
    for (const j in shaderAttributes)
      if (!geometryAttributes[j])
        throw new Error(`shader and geometry incompatible, geometry missing the "${j}" attribute`);
  }
  /**
   * Takes a geometry and program and generates a unique signature for them.
   * @param geometry - To get signature from.
   * @param program - To test geometry against.
   * @returns - Unique signature of the geometry and program
   */
  getSignature(geometry, program) {
    const attribs = geometry.attributes, shaderAttributes = program.attributeData, strings = ["g", geometry.id];
    for (const i in attribs)
      shaderAttributes[i] && strings.push(i, shaderAttributes[i].location);
    return strings.join("-");
  }
  /**
   * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
   * If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
   * attribute locations.
   * @param geometry - Instance of geometry to to generate Vao for.
   * @param shader - Instance of the shader.
   * @param incRefCount - Increment refCount of all geometry buffers.
   */
  initGeometryVao(geometry, shader, incRefCount = !0) {
    const gl = this.gl, CONTEXT_UID = this.CONTEXT_UID, bufferSystem = this.renderer.buffer, program = shader.program;
    program.glPrograms[CONTEXT_UID] || this.renderer.shader.generateProgram(shader), this.checkCompatibility(geometry, program);
    const signature = this.getSignature(geometry, program), vaoObjectHash = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    let vao = vaoObjectHash[signature];
    if (vao)
      return vaoObjectHash[program.id] = vao, vao;
    const buffers = geometry.buffers, attributes = geometry.attributes, tempStride = {}, tempStart = {};
    for (const j in buffers)
      tempStride[j] = 0, tempStart[j] = 0;
    for (const j in attributes)
      !attributes[j].size && program.attributeData[j] ? attributes[j].size = program.attributeData[j].size : attributes[j].size || console.warn(`PIXI Geometry attribute '${j}' size cannot be determined (likely the bound shader does not have the attribute)`), tempStride[attributes[j].buffer] += attributes[j].size * byteSizeMap[attributes[j].type];
    for (const j in attributes) {
      const attribute = attributes[j], attribSize = attribute.size;
      attribute.stride === void 0 && (tempStride[attribute.buffer] === attribSize * byteSizeMap[attribute.type] ? attribute.stride = 0 : attribute.stride = tempStride[attribute.buffer]), attribute.start === void 0 && (attribute.start = tempStart[attribute.buffer], tempStart[attribute.buffer] += attribSize * byteSizeMap[attribute.type]);
    }
    vao = gl.createVertexArray(), gl.bindVertexArray(vao);
    for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i];
      bufferSystem.bind(buffer), incRefCount && buffer._glBuffers[CONTEXT_UID].refCount++;
    }
    return this.activateVao(geometry, program), vaoObjectHash[program.id] = vao, vaoObjectHash[signature] = vao, gl.bindVertexArray(null), bufferSystem.unbind(constants.BUFFER_TYPE.ARRAY_BUFFER), vao;
  }
  /**
   * Disposes geometry.
   * @param geometry - Geometry with buffers. Only VAO will be disposed
   * @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  disposeGeometry(geometry, contextLost) {
    if (!this.managedGeometries[geometry.id])
      return;
    delete this.managedGeometries[geometry.id];
    const vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID], gl = this.gl, buffers = geometry.buffers, bufferSystem = this.renderer?.buffer;
    if (geometry.disposeRunner.remove(this), !!vaos) {
      if (bufferSystem)
        for (let i = 0; i < buffers.length; i++) {
          const buf = buffers[i]._glBuffers[this.CONTEXT_UID];
          buf && (buf.refCount--, buf.refCount === 0 && !contextLost && bufferSystem.dispose(buffers[i], contextLost));
        }
      if (!contextLost) {
        for (const vaoId in vaos)
          if (vaoId[0] === "g") {
            const vao = vaos[vaoId];
            this._activeVao === vao && this.unbind(), gl.deleteVertexArray(vao);
          }
      }
      delete geometry.glVertexArrayObjects[this.CONTEXT_UID];
    }
  }
  /**
   * Dispose all WebGL resources of all managed geometries.
   * @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
   */
  disposeAll(contextLost) {
    const all = Object.keys(this.managedGeometries);
    for (let i = 0; i < all.length; i++)
      this.disposeGeometry(this.managedGeometries[all[i]], contextLost);
  }
  /**
   * Activate vertex array object.
   * @param geometry - Geometry instance.
   * @param program - Shader program instance.
   */
  activateVao(geometry, program) {
    const gl = this.gl, CONTEXT_UID = this.CONTEXT_UID, bufferSystem = this.renderer.buffer, buffers = geometry.buffers, attributes = geometry.attributes;
    geometry.indexBuffer && bufferSystem.bind(geometry.indexBuffer);
    let lastBuffer = null;
    for (const j in attributes) {
      const attribute = attributes[j], buffer = buffers[attribute.buffer], glBuffer = buffer._glBuffers[CONTEXT_UID];
      if (program.attributeData[j]) {
        lastBuffer !== glBuffer && (bufferSystem.bind(buffer), lastBuffer = glBuffer);
        const location = program.attributeData[j].location;
        if (gl.enableVertexAttribArray(location), gl.vertexAttribPointer(
          location,
          attribute.size,
          attribute.type || gl.FLOAT,
          attribute.normalized,
          attribute.stride,
          attribute.start
        ), attribute.instance)
          if (this.hasInstance)
            gl.vertexAttribDivisor(location, attribute.divisor);
          else
            throw new Error("geometry error, GPU Instancing is not supported on this device");
      }
    }
  }
  /**
   * Draws the currently bound geometry.
   * @param type - The type primitive to render.
   * @param size - The number of elements to be rendered. If not specified, all vertices after the
   *  starting vertex will be drawn.
   * @param start - The starting vertex in the geometry to start drawing from. If not specified,
   *  drawing will start from the first vertex.
   * @param instanceCount - The number of instances of the set of elements to execute. If not specified,
   *  all instances will be drawn.
   */
  draw(type, size, start, instanceCount) {
    const { gl } = this, geometry = this._activeGeometry;
    if (geometry.indexBuffer) {
      const byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT, glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
      byteSize === 2 || byteSize === 4 && this.canUseUInt32ElementIndex ? geometry.instanced ? gl.drawElementsInstanced(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, instanceCount || 1) : gl.drawElements(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize) : console.warn("unsupported index buffer type: uint32");
    } else
      geometry.instanced ? gl.drawArraysInstanced(type, start, size || geometry.getSize(), instanceCount || 1) : gl.drawArrays(type, start, size || geometry.getSize());
    return this;
  }
  /** Unbind/reset everything. */
  unbind() {
    this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
  }
  destroy() {
    this.renderer = null;
  }
}
GeometrySystem.extension = {
  type: extensions.ExtensionType.RendererSystem,
  name: "geometry"
};
extensions.extensions.add(GeometrySystem);
exports.GeometrySystem = GeometrySystem;
//# sourceMappingURL=GeometrySystem.js.map
