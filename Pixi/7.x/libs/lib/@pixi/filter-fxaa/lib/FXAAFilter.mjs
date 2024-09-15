import { Filter } from "@pixi/core";
import fragment from "./fxaa.frag.mjs";
import vertex from "./fxaa.vert.mjs";
class FXAAFilter extends Filter {
  constructor() {
    super(vertex, fragment);
  }
}
export {
  FXAAFilter
};
//# sourceMappingURL=FXAAFilter.mjs.map
