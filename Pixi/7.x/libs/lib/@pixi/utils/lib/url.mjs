import { parse, format, resolve } from "url";
import { deprecation } from "./logging/deprecation.mjs";
const url = {
  /**
   * @deprecated since 7.3.0
   */
  get parse() {
    return deprecation("7.3.0", "utils.url.parse is deprecated, use native URL API instead."), parse;
  },
  /**
   * @deprecated since 7.3.0
   */
  get format() {
    return deprecation("7.3.0", "utils.url.format is deprecated, use native URL API instead."), format;
  },
  /**
   * @deprecated since 7.3.0
   */
  get resolve() {
    return deprecation("7.3.0", "utils.url.resolve is deprecated, use native URL API instead."), resolve;
  }
};
export {
  url
};
//# sourceMappingURL=url.mjs.map
