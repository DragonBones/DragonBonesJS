import { Texture } from "@pixi/core";
class FillStyle {
  constructor() {
    this.color = 16777215, this.alpha = 1, this.texture = Texture.WHITE, this.matrix = null, this.visible = !1, this.reset();
  }
  /** Clones the object */
  clone() {
    const obj = new FillStyle();
    return obj.color = this.color, obj.alpha = this.alpha, obj.texture = this.texture, obj.matrix = this.matrix, obj.visible = this.visible, obj;
  }
  /** Reset */
  reset() {
    this.color = 16777215, this.alpha = 1, this.texture = Texture.WHITE, this.matrix = null, this.visible = !1;
  }
  /** Destroy and don't use after this. */
  destroy() {
    this.texture = null, this.matrix = null;
  }
}
export {
  FillStyle
};
//# sourceMappingURL=FillStyle.mjs.map
