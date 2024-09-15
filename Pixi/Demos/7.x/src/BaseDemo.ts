// import * as PIXI from "pixi.js";
abstract class BaseDemo extends PIXI.Application {
    private static BACKGROUND_URL: string = "resource/background.png";
    protected readonly _renderer = new PIXI.Renderer({width:1136, height:640});
    protected readonly _background: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
    protected readonly _resources: string[] = [];
    protected _pixiResources: dragonBones.Map<PIXI.loaders.Resource>;
    protected armatureContainer: PIXI.Container = new PIXI.Container();

    
    public constructor() {
        super({width:1136, height:640, backgroundColor:0x666666});
        this._resources.push(BaseDemo.BACKGROUND_URL);
        document.body.appendChild(this.view);
        // 初始化一下dbbin的loader parser；
        const factory = dragonBones.PixiFactory.factory;
        setTimeout(() => {
            this.armatureContainer.x = this.stageWidth * 0.5;
            this.armatureContainer.y = this.stageHeight * 0.5;
            this._loadResources();
        }, 10);
    }

    protected abstract _onStart(): void;

    protected _loadResources(): void {
        const bundles = {name:'all', assets:[]};
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                console.log('vvvv')
                bundles.assets.push({alias: resource, src: resource});
            }
            else {
                bundles.assets.push({alias: resource, src:resource});
            }
        }
        PIXI.Assets.init({manifest: {bundles: [bundles]}});
        PIXI.Assets.loadBundle('all').then((resources:any) => {
            console.log('skk load complete:', resources);
            this._pixiResources = resources;
            //
            this._background.texture = this._pixiResources[BaseDemo.BACKGROUND_URL];
            this._background.x = -this._background.texture.width * 0.5;
            this._background.y = -this._background.texture.height * 0.5;
            this.stage.addChild(this._background);
            this.stage.addChild(this.armatureContainer);
            this._onStart();
        });
    }

    public addChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
        return this.armatureContainer.addChild(child);
    }
    public removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject {
        return this.armatureContainer.removeChild(child);
    }

    public createText(string: string): PIXI.Text {
        const text = new PIXI.Text(string, { align: "center" });
        text.text = string;
        text.scale.x = 0.7;
        text.scale.y = 0.7;
        text.x = - text.width * 0.5;
        text.y = this.stageHeight * 0.5 - 100.0;
        this.armatureContainer.addChild(text);

        return text;
    }

    public get stageWidth(): number {
        return this._renderer.width;
    }

    public get stageHeight(): number {
        return this._renderer.height;
    }
    public addListener(event: string, handler: Function, thisObj: any): void {
        this.stage.on(event, handler, thisObj);
    }
    public set interactive(value: boolean) {
        this.stage.interactive = value;
    }
    public get x() {
        return this.armatureContainer.x;
    }
    public get y() {
        return this.armatureContainer.y;
    }
}