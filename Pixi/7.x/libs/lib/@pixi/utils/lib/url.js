"use strict";
var url$1 = require("url"), deprecation = require("./logging/deprecation.js");
const url = {
  /**
   * @deprecated since 7.3.0
   */
  get parse() {
    return deprecation.deprecation("7.3.0", "utils.url.parse is deprecated, use native URL API instead."), url$1.parse;
  },
  /**
   * @deprecated since 7.3.0
   */
  get format() {
    return deprecation.deprecation("7.3.0", "utils.url.format is deprecated, use native URL API instead."), url$1.format;
  },
  /**
   * @deprecated since 7.3.0
   */
  get resolve() {
    return deprecation.deprecation("7.3.0", "utils.url.resolve is deprecated, use native URL API instead."), url$1.resolve;
  }
};
exports.url = url;
//# sourceMappingURL=url.js.map
