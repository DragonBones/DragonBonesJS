"use strict";
function nextPow2(v) {
  return v += v === 0 ? 1 : 0, --v, v |= v >>> 1, v |= v >>> 2, v |= v >>> 4, v |= v >>> 8, v |= v >>> 16, v + 1;
}
function isPow2(v) {
  return !(v & v - 1) && !!v;
}
function log2(v) {
  let r = (v > 65535 ? 1 : 0) << 4;
  v >>>= r;
  let shift = (v > 255 ? 1 : 0) << 3;
  return v >>>= shift, r |= shift, shift = (v > 15 ? 1 : 0) << 2, v >>>= shift, r |= shift, shift = (v > 3 ? 1 : 0) << 1, v >>>= shift, r |= shift, r | v >> 1;
}
exports.isPow2 = isPow2;
exports.log2 = log2;
exports.nextPow2 = nextPow2;
//# sourceMappingURL=pow2.js.map
