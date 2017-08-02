abstract class BaseTest extends egret.DisplayObjectContainer {
    private _loadCount: number;
    protected readonly _background: egret.Shape = new egret.Shape();
    protected readonly _resources: string[] = [];
    protected readonly _resourceMap: any = {};

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
            this._background.graphics.beginFill(0x666666, 1.0);
            this._background.graphics.drawRect(0.0, 0.0, this.stage.stageWidth, this.stage.stageHeight);
            this.addChild(this._background);

            this._loadResources();
        }, this);
    }

    protected abstract _onStart(): void;

    protected _loadResources(): void {
        this._loadCount = this._resources.length;
        for (const resource of this._resources) {
            RES.getResByUrl(
                resource,
                (data: any, key: string) => {
                    this._resourceMap[key] = data;

                    this._loadCount--;
                    if (this._loadCount === 0) {
                        RES.getRes = (name: string) => { // Modify res bug.
                            return this._resourceMap[name];
                        };
                        this._onStart();
                    }
                },
                this, resource.indexOf(".dbbin") > 0 ? RES.ResourceItem.TYPE_BIN : null
            );
        }
    }
}