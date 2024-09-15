"use strict";
var core = require("@pixi/core"), _const = require("../const.js");
function square(x, y, nx, ny, innerWeight, outerWeight, clockwise, verts) {
  const ix = x - nx * innerWeight, iy = y - ny * innerWeight, ox = x + nx * outerWeight, oy = y + ny * outerWeight;
  let exx, eyy;
  clockwise ? (exx = ny, eyy = -nx) : (exx = -ny, eyy = nx);
  const eix = ix + exx, eiy = iy + eyy, eox = ox + exx, eoy = oy + eyy;
  return verts.push(
    eix,
    eiy,
    eox,
    eoy
  ), 2;
}
function round(cx, cy, sx, sy, ex, ey, verts, clockwise) {
  const cx2p0x = sx - cx, cy2p0y = sy - cy;
  let angle0 = Math.atan2(cx2p0x, cy2p0y), angle1 = Math.atan2(ex - cx, ey - cy);
  clockwise && angle0 < angle1 ? angle0 += Math.PI * 2 : !clockwise && angle0 > angle1 && (angle1 += Math.PI * 2);
  let startAngle = angle0;
  const angleDiff = angle1 - angle0, absAngleDiff = Math.abs(angleDiff), radius = Math.sqrt(cx2p0x * cx2p0x + cy2p0y * cy2p0y), segCount = (15 * absAngleDiff * Math.sqrt(radius) / Math.PI >> 0) + 1, angleInc = angleDiff / segCount;
  if (startAngle += angleInc, clockwise) {
    verts.push(
      cx,
      cy,
      sx,
      sy
    );
    for (let i = 1, angle = startAngle; i < segCount; i++, angle += angleInc)
      verts.push(
        cx,
        cy,
        cx + Math.sin(angle) * radius,
        cy + Math.cos(angle) * radius
      );
    verts.push(
      cx,
      cy,
      ex,
      ey
    );
  } else {
    verts.push(
      sx,
      sy,
      cx,
      cy
    );
    for (let i = 1, angle = startAngle; i < segCount; i++, angle += angleInc)
      verts.push(
        cx + Math.sin(angle) * radius,
        cy + Math.cos(angle) * radius,
        cx,
        cy
      );
    verts.push(
      ex,
      ey,
      cx,
      cy
    );
  }
  return segCount * 2;
}
function buildNonNativeLine(graphicsData, graphicsGeometry) {
  const shape = graphicsData.shape;
  let points = graphicsData.points || shape.points.slice();
  const eps = graphicsGeometry.closePointEps;
  if (points.length === 0)
    return;
  const style = graphicsData.lineStyle, firstPoint = new core.Point(points[0], points[1]), lastPoint = new core.Point(points[points.length - 2], points[points.length - 1]), closedShape = shape.type !== core.SHAPES.POLY || shape.closeStroke, closedPath = Math.abs(firstPoint.x - lastPoint.x) < eps && Math.abs(firstPoint.y - lastPoint.y) < eps;
  if (closedShape) {
    points = points.slice(), closedPath && (points.pop(), points.pop(), lastPoint.set(points[points.length - 2], points[points.length - 1]));
    const midPointX = (firstPoint.x + lastPoint.x) * 0.5, midPointY = (lastPoint.y + firstPoint.y) * 0.5;
    points.unshift(midPointX, midPointY), points.push(midPointX, midPointY);
  }
  const verts = graphicsGeometry.points, length = points.length / 2;
  let indexCount = points.length;
  const indexStart = verts.length / 2, width = style.width / 2, widthSquared = width * width, miterLimitSquared = style.miterLimit * style.miterLimit;
  let x0 = points[0], y0 = points[1], x1 = points[2], y1 = points[3], x2 = 0, y2 = 0, perpx = -(y0 - y1), perpy = x0 - x1, perp1x = 0, perp1y = 0, dist = Math.sqrt(perpx * perpx + perpy * perpy);
  perpx /= dist, perpy /= dist, perpx *= width, perpy *= width;
  const ratio = style.alignment, innerWeight = (1 - ratio) * 2, outerWeight = ratio * 2;
  closedShape || (style.cap === _const.LINE_CAP.ROUND ? indexCount += round(
    x0 - perpx * (innerWeight - outerWeight) * 0.5,
    y0 - perpy * (innerWeight - outerWeight) * 0.5,
    x0 - perpx * innerWeight,
    y0 - perpy * innerWeight,
    x0 + perpx * outerWeight,
    y0 + perpy * outerWeight,
    verts,
    !0
  ) + 2 : style.cap === _const.LINE_CAP.SQUARE && (indexCount += square(x0, y0, perpx, perpy, innerWeight, outerWeight, !0, verts))), verts.push(
    x0 - perpx * innerWeight,
    y0 - perpy * innerWeight,
    x0 + perpx * outerWeight,
    y0 + perpy * outerWeight
  );
  for (let i = 1; i < length - 1; ++i) {
    x0 = points[(i - 1) * 2], y0 = points[(i - 1) * 2 + 1], x1 = points[i * 2], y1 = points[i * 2 + 1], x2 = points[(i + 1) * 2], y2 = points[(i + 1) * 2 + 1], perpx = -(y0 - y1), perpy = x0 - x1, dist = Math.sqrt(perpx * perpx + perpy * perpy), perpx /= dist, perpy /= dist, perpx *= width, perpy *= width, perp1x = -(y1 - y2), perp1y = x1 - x2, dist = Math.sqrt(perp1x * perp1x + perp1y * perp1y), perp1x /= dist, perp1y /= dist, perp1x *= width, perp1y *= width;
    const dx0 = x1 - x0, dy0 = y0 - y1, dx1 = x1 - x2, dy1 = y2 - y1, dot = dx0 * dx1 + dy0 * dy1, cross = dy0 * dx1 - dy1 * dx0, clockwise = cross < 0;
    if (Math.abs(cross) < 1e-3 * Math.abs(dot)) {
      verts.push(
        x1 - perpx * innerWeight,
        y1 - perpy * innerWeight,
        x1 + perpx * outerWeight,
        y1 + perpy * outerWeight
      ), dot >= 0 && (style.join === _const.LINE_JOIN.ROUND ? indexCount += round(
        x1,
        y1,
        x1 - perpx * innerWeight,
        y1 - perpy * innerWeight,
        x1 - perp1x * innerWeight,
        y1 - perp1y * innerWeight,
        verts,
        !1
      ) + 4 : indexCount += 2, verts.push(
        x1 - perp1x * outerWeight,
        y1 - perp1y * outerWeight,
        x1 + perp1x * innerWeight,
        y1 + perp1y * innerWeight
      ));
      continue;
    }
    const c1 = (-perpx + x0) * (-perpy + y1) - (-perpx + x1) * (-perpy + y0), c2 = (-perp1x + x2) * (-perp1y + y1) - (-perp1x + x1) * (-perp1y + y2), px = (dx0 * c2 - dx1 * c1) / cross, py = (dy1 * c1 - dy0 * c2) / cross, pdist = (px - x1) * (px - x1) + (py - y1) * (py - y1), imx = x1 + (px - x1) * innerWeight, imy = y1 + (py - y1) * innerWeight, omx = x1 - (px - x1) * outerWeight, omy = y1 - (py - y1) * outerWeight, smallerInsideSegmentSq = Math.min(dx0 * dx0 + dy0 * dy0, dx1 * dx1 + dy1 * dy1), insideWeight = clockwise ? innerWeight : outerWeight, smallerInsideDiagonalSq = smallerInsideSegmentSq + insideWeight * insideWeight * widthSquared, insideMiterOk = pdist <= smallerInsideDiagonalSq;
    let join = style.join;
    if (join === _const.LINE_JOIN.MITER && pdist / widthSquared > miterLimitSquared && (join = _const.LINE_JOIN.BEVEL), insideMiterOk)
      switch (join) {
        case _const.LINE_JOIN.MITER: {
          verts.push(
            imx,
            imy,
            omx,
            omy
          );
          break;
        }
        case _const.LINE_JOIN.BEVEL: {
          clockwise ? verts.push(
            imx,
            imy,
            // inner miter point
            x1 + perpx * outerWeight,
            y1 + perpy * outerWeight,
            // first segment's outer vertex
            imx,
            imy,
            // inner miter point
            x1 + perp1x * outerWeight,
            y1 + perp1y * outerWeight
          ) : verts.push(
            x1 - perpx * innerWeight,
            y1 - perpy * innerWeight,
            // first segment's inner vertex
            omx,
            omy,
            // outer miter point
            x1 - perp1x * innerWeight,
            y1 - perp1y * innerWeight,
            // second segment's outer vertex
            omx,
            omy
          ), indexCount += 2;
          break;
        }
        case _const.LINE_JOIN.ROUND: {
          clockwise ? (verts.push(
            imx,
            imy,
            x1 + perpx * outerWeight,
            y1 + perpy * outerWeight
          ), indexCount += round(
            x1,
            y1,
            x1 + perpx * outerWeight,
            y1 + perpy * outerWeight,
            x1 + perp1x * outerWeight,
            y1 + perp1y * outerWeight,
            verts,
            !0
          ) + 4, verts.push(
            imx,
            imy,
            x1 + perp1x * outerWeight,
            y1 + perp1y * outerWeight
          )) : (verts.push(
            x1 - perpx * innerWeight,
            y1 - perpy * innerWeight,
            omx,
            omy
          ), indexCount += round(
            x1,
            y1,
            x1 - perpx * innerWeight,
            y1 - perpy * innerWeight,
            x1 - perp1x * innerWeight,
            y1 - perp1y * innerWeight,
            verts,
            !1
          ) + 4, verts.push(
            x1 - perp1x * innerWeight,
            y1 - perp1y * innerWeight,
            omx,
            omy
          ));
          break;
        }
      }
    else {
      switch (verts.push(
        x1 - perpx * innerWeight,
        y1 - perpy * innerWeight,
        // first segment's inner vertex
        x1 + perpx * outerWeight,
        y1 + perpy * outerWeight
      ), join) {
        case _const.LINE_JOIN.MITER: {
          clockwise ? verts.push(
            omx,
            omy,
            // inner miter point
            omx,
            omy
          ) : verts.push(
            imx,
            imy,
            // outer miter point
            imx,
            imy
          ), indexCount += 2;
          break;
        }
        case _const.LINE_JOIN.ROUND: {
          clockwise ? indexCount += round(
            x1,
            y1,
            x1 + perpx * outerWeight,
            y1 + perpy * outerWeight,
            x1 + perp1x * outerWeight,
            y1 + perp1y * outerWeight,
            verts,
            !0
          ) + 2 : indexCount += round(
            x1,
            y1,
            x1 - perpx * innerWeight,
            y1 - perpy * innerWeight,
            x1 - perp1x * innerWeight,
            y1 - perp1y * innerWeight,
            verts,
            !1
          ) + 2;
          break;
        }
      }
      verts.push(
        x1 - perp1x * innerWeight,
        y1 - perp1y * innerWeight,
        // second segment's inner vertex
        x1 + perp1x * outerWeight,
        y1 + perp1y * outerWeight
      ), indexCount += 2;
    }
  }
  x0 = points[(length - 2) * 2], y0 = points[(length - 2) * 2 + 1], x1 = points[(length - 1) * 2], y1 = points[(length - 1) * 2 + 1], perpx = -(y0 - y1), perpy = x0 - x1, dist = Math.sqrt(perpx * perpx + perpy * perpy), perpx /= dist, perpy /= dist, perpx *= width, perpy *= width, verts.push(
    x1 - perpx * innerWeight,
    y1 - perpy * innerWeight,
    x1 + perpx * outerWeight,
    y1 + perpy * outerWeight
  ), closedShape || (style.cap === _const.LINE_CAP.ROUND ? indexCount += round(
    x1 - perpx * (innerWeight - outerWeight) * 0.5,
    y1 - perpy * (innerWeight - outerWeight) * 0.5,
    x1 - perpx * innerWeight,
    y1 - perpy * innerWeight,
    x1 + perpx * outerWeight,
    y1 + perpy * outerWeight,
    verts,
    !1
  ) + 2 : style.cap === _const.LINE_CAP.SQUARE && (indexCount += square(x1, y1, perpx, perpy, innerWeight, outerWeight, !1, verts)));
  const indices = graphicsGeometry.indices, eps2 = _const.curves.epsilon * _const.curves.epsilon;
  for (let i = indexStart; i < indexCount + indexStart - 2; ++i)
    x0 = verts[i * 2], y0 = verts[i * 2 + 1], x1 = verts[(i + 1) * 2], y1 = verts[(i + 1) * 2 + 1], x2 = verts[(i + 2) * 2], y2 = verts[(i + 2) * 2 + 1], !(Math.abs(x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1)) < eps2) && indices.push(i, i + 1, i + 2);
}
function buildNativeLine(graphicsData, graphicsGeometry) {
  let i = 0;
  const shape = graphicsData.shape, points = graphicsData.points || shape.points, closedShape = shape.type !== core.SHAPES.POLY || shape.closeStroke;
  if (points.length === 0)
    return;
  const verts = graphicsGeometry.points, indices = graphicsGeometry.indices, length = points.length / 2, startIndex = verts.length / 2;
  let currentIndex = startIndex;
  for (verts.push(points[0], points[1]), i = 1; i < length; i++)
    verts.push(points[i * 2], points[i * 2 + 1]), indices.push(currentIndex, currentIndex + 1), currentIndex++;
  closedShape && indices.push(currentIndex, startIndex);
}
function buildLine(graphicsData, graphicsGeometry) {
  graphicsData.lineStyle.native ? buildNativeLine(graphicsData, graphicsGeometry) : buildNonNativeLine(graphicsData, graphicsGeometry);
}
exports.buildLine = buildLine;
//# sourceMappingURL=buildLine.js.map
