import type { ICanvas, ICanvasRenderingContext2D } from '@pixi/core';
import type { TextMetrics, TextStyle } from '@pixi/text';
/**
 * Draws the glyph `metrics.text` on the given canvas.
 *
 * Ignored because not directly exposed.
 * @ignore
 * @param {PIXI.ICanvas} canvas
 * @param {PIXI.ICanvasRenderingContext2D} context
 * @param {TextMetrics} metrics
 * @param {number} x
 * @param {number} y
 * @param {number} resolution
 * @param {TextStyle} style
 */
export declare function drawGlyph(canvas: ICanvas, context: ICanvasRenderingContext2D, metrics: TextMetrics, x: number, y: number, resolution: number, style: TextStyle): void;
