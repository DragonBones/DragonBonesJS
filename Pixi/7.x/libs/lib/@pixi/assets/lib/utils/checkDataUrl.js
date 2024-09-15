"use strict";
function checkDataUrl(url, mimes) {
  if (Array.isArray(mimes)) {
    for (const mime of mimes)
      if (url.startsWith(`data:${mime}`))
        return !0;
    return !1;
  }
  return url.startsWith(`data:${mimes}`);
}
exports.checkDataUrl = checkDataUrl;
//# sourceMappingURL=checkDataUrl.js.map
