abstract class BaseDemo extends egret.DisplayObjectContainer {
    private static BACKGROUND_URL: string = "resource/background.png";
    protected _loadCount: number = 0;
    protected readonly _loadingText: egret.TextField = new egret.TextField();
    protected readonly _background: egret.Bitmap = new egret.Bitmap();
    protected readonly _resources: string[] = [];
    protected readonly _resourceMap: any = {};

    public constructor() {
        super();

        this._updateLoadingText(`Loading 0%`);
        this._resources.push(BaseDemo.BACKGROUND_URL);
        this.addChild(this._loadingText);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
            this.x = this.stageWidth * 0.5;
            this.y = this.stageHeight * 0.5;
            this._loadResources();
        }, this);
    }

    protected abstract _onStart(): void;

    private _updateLoadingText(text: string): void {
        this._loadingText.text = text;
        this._loadingText.x = -this._loadingText.width * 0.5;
        this._loadingText.y = -this._loadingText.height * 0.5;
    }

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
                        //
                        this._background.texture = RES.getRes(BaseDemo.BACKGROUND_URL);
                        this._background.x = -this._background.texture.textureWidth * 0.5;
                        this._background.y = -this._background.texture.textureHeight * 0.5;
                        this.addChild(this._background);
                        //
                        this._onStart();
                    }
                    else {
                        this._updateLoadingText(`Loading ${Math.round((1.0 - this._loadCount / this._resources.length) * 100.0)}%`);
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
        text.x = -this.stageWidth * 0.5;
        text.y = this.stageHeight * 0.5 - 100;
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