"use strict";
const warnings = {};
function deprecation(version, message, ignoreDepth = 3) {
  if (warnings[message])
    return;
  let stack = new Error().stack;
  typeof stack > "u" ? console.warn("PixiJS Deprecation Warning: ", `${message}
Deprecated since v${version}`) : (stack = stack.split(`
`).splice(ignoreDepth).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${message}
Deprecated since v${version}`
  ), console.warn(stack), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${message}
Deprecated since v${version}`), console.warn(stack))), warnings[message] = !0;
}
exports.deprecation = deprecation;
//# sourceMappingURL=deprecation.js.map
