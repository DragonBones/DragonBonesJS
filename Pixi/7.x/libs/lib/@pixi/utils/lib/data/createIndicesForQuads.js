"use strict";
function createIndicesForQuads(size, outBuffer = null) {
  const totalIndices = size * 6;
  if (outBuffer = outBuffer || new Uint16Array(totalIndices), outBuffer.length !== totalIndices)
    throw new Error(`Out buffer length is incorrect, got ${outBuffer.length} and expected ${totalIndices}`);
  for (let i = 0, j = 0; i < totalIndices; i += 6, j += 4)
    outBuffer[i + 0] = j + 0, outBuffer[i + 1] = j + 1, outBuffer[i + 2] = j + 2, outBuffer[i + 3] = j + 0, outBuffer[i + 4] = j + 2, outBuffer[i + 5] = j + 3;
  return outBuffer;
}
exports.createIndicesForQuads = createIndicesForQuads;
//# sourceMappingURL=createIndicesForQuads.js.map
