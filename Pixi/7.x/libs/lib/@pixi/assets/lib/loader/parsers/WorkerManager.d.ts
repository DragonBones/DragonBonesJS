declare class WorkerManagerClass {
    worker: Worker;
    private resolveHash;
    private readonly workerPool;
    private readonly queue;
    private _initialized;
    private _createdWorkers;
    private _isImageBitmapSupported?;
    constructor();
    isImageBitmapSupported(): Promise<boolean>;
    loadImageBitmap(src: string): Promise<ImageBitmap>;
    private _initWorkers;
    private getWorker;
    private returnWorker;
    private complete;
    private _run;
    private next;
}
declare const WorkerManager: WorkerManagerClass;
export { WorkerManager, };
