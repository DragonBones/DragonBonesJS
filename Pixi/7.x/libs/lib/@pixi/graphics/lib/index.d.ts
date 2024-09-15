/// <reference path="../global.d.ts" />
import { ArcUtils, BatchPart, BezierUtils, buildLine, QuadraticUtils } from './utils';
import type { BatchDrawCall, SHAPES } from '@pixi/core';
import type { IShapeBuildCommand } from './utils/IShapeBuildCommand';
export * from './const';
export * from './Graphics';
export * from './GraphicsData';
export * from './GraphicsGeometry';
export * from './styles/FillStyle';
export * from './styles/LineStyle';
export declare const graphicsUtils: {
    buildPoly: IShapeBuildCommand;
    buildCircle: IShapeBuildCommand;
    buildRectangle: IShapeBuildCommand;
    buildRoundedRectangle: IShapeBuildCommand;
    buildLine: typeof buildLine;
    ArcUtils: typeof ArcUtils;
    BezierUtils: typeof BezierUtils;
    QuadraticUtils: typeof QuadraticUtils;
    BatchPart: typeof BatchPart;
    FILL_COMMANDS: Record<SHAPES, IShapeBuildCommand>;
    BATCH_POOL: BatchPart[];
    DRAW_CALL_POOL: BatchDrawCall[];
};
