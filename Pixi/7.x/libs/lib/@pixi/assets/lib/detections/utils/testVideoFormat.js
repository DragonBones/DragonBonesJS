"use strict";
const inWorker = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function testVideoFormat(mimeType) {
  return inWorker ? !1 : document.createElement("video").canPlayType(mimeType) !== "";
}
exports.testVideoFormat = testVideoFormat;
//# sourceMappingURL=testVideoFormat.js.map
