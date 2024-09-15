"use strict";
var deprecation = require("../logging/deprecation.js");
function skipHello() {
  deprecation.deprecation("7.0.0", "skipHello is deprecated, please use settings.RENDER_OPTIONS.hello");
}
function sayHello() {
  deprecation.deprecation("7.0.0", `sayHello is deprecated, please use Renderer's "hello" option`);
}
exports.sayHello = sayHello;
exports.skipHello = skipHello;
//# sourceMappingURL=hello.js.map
