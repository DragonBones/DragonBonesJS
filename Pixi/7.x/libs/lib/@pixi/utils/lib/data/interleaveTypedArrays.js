"use strict";
var getBufferType = require("./getBufferType.js");
const map = { Float32Array, Uint32Array, Int32Array, Uint8Array };
function interleaveTypedArrays(arrays, sizes) {
  let outSize = 0, stride = 0;
  const views = {};
  for (let i = 0; i < arrays.length; i++)
    stride += sizes[i], outSize += arrays[i].length;
  const buffer = new ArrayBuffer(outSize * 4);
  let out = null, littleOffset = 0;
  for (let i = 0; i < arrays.length; i++) {
    const size = sizes[i], array = arrays[i], type = getBufferType.getBufferType(array);
    views[type] || (views[type] = new map[type](buffer)), out = views[type];
    for (let j = 0; j < array.length; j++) {
      const indexStart = (j / size | 0) * stride + littleOffset, index = j % size;
      out[indexStart + index] = array[j];
    }
    littleOffset += size;
  }
  return new Float32Array(buffer);
}
exports.interleaveTypedArrays = interleaveTypedArrays;
//# sourceMappingURL=interleaveTypedArrays.js.map
