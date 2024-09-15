import { BufferResource, ViewableBuffer } from "@pixi/core";
class BlobResource extends BufferResource {
  /**
   * @param source - The buffer/URL of the texture file.
   * @param {PIXI.IBlobResourceOptions} [options]
   * @param {boolean} [options.autoLoad=false] - Whether to fetch the data immediately;
   *  you can fetch it later via {@link PIXI.BlobResource#load}.
   * @param {number} [options.width=1] - The width in pixels.
   * @param {number} [options.height=1] - The height in pixels.
   * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
   */
  constructor(source, options = { width: 1, height: 1, autoLoad: !0 }) {
    let origin, data;
    typeof source == "string" ? (origin = source, data = new Uint8Array()) : (origin = null, data = source), super(data, options), this.origin = origin, this.buffer = data ? new ViewableBuffer(data) : null, this._load = null, this.loaded = !1, this.origin !== null && options.autoLoad !== !1 && this.load(), this.origin === null && this.buffer && (this._load = Promise.resolve(this), this.loaded = !0, this.onBlobLoaded(this.buffer.rawBinaryData));
  }
  onBlobLoaded(_data) {
  }
  /** Loads the blob */
  load() {
    return this._load ? this._load : (this._load = fetch(this.origin).then((response) => response.blob()).then((blob) => blob.arrayBuffer()).then((arrayBuffer) => (this.data = new Uint32Array(arrayBuffer), this.buffer = new ViewableBuffer(arrayBuffer), this.loaded = !0, this.onBlobLoaded(arrayBuffer), this.update(), this)), this._load);
  }
}
export {
  BlobResource
};
//# sourceMappingURL=BlobResource.mjs.map
