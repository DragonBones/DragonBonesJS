"use strict";
var core = require("@pixi/core");
class ParticleBuffer {
  /**
   * @param {object} properties - The properties to upload.
   * @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
   * @param {number} size - The size of the batch.
   */
  constructor(properties, dynamicPropertyFlags, size) {
    this.geometry = new core.Geometry(), this.indexBuffer = null, this.size = size, this.dynamicProperties = [], this.staticProperties = [];
    for (let i = 0; i < properties.length; ++i) {
      let property = properties[i];
      property = {
        attributeName: property.attributeName,
        size: property.size,
        uploadFunction: property.uploadFunction,
        type: property.type || core.TYPES.FLOAT,
        offset: property.offset
      }, dynamicPropertyFlags[i] ? this.dynamicProperties.push(property) : this.staticProperties.push(property);
    }
    this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
  }
  /** Sets up the renderer context and necessary buffers. */
  initBuffers() {
    const geometry = this.geometry;
    let dynamicOffset = 0;
    this.indexBuffer = new core.Buffer(core.utils.createIndicesForQuads(this.size), !0, !0), geometry.addIndex(this.indexBuffer), this.dynamicStride = 0;
    for (let i = 0; i < this.dynamicProperties.length; ++i) {
      const property = this.dynamicProperties[i];
      property.offset = dynamicOffset, dynamicOffset += property.size, this.dynamicStride += property.size;
    }
    const dynBuffer = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
    this.dynamicData = new Float32Array(dynBuffer), this.dynamicDataUint32 = new Uint32Array(dynBuffer), this.dynamicBuffer = new core.Buffer(this.dynamicData, !1, !1);
    let staticOffset = 0;
    this.staticStride = 0;
    for (let i = 0; i < this.staticProperties.length; ++i) {
      const property = this.staticProperties[i];
      property.offset = staticOffset, staticOffset += property.size, this.staticStride += property.size;
    }
    const statBuffer = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
    this.staticData = new Float32Array(statBuffer), this.staticDataUint32 = new Uint32Array(statBuffer), this.staticBuffer = new core.Buffer(this.staticData, !0, !1);
    for (let i = 0; i < this.dynamicProperties.length; ++i) {
      const property = this.dynamicProperties[i];
      geometry.addAttribute(
        property.attributeName,
        this.dynamicBuffer,
        0,
        property.type === core.TYPES.UNSIGNED_BYTE,
        property.type,
        this.dynamicStride * 4,
        property.offset * 4
      );
    }
    for (let i = 0; i < this.staticProperties.length; ++i) {
      const property = this.staticProperties[i];
      geometry.addAttribute(
        property.attributeName,
        this.staticBuffer,
        0,
        property.type === core.TYPES.UNSIGNED_BYTE,
        property.type,
        this.staticStride * 4,
        property.offset * 4
      );
    }
  }
  /**
   * Uploads the dynamic properties.
   * @param children - The children to upload.
   * @param startIndex - The index to start at.
   * @param amount - The number to upload.
   */
  uploadDynamic(children, startIndex, amount) {
    for (let i = 0; i < this.dynamicProperties.length; i++) {
      const property = this.dynamicProperties[i];
      property.uploadFunction(
        children,
        startIndex,
        amount,
        property.type === core.TYPES.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData,
        this.dynamicStride,
        property.offset
      );
    }
    this.dynamicBuffer._updateID++;
  }
  /**
   * Uploads the static properties.
   * @param children - The children to upload.
   * @param startIndex - The index to start at.
   * @param amount - The number to upload.
   */
  uploadStatic(children, startIndex, amount) {
    for (let i = 0; i < this.staticProperties.length; i++) {
      const property = this.staticProperties[i];
      property.uploadFunction(
        children,
        startIndex,
        amount,
        property.type === core.TYPES.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData,
        this.staticStride,
        property.offset
      );
    }
    this.staticBuffer._updateID++;
  }
  /** Destroys the ParticleBuffer. */
  destroy() {
    this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
  }
}
exports.ParticleBuffer = ParticleBuffer;
//# sourceMappingURL=ParticleBuffer.js.map
