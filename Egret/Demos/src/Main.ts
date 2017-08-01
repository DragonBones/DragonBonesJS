class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        // this.addChild(new HelloDragonBones());
        // this.addChild(new ReplaceSlotDisplay());
        this.addChild(new coreElement.Game());

        // this.addChild(new PerformanceTest());
        // this.addChild(new AnimationBaseTest());
    }
}

abstract class BaseTest extends egret.DisplayObjectContainer {
    private _loadCount: number;
    protected readonly _resources: string[] = [];
    protected readonly _resourceMap: any = {};

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
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