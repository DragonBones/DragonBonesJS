var LINE_JOIN = /* @__PURE__ */ ((LINE_JOIN2) => (LINE_JOIN2.MITER = "miter", LINE_JOIN2.BEVEL = "bevel", LINE_JOIN2.ROUND = "round", LINE_JOIN2))(LINE_JOIN || {}), LINE_CAP = /* @__PURE__ */ ((LINE_CAP2) => (LINE_CAP2.BUTT = "butt", LINE_CAP2.ROUND = "round", LINE_CAP2.SQUARE = "square", LINE_CAP2))(LINE_CAP || {});
const curves = {
  adaptive: !0,
  maxLength: 10,
  minSegments: 8,
  maxSegments: 2048,
  epsilon: 1e-4,
  _segmentsCount(length, defaultSegments = 20) {
    if (!this.adaptive || !length || isNaN(length))
      return defaultSegments;
    let result = Math.ceil(length / this.maxLength);
    return result < this.minSegments ? result = this.minSegments : result > this.maxSegments && (result = this.maxSegments), result;
  }
}, GRAPHICS_CURVES = curves;
export {
  GRAPHICS_CURVES,
  LINE_CAP,
  LINE_JOIN,
  curves
};
//# sourceMappingURL=const.mjs.map
