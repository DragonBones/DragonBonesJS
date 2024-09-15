class BatchTextureArray {
  constructor() {
    this.elements = [], this.ids = [], this.count = 0;
  }
  clear() {
    for (let i = 0; i < this.count; i++)
      this.elements[i] = null;
    this.count = 0;
  }
}
export {
  BatchTextureArray
};
//# sourceMappingURL=BatchTextureArray.mjs.map
