import { SHAPES } from "@pixi/core";
import { buildCircle } from "./buildCircle.mjs";
import { buildPoly } from "./buildPoly.mjs";
import { buildRectangle } from "./buildRectangle.mjs";
import { buildRoundedRectangle } from "./buildRoundedRectangle.mjs";
import { ArcUtils } from "./ArcUtils.mjs";
import { BatchPart } from "./BatchPart.mjs";
import { BezierUtils } from "./BezierUtils.mjs";
import { buildLine } from "./buildLine.mjs";
import { QuadraticUtils } from "./QuadraticUtils.mjs";
const FILL_COMMANDS = {
  [SHAPES.POLY]: buildPoly,
  [SHAPES.CIRC]: buildCircle,
  [SHAPES.ELIP]: buildCircle,
  [SHAPES.RECT]: buildRectangle,
  [SHAPES.RREC]: buildRoundedRectangle
}, BATCH_POOL = [], DRAW_CALL_POOL = [];
export {
  ArcUtils,
  BATCH_POOL,
  BatchPart,
  BezierUtils,
  DRAW_CALL_POOL,
  FILL_COMMANDS,
  QuadraticUtils,
  buildCircle,
  buildLine,
  buildPoly,
  buildRectangle,
  buildRoundedRectangle
};
//# sourceMappingURL=index.mjs.map
