const inWorker = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function testVideoFormat(mimeType) {
  return inWorker ? !1 : document.createElement("video").canPlayType(mimeType) !== "";
}
export {
  testVideoFormat
};
//# sourceMappingURL=testVideoFormat.mjs.map
