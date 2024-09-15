import { SHAPES } from "@pixi/core";
const buildCircle = {
  build(graphicsData) {
    const points = graphicsData.points;
    let x, y, dx, dy, rx, ry;
    if (graphicsData.type === SHAPES.CIRC) {
      const circle = graphicsData.shape;
      x = circle.x, y = circle.y, rx = ry = circle.radius, dx = dy = 0;
    } else if (graphicsData.type === SHAPES.ELIP) {
      const ellipse = graphicsData.shape;
      x = ellipse.x, y = ellipse.y, rx = ellipse.width, ry = ellipse.height, dx = dy = 0;
    } else {
      const roundedRect = graphicsData.shape, halfWidth = roundedRect.width / 2, halfHeight = roundedRect.height / 2;
      x = roundedRect.x + halfWidth, y = roundedRect.y + halfHeight, rx = ry = Math.max(0, Math.min(roundedRect.radius, Math.min(halfWidth, halfHeight))), dx = halfWidth - rx, dy = halfHeight - ry;
    }
    if (!(rx >= 0 && ry >= 0 && dx >= 0 && dy >= 0)) {
      points.length = 0;
      return;
    }
    const n = Math.ceil(2.3 * Math.sqrt(rx + ry)), m = n * 8 + (dx ? 4 : 0) + (dy ? 4 : 0);
    if (points.length = m, m === 0)
      return;
    if (n === 0) {
      points.length = 8, points[0] = points[6] = x + dx, points[1] = points[3] = y + dy, points[2] = points[4] = x - dx, points[5] = points[7] = y - dy;
      return;
    }
    let j1 = 0, j2 = n * 4 + (dx ? 2 : 0) + 2, j3 = j2, j4 = m;
    {
      const x0 = dx + rx, y0 = dy, x1 = x + x0, x2 = x - x0, y1 = y + y0;
      if (points[j1++] = x1, points[j1++] = y1, points[--j2] = y1, points[--j2] = x2, dy) {
        const y2 = y - y0;
        points[j3++] = x2, points[j3++] = y2, points[--j4] = y2, points[--j4] = x1;
      }
    }
    for (let i = 1; i < n; i++) {
      const a = Math.PI / 2 * (i / n), x0 = dx + Math.cos(a) * rx, y0 = dy + Math.sin(a) * ry, x1 = x + x0, x2 = x - x0, y1 = y + y0, y2 = y - y0;
      points[j1++] = x1, points[j1++] = y1, points[--j2] = y1, points[--j2] = x2, points[j3++] = x2, points[j3++] = y2, points[--j4] = y2, points[--j4] = x1;
    }
    {
      const x0 = dx, y0 = dy + ry, x1 = x + x0, x2 = x - x0, y1 = y + y0, y2 = y - y0;
      points[j1++] = x1, points[j1++] = y1, points[--j4] = y2, points[--j4] = x1, dx && (points[j1++] = x2, points[j1++] = y1, points[--j4] = y2, points[--j4] = x2);
    }
  },
  triangulate(graphicsData, graphicsGeometry) {
    const points = graphicsData.points, verts = graphicsGeometry.points, indices = graphicsGeometry.indices;
    if (points.length === 0)
      return;
    let vertPos = verts.length / 2;
    const center = vertPos;
    let x, y;
    if (graphicsData.type !== SHAPES.RREC) {
      const circle = graphicsData.shape;
      x = circle.x, y = circle.y;
    } else {
      const roundedRect = graphicsData.shape;
      x = roundedRect.x + roundedRect.width / 2, y = roundedRect.y + roundedRect.height / 2;
    }
    const matrix = graphicsData.matrix;
    verts.push(
      graphicsData.matrix ? matrix.a * x + matrix.c * y + matrix.tx : x,
      graphicsData.matrix ? matrix.b * x + matrix.d * y + matrix.ty : y
    ), vertPos++, verts.push(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2)
      verts.push(points[i], points[i + 1]), indices.push(vertPos++, center, vertPos);
    indices.push(center + 1, center, vertPos);
  }
};
export {
  buildCircle
};
//# sourceMappingURL=buildCircle.mjs.map
