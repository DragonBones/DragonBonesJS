import { Color } from "@pixi/core";
import { generateFillStyle } from "./generateFillStyle.mjs";
function drawGlyph(canvas, context, metrics, x, y, resolution, style) {
  const char = metrics.text, fontProperties = metrics.fontProperties;
  context.translate(x, y), context.scale(resolution, resolution);
  const tx = style.strokeThickness / 2, ty = -(style.strokeThickness / 2);
  if (context.font = style.toFontString(), context.lineWidth = style.strokeThickness, context.textBaseline = style.textBaseline, context.lineJoin = style.lineJoin, context.miterLimit = style.miterLimit, context.fillStyle = generateFillStyle(canvas, context, style, resolution, [char], metrics), context.strokeStyle = style.stroke, style.dropShadow) {
    const dropShadowColor = style.dropShadowColor, dropShadowBlur = style.dropShadowBlur * resolution, dropShadowDistance = style.dropShadowDistance * resolution;
    context.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(style.dropShadowAlpha).toRgbaString(), context.shadowBlur = dropShadowBlur, context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance, context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance;
  } else
    context.shadowColor = "black", context.shadowBlur = 0, context.shadowOffsetX = 0, context.shadowOffsetY = 0;
  style.stroke && style.strokeThickness && context.strokeText(char, tx, ty + metrics.lineHeight - fontProperties.descent), style.fill && context.fillText(char, tx, ty + metrics.lineHeight - fontProperties.descent), context.setTransform(1, 0, 0, 1, 0, 0), context.fillStyle = "rgba(0, 0, 0, 0)";
}
export {
  drawGlyph
};
//# sourceMappingURL=drawGlyph.mjs.map
