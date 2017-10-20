abstract class BaseTest extends egret.DisplayObjectContainer {
    protected _loadCount: number = 0;
    protected readonly _background: egret.Shape = new egret.Shape();
    protected readonly _resources: string[] = [];
    protected readonly _resourceMap: any = {};

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
            this._background.graphics.beginFill(0x666666);
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

    public createText(string: string): egret.TextField {
        const text = new egret.TextField();
        text.size = 20;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.text = string;
        text.width = this.stageWidth;
        text.x = 0;
        text.y = this.stageHeight - 60;
        this.addChild(text);

        return text;
    }

    public get stageWidth(): number {
        return this.stage.stageWidth;
    }

    public get stageHeight(): number {
        return this.stage.stageHeight;
    }
}