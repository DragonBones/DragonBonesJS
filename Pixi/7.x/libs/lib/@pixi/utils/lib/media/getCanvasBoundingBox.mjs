import { BoundingBox } from "./BoundingBox.mjs";
function checkRow(data, width, y) {
  for (let x = 0, index = 4 * y * width; x < width; ++x, index += 4)
    if (data[index + 3] !== 0)
      return !1;
  return !0;
}
function checkColumn(data, width, x, top, bottom) {
  const stride = 4 * width;
  for (let y = top, index = top * stride + 4 * x; y <= bottom; ++y, index += stride)
    if (data[index + 3] !== 0)
      return !1;
  return !0;
}
function getCanvasBoundingBox(canvas) {
  const { width, height } = canvas, context = canvas.getContext("2d", {
    willReadFrequently: !0
  });
  if (context === null)
    throw new TypeError("Failed to get canvas 2D context");
  const data = context.getImageData(0, 0, width, height).data;
  let left = 0, top = 0, right = width - 1, bottom = height - 1;
  for (; top < height && checkRow(data, width, top); )
    ++top;
  if (top === height)
    return BoundingBox.EMPTY;
  for (; checkRow(data, width, bottom); )
    --bottom;
  for (; checkColumn(data, width, left, top, bottom); )
    ++left;
  for (; checkColumn(data, width, right, top, bottom); )
    --right;
  return ++right, ++bottom, new BoundingBox(left, top, right, bottom);
}
export {
  getCanvasBoundingBox
};
//# sourceMappingURL=getCanvasBoundingBox.mjs.map
