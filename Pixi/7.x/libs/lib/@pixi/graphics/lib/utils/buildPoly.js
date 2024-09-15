"use strict";
var core = require("@pixi/core");
function fixOrientation(points, hole = !1) {
  const m = points.length;
  if (m < 6)
    return;
  let area = 0;
  for (let i = 0, x1 = points[m - 2], y1 = points[m - 1]; i < m; i += 2) {
    const x2 = points[i], y2 = points[i + 1];
    area += (x2 - x1) * (y2 + y1), x1 = x2, y1 = y2;
  }
  if (!hole && area > 0 || hole && area <= 0) {
    const n = m / 2;
    for (let i = n + n % 2; i < m; i += 2) {
      const i1 = m - i - 2, i2 = m - i - 1, i3 = i, i4 = i + 1;
      [points[i1], points[i3]] = [points[i3], points[i1]], [points[i2], points[i4]] = [points[i4], points[i2]];
    }
  }
}
const buildPoly = {
  build(graphicsData) {
    graphicsData.points = graphicsData.shape.points.slice();
  },
  triangulate(graphicsData, graphicsGeometry) {
    let points = graphicsData.points;
    const holes = graphicsData.holes, verts = graphicsGeometry.points, indices = graphicsGeometry.indices;
    if (points.length >= 6) {
      fixOrientation(points, !1);
      const holeArray = [];
      for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];
        fixOrientation(hole.points, !0), holeArray.push(points.length / 2), points = points.concat(hole.points);
      }
      const triangles = core.utils.earcut(points, holeArray, 2);
      if (!triangles)
        return;
      const vertPos = verts.length / 2;
      for (let i = 0; i < triangles.length; i += 3)
        indices.push(triangles[i] + vertPos), indices.push(triangles[i + 1] + vertPos), indices.push(triangles[i + 2] + vertPos);
      for (let i = 0; i < points.length; i++)
        verts.push(points[i]);
    }
  }
};
exports.buildPoly = buildPoly;
//# sourceMappingURL=buildPoly.js.map
