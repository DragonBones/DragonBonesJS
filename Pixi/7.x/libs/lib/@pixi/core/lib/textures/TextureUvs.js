"use strict";
var math = require("@pixi/math");
class TextureUvs {
  constructor() {
    this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
  }
  /**
   * Sets the texture Uvs based on the given frame information.
   * @protected
   * @param frame - The frame of the texture
   * @param baseFrame - The base frame of the texture
   * @param rotate - Rotation of frame, see {@link PIXI.groupD8}
   */
  set(frame, baseFrame, rotate) {
    const tw = baseFrame.width, th = baseFrame.height;
    if (rotate) {
      const w2 = frame.width / 2 / tw, h2 = frame.height / 2 / th, cX = frame.x / tw + w2, cY = frame.y / th + h2;
      rotate = math.groupD8.add(rotate, math.groupD8.NW), this.x0 = cX + w2 * math.groupD8.uX(rotate), this.y0 = cY + h2 * math.groupD8.uY(rotate), rotate = math.groupD8.add(rotate, 2), this.x1 = cX + w2 * math.groupD8.uX(rotate), this.y1 = cY + h2 * math.groupD8.uY(rotate), rotate = math.groupD8.add(rotate, 2), this.x2 = cX + w2 * math.groupD8.uX(rotate), this.y2 = cY + h2 * math.groupD8.uY(rotate), rotate = math.groupD8.add(rotate, 2), this.x3 = cX + w2 * math.groupD8.uX(rotate), this.y3 = cY + h2 * math.groupD8.uY(rotate);
    } else
      this.x0 = frame.x / tw, this.y0 = frame.y / th, this.x1 = (frame.x + frame.width) / tw, this.y1 = frame.y / th, this.x2 = (frame.x + frame.width) / tw, this.y2 = (frame.y + frame.height) / th, this.x3 = frame.x / tw, this.y3 = (frame.y + frame.height) / th;
    this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
  }
}
TextureUvs.prototype.toString = function() {
  return `[@pixi/core:TextureUvs x0=${this.x0} y0=${this.y0} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} x3=${this.x3} y3=${this.y3}]`;
};
exports.TextureUvs = TextureUvs;
//# sourceMappingURL=TextureUvs.js.map
