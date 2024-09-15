import { getCanvasBoundingBox } from "./getCanvasBoundingBox.mjs";
function trimCanvas(canvas) {
  const boundingBox = getCanvasBoundingBox(canvas), { width, height } = boundingBox;
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
export {
  trimCanvas
};
//# sourceMappingURL=trimCanvas.mjs.map
