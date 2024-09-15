"use strict";
var core = require("@pixi/core"), buildCircle = require("./buildCircle.js"), buildPoly = require("./buildPoly.js"), buildRectangle = require("./buildRectangle.js"), buildRoundedRectangle = require("./buildRoundedRectangle.js"), ArcUtils = require("./ArcUtils.js"), BatchPart = require("./BatchPart.js"), BezierUtils = require("./BezierUtils.js"), buildLine = require("./buildLine.js"), QuadraticUtils = require("./QuadraticUtils.js");
const FILL_COMMANDS = {
  [core.SHAPES.POLY]: buildPoly.buildPoly,
  [core.SHAPES.CIRC]: buildCircle.buildCircle,
  [core.SHAPES.ELIP]: buildCircle.buildCircle,
  [core.SHAPES.RECT]: buildRectangle.buildRectangle,
  [core.SHAPES.RREC]: buildRoundedRectangle.buildRoundedRectangle
}, BATCH_POOL = [], DRAW_CALL_POOL = [];
exports.buildCircle = buildCircle.buildCircle;
exports.buildPoly = buildPoly.buildPoly;
exports.buildRectangle = buildRectangle.buildRectangle;
exports.buildRoundedRectangle = buildRoundedRectangle.buildRoundedRectangle;
exports.ArcUtils = ArcUtils.ArcUtils;
exports.BatchPart = BatchPart.BatchPart;
exports.BezierUtils = BezierUtils.BezierUtils;
exports.buildLine = buildLine.buildLine;
exports.QuadraticUtils = QuadraticUtils.QuadraticUtils;
exports.BATCH_POOL = BATCH_POOL;
exports.DRAW_CALL_POOL = DRAW_CALL_POOL;
exports.FILL_COMMANDS = FILL_COMMANDS;
//# sourceMappingURL=index.js.map
