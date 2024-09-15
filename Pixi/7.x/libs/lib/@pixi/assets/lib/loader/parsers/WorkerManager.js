"use strict";
var checkImageBitmap_worker = require("../../_virtual/checkImageBitmap.worker.js"), loadImageBitmap_worker = require("../../_virtual/loadImageBitmap.worker.js");
let UUID = 0, MAX_WORKERS;
class WorkerManagerClass {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this.workerPool = [], this.queue = [], this.resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((resolve) => {
      const { worker } = new checkImageBitmap_worker.default();
      worker.addEventListener("message", (event) => {
        worker.terminate(), checkImageBitmap_worker.default.revokeObjectURL(), resolve(event.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(src) {
    return this._run("loadImageBitmap", [src]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  getWorker() {
    MAX_WORKERS === void 0 && (MAX_WORKERS = navigator.hardwareConcurrency || 4);
    let worker = this.workerPool.pop();
    return !worker && this._createdWorkers < MAX_WORKERS && (this._createdWorkers++, worker = new loadImageBitmap_worker.default().worker, worker.addEventListener("message", (event) => {
      this.complete(event.data), this.returnWorker(event.target), this.next();
    })), worker;
  }
  returnWorker(worker) {
    this.workerPool.push(worker);
  }
  complete(data) {
    data.error !== void 0 ? this.resolveHash[data.uuid].reject(data.error) : this.resolveHash[data.uuid].resolve(data.data), this.resolveHash[data.uuid] = null;
  }
  async _run(id, args) {
    await this._initWorkers();
    const promise = new Promise((resolve, reject) => {
      this.queue.push({ id, arguments: args, resolve, reject });
    });
    return this.next(), promise;
  }
  next() {
    if (!this.queue.length)
      return;
    const worker = this.getWorker();
    if (!worker)
      return;
    const toDo = this.queue.pop(), id = toDo.id;
    this.resolveHash[UUID] = { resolve: toDo.resolve, reject: toDo.reject }, worker.postMessage({
      data: toDo.arguments,
      uuid: UUID++,
      id
    });
  }
}
const WorkerManager = new WorkerManagerClass();
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=WorkerManager.js.map
