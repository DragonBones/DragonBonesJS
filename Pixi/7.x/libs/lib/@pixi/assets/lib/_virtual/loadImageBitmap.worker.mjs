const WORKER_CODE = `(function() {
  "use strict";
  async function loadImageBitmap(url) {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \${response.status} \${response.statusText}\`);
    const imageBlob = await response.blob();
    return await createImageBitmap(imageBlob);
  }
  self.onmessage = async (event) => {
    try {
      const imageBitmap = await loadImageBitmap(event.data.data[0]);
      self.postMessage({
        data: imageBitmap,
        uuid: event.data.uuid,
        id: event.data.id
      }, [imageBitmap]);
    } catch (e) {
      self.postMessage({
        error: e,
        uuid: event.data.uuid,
        id: event.data.id
      });
    }
  };
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
export {
  WorkerInstance as default
};
//# sourceMappingURL=loadImageBitmap.worker.mjs.map
