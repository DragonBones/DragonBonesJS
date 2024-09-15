"use strict";
var getCanvasBoundingBox = require("./getCanvasBoundingBox.js");
function trimCanvas(canvas) {
  const boundingBox = getCanvasBoundingBox.getCanvasBoundingBox(canvas), { width, height } = boundingBox;
  let data = null;
  if (!boundingBox.isEmpty()) {
    const context = canvas.getContext("2d");
    if (context === null)
      throw new TypeError("Failed to get canvas 2D context");
    data = context.getImageData(
      boundingBox.left,
      boundingBox.top,
      width,
      height
    );
  }
  return { width, height, data };
}
exports.trimCanvas = trimCanvas;
//# sourceMappingURL=trimCanvas.js.map
