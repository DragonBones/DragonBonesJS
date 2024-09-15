"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const WORKER_CODE = `(function() {
  "use strict";
  const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
  async function checkImageBitmap() {
    try {
      if (typeof createImageBitmap != "function")
        return !1;
      const imageBlob = await (await fetch(WHITE_PNG)).blob(), imageBitmap = await createImageBitmap(imageBlob);
      return imageBitmap.width === 1 && imageBitmap.height === 1;
    } catch {
      return !1;
    }
  }
  checkImageBitmap().then((result) => {
    self.postMessage(result);
  });
})();
`;
let WORKER_URL = null;
class WorkerInstance {
  constructor() {
    WORKER_URL || (WORKER_URL = URL.createObjectURL(new Blob([WORKER_CODE], { type: "application/javascript" }))), this.worker = new Worker(WORKER_URL);
  }
}
WorkerInstance.revokeObjectURL = function() {
  WORKER_URL && (URL.revokeObjectURL(WORKER_URL), WORKER_URL = null);
};
exports.default = WorkerInstance;
//# sourceMappingURL=checkImageBitmap.worker.js.map
