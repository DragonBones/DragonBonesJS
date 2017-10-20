abstract class BaseTest extends PIXI.Container {
    protected readonly _renderer = new PIXI.WebGLRenderer(1136, 640);
    protected readonly _backgroud: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
    protected readonly _resources: string[] = [];
    protected _pixiResources: dragonBones.Map<PIXI.loaders.Resource>;

    public constructor() {
        super();

        this._renderer.backgroundColor = 0x666666;
        this._backgroud.width = this._renderer.width;
        this._backgroud.height = this._renderer.height;
        this.addChild(this._backgroud);
        document.body.appendChild(this._renderer.view);
        //
        setTimeout(() => {
            this._loadResources();
        }, 10);
    }

    protected abstract _onStart(): void;

    protected _renderHandler(deltaTime: number): void {
        this._renderer.render(this);
    }

    protected _startRenderTick(): void {
        PIXI.ticker.shared.add(this._renderHandler, this);
    }

    protected _loadResources(): void {
        const binaryOptions = { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER };

        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                PIXI.loader.add(resource, resource, binaryOptions as any);
            }
            else {
                PIXI.loader.add(resource, resource);
            }
        }

        PIXI.loader.once("complete", (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) => {
            this._pixiResources = resources;
            this._onStart();
            this._startRenderTick(); // Make sure render after dragonBones update.
        });
        PIXI.loader.load();
    }

    public createText(string: string): PIXI.Text {
        const text = new PIXI.Text(string, { align: "center" });
        text.text = string;
        text.scale.x = 0.7;
        text.scale.y = 0.7;
        text.x = (this.stageWidth - text.width) * 0.5;
        text.y = this.stageHeight - 60;
        this.addChild(text);

        return text;
    }

    public get stageWidth(): number {
        return this._renderer.width;
    }

    public get stageHeight(): number {
        return this._renderer.height;
    }
}