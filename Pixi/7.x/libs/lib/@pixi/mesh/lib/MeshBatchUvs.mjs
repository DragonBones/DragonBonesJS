class MeshBatchUvs {
  /**
   * @param uvBuffer - Buffer with normalized uv's
   * @param uvMatrix - Material UV matrix
   */
  constructor(uvBuffer, uvMatrix) {
    this.uvBuffer = uvBuffer, this.uvMatrix = uvMatrix, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
  }
  /**
   * Updates
   * @param forceUpdate - force the update
   */
  update(forceUpdate) {
    if (!forceUpdate && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID)
      return;
    this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
    const data = this.uvBuffer.data;
    (!this.data || this.data.length !== data.length) && (this.data = new Float32Array(data.length)), this.uvMatrix.multiplyUvs(data, this.data), this._updateID++;
  }
}
export {
  MeshBatchUvs
};
//# sourceMappingURL=MeshBatchUvs.mjs.map
