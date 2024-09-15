import type { ICanvas, ICanvasRenderingContext2D } from '@pixi/core';
import type { TextMetrics, TextStyle } from '@pixi/text';
/**
 * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
 * @private
 * @param canvas
 * @param context
 * @param {object} style - The style.
 * @param resolution
 * @param {string[]} lines - The lines of text.
 * @param metrics
 * @returns {string|number|CanvasGradient} The fill style
 */
export declare function generateFillStyle(canvas: ICanvas, context: ICanvasRenderingContext2D, style: TextStyle, resolution: number, lines: string[], metrics: TextMetrics): string | CanvasGradient | CanvasPattern;
