import { buildCircle } from "./buildCircle.mjs";
const buildRoundedRectangle = {
  build(graphicsData) {
    buildCircle.build(graphicsData);
  },
  triangulate(graphicsData, graphicsGeometry) {
    buildCircle.triangulate(graphicsData, graphicsGeometry);
  }
};
export {
  buildRoundedRectangle
};
//# sourceMappingURL=buildRoundedRectangle.mjs.map
