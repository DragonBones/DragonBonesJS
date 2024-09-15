"use strict";
var constants = require("@pixi/constants"), runner = require("@pixi/runner"), utils = require("@pixi/utils"), Attribute = require("./Attribute.js"), Buffer = require("./Buffer.js"), interleaveTypedArrays = require("./utils/interleaveTypedArrays.js");
const byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
let UID = 0;
const map = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
};
class Geometry {
  /**
   * @param buffers - An array of buffers. optional.
   * @param attributes - Of the geometry, optional structure of the attributes layout
   */
  constructor(buffers = [], attributes = {}) {
    this.buffers = buffers, this.indexBuffer = null, this.attributes = attributes, this.glVertexArrayObjects = {}, this.id = UID++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new runner.Runner("disposeGeometry"), this.refCount = 0;
  }
  /**
   *
   * Adds an attribute to the geometry
   * Note: `stride` and `start` should be `undefined` if you dont know them, not 0!
   * @param id - the name of the attribute (matching up to a shader)
   * @param {PIXI.Buffer|number[]} buffer - the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
   * @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
   * @param normalized - should the data be normalized.
   * @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
   * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
   * @param [start=0] - How far into the array to start reading values (used for interleaving data)
   * @param instance - Instancing flag
   * @returns - Returns self, useful for chaining.
   */
  addAttribute(id, buffer, size = 0, normalized = !1, type, stride, start, instance = !1) {
    if (!buffer)
      throw new Error("You must pass a buffer when creating an attribute");
    buffer instanceof Buffer.Buffer || (buffer instanceof Array && (buffer = new Float32Array(buffer)), buffer = new Buffer.Buffer(buffer));
    const ids = id.split("|");
    if (ids.length > 1) {
      for (let i = 0; i < ids.length; i++)
        this.addAttribute(ids[i], buffer, size, normalized, type);
      return this;
    }
    let bufferIndex = this.buffers.indexOf(buffer);
    return bufferIndex === -1 && (this.buffers.push(buffer), bufferIndex = this.buffers.length - 1), this.attributes[id] = new Attribute.Attribute(bufferIndex, size, normalized, type, stride, start, instance), this.instanced = this.instanced || instance, this;
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(id) {
    return this.attributes[id];
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(id) {
    return this.buffers[this.getAttribute(id).buffer];
  }
  /**
   *
   * Adds an index buffer to the geometry
   * The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
   * @param {PIXI.Buffer|number[]} [buffer] - The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
   * @returns - Returns self, useful for chaining.
   */
  addIndex(buffer) {
    return buffer instanceof Buffer.Buffer || (buffer instanceof Array && (buffer = new Uint16Array(buffer)), buffer = new Buffer.Buffer(buffer)), buffer.type = constants.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER, this.indexBuffer = buffer, this.buffers.includes(buffer) || this.buffers.push(buffer), this;
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * This function modifies the structure so that all current attributes become interleaved into a single buffer
   * This can be useful if your model remains static as it offers a little performance boost
   * @returns - Returns self, useful for chaining.
   */
  interleave() {
    if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer)
      return this;
    const arrays = [], sizes = [], interleavedBuffer = new Buffer.Buffer();
    let i;
    for (i in this.attributes) {
      const attribute = this.attributes[i], buffer = this.buffers[attribute.buffer];
      arrays.push(buffer.data), sizes.push(attribute.size * byteSizeMap[attribute.type] / 4), attribute.buffer = 0;
    }
    for (interleavedBuffer.data = interleaveTypedArrays.interleaveTypedArrays(arrays, sizes), i = 0; i < this.buffers.length; i++)
      this.buffers[i] !== this.indexBuffer && this.buffers[i].destroy();
    return this.buffers = [interleavedBuffer], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
  }
  /** Get the size of the geometries, in vertices. */
  getSize() {
    for (const i in this.attributes) {
      const attribute = this.attributes[i];
      return this.buffers[attribute.buffer].data.length / (attribute.stride / 4 || attribute.size);
    }
    return 0;
  }
  /** Disposes WebGL resources that are connected to this geometry. */
  dispose() {
    this.disposeRunner.emit(this, !1);
  }
  /** Destroys the geometry. */
  destroy() {
    this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
  }
  /**
   * Returns a clone of the geometry.
   * @returns - A new clone of this geometry.
   */
  clone() {
    const geometry = new Geometry();
    for (let i = 0; i < this.buffers.length; i++)
      geometry.buffers[i] = new Buffer.Buffer(this.buffers[i].data.slice(0));
    for (const i in this.attributes) {
      const attrib = this.attributes[i];
      geometry.attributes[i] = new Attribute.Attribute(
        attrib.buffer,
        attrib.size,
        attrib.normalized,
        attrib.type,
        attrib.stride,
        attrib.start,
        attrib.instance
      );
    }
    return this.indexBuffer && (geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)], geometry.indexBuffer.type = constants.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER), geometry;
  }
  /**
   * Merges an array of geometries into a new single one.
   *
   * Geometry attribute styles must match for this operation to work.
   * @param geometries - array of geometries to merge
   * @returns - Shiny new geometry!
   */
  static merge(geometries) {
    const geometryOut = new Geometry(), arrays = [], sizes = [], offsets = [];
    let geometry;
    for (let i = 0; i < geometries.length; i++) {
      geometry = geometries[i];
      for (let j = 0; j < geometry.buffers.length; j++)
        sizes[j] = sizes[j] || 0, sizes[j] += geometry.buffers[j].data.length, offsets[j] = 0;
    }
    for (let i = 0; i < geometry.buffers.length; i++)
      arrays[i] = new map[utils.getBufferType(geometry.buffers[i].data)](sizes[i]), geometryOut.buffers[i] = new Buffer.Buffer(arrays[i]);
    for (let i = 0; i < geometries.length; i++) {
      geometry = geometries[i];
      for (let j = 0; j < geometry.buffers.length; j++)
        arrays[j].set(geometry.buffers[j].data, offsets[j]), offsets[j] += geometry.buffers[j].data.length;
    }
    if (geometryOut.attributes = geometry.attributes, geometry.indexBuffer) {
      geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)], geometryOut.indexBuffer.type = constants.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
      let offset = 0, stride = 0, offset2 = 0, bufferIndexToCount = 0;
      for (let i = 0; i < geometry.buffers.length; i++)
        if (geometry.buffers[i] !== geometry.indexBuffer) {
          bufferIndexToCount = i;
          break;
        }
      for (const i in geometry.attributes) {
        const attribute = geometry.attributes[i];
        (attribute.buffer | 0) === bufferIndexToCount && (stride += attribute.size * byteSizeMap[attribute.type] / 4);
      }
      for (let i = 0; i < geometries.length; i++) {
        const indexBufferData = geometries[i].indexBuffer.data;
        for (let j = 0; j < indexBufferData.length; j++)
          geometryOut.indexBuffer.data[j + offset2] += offset;
        offset += geometries[i].buffers[bufferIndexToCount].data.length / stride, offset2 += indexBufferData.length;
      }
    }
    return geometryOut;
  }
}
exports.Geometry = Geometry;
//# sourceMappingURL=Geometry.js.map
