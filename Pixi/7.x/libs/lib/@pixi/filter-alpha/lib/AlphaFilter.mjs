import { Filter, defaultVertex } from "@pixi/core";
import fragment from "./alpha.frag.mjs";
class AlphaFilter extends Filter {
  /**
   * @param alpha - Amount of alpha from 0 to 1, where 0 is transparent
   */
  constructor(alpha = 1) {
    super(defaultVertex, fragment, { uAlpha: 1 }), this.alpha = alpha;
  }
  /**
   * Coefficient for alpha multiplication
   * @default 1
   */
  get alpha() {
    return this.uniforms.uAlpha;
  }
  set alpha(value) {
    this.uniforms.uAlpha = value;
  }
}
export {
  AlphaFilter
};
//# sourceMappingURL=AlphaFilter.mjs.map
