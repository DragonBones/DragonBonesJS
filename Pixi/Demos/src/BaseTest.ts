abstract class BaseTest {
    protected readonly _renderer = new PIXI.WebGLRenderer(1136, 640);
    protected readonly _stage = new PIXI.Container();
    protected readonly _backgroud: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);

    public constructor() {
        this._renderer.backgroundColor = 0x666666;
        this._backgroud.width = this._renderer.width;
        this._backgroud.height = this._renderer.height;
        this._stage.addChild(this._backgroud);

        document.body.appendChild(this._renderer.view);

        this._onStart();
    }

    private _renderHandler(deltaTime: number): void {
        this._renderer.render(this._stage);
    }

    protected _startRenderTick(): void {
        // Make sure render after dragonBones update.
        PIXI.ticker.shared.add(this._renderHandler, this);
    }

    protected abstract _onStart(): void;

    public get renderer(): PIXI.WebGLRenderer {
        return this._renderer;
    }

    public get stage(): PIXI.Container {
        return this._stage;
    }
}