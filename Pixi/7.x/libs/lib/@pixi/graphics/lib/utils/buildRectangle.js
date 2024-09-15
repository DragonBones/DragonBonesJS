"use strict";
const buildRectangle = {
  build(graphicsData) {
    const rectData = graphicsData.shape, x = rectData.x, y = rectData.y, width = rectData.width, height = rectData.height, points = graphicsData.points;
    points.length = 0, width >= 0 && height >= 0 && points.push(
      x,
      y,
      x + width,
      y,
      x + width,
      y + height,
      x,
      y + height
    );
  },
  triangulate(graphicsData, graphicsGeometry) {
    const points = graphicsData.points, verts = graphicsGeometry.points;
    if (points.length === 0)
      return;
    const vertPos = verts.length / 2;
    verts.push(
      points[0],
      points[1],
      points[2],
      points[3],
      points[6],
      points[7],
      points[4],
      points[5]
    ), graphicsGeometry.indices.push(
      vertPos,
      vertPos + 1,
      vertPos + 2,
      vertPos + 1,
      vertPos + 2,
      vertPos + 3
    );
  }
};
exports.buildRectangle = buildRectangle;
//# sourceMappingURL=buildRectangle.js.map
