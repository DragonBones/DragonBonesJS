"use strict";
var text = require("@pixi/text");
function generateFillStyle(canvas, context, style, resolution, lines, metrics) {
  const fillStyle = style.fill;
  if (Array.isArray(fillStyle)) {
    if (fillStyle.length === 1)
      return fillStyle[0];
  } else
    return fillStyle;
  let gradient;
  const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0, padding = style.padding || 0, width = canvas.width / resolution - dropShadowCorrection - padding * 2, height = canvas.height / resolution - dropShadowCorrection - padding * 2, fill = fillStyle.slice(), fillGradientStops = style.fillGradientStops.slice();
  if (!fillGradientStops.length) {
    const lengthPlus1 = fill.length + 1;
    for (let i = 1; i < lengthPlus1; ++i)
      fillGradientStops.push(i / lengthPlus1);
  }
  if (fill.unshift(fillStyle[0]), fillGradientStops.unshift(0), fill.push(fillStyle[fillStyle.length - 1]), fillGradientStops.push(1), style.fillGradientType === text.TEXT_GRADIENT.LINEAR_VERTICAL) {
    gradient = context.createLinearGradient(width / 2, padding, width / 2, height + padding);
    let lastIterationStop = 0;
    const gradStopLineHeight = (metrics.fontProperties.fontSize + style.strokeThickness) / height;
    for (let i = 0; i < lines.length; i++) {
      const thisLineTop = metrics.lineHeight * i;
      for (let j = 0; j < fill.length; j++) {
        let lineStop = 0;
        typeof fillGradientStops[j] == "number" ? lineStop = fillGradientStops[j] : lineStop = j / fill.length;
        const globalStop = thisLineTop / height + lineStop * gradStopLineHeight;
        let clampedStop = Math.max(lastIterationStop, globalStop);
        clampedStop = Math.min(clampedStop, 1), gradient.addColorStop(clampedStop, fill[j]), lastIterationStop = clampedStop;
      }
    }
  } else {
    gradient = context.createLinearGradient(padding, height / 2, width + padding, height / 2);
    const totalIterations = fill.length + 1;
    let currentIteration = 1;
    for (let i = 0; i < fill.length; i++) {
      let stop;
      typeof fillGradientStops[i] == "number" ? stop = fillGradientStops[i] : stop = currentIteration / totalIterations, gradient.addColorStop(stop, fill[i]), currentIteration++;
    }
  }
  return gradient;
}
exports.generateFillStyle = generateFillStyle;
//# sourceMappingURL=generateFillStyle.js.map
