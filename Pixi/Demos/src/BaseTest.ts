namespace demosPixi {
    export abstract class BaseTest {
        protected _renderer = new PIXI.WebGLRenderer(800, 600, { backgroundColor: 0x666666 });
        protected _stage = new PIXI.Container();
        protected _backgroud: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);

        public constructor() {
            this._backgroud.width = this._renderer.width;
            this._backgroud.height = this._renderer.height;
            this._stage.addChild(this._backgroud);

            document.body.appendChild(this._renderer.view);
            PIXI.ticker.shared.add(this._renderHandler, this);

            this._onStart();
        }

        protected _renderHandler(deltaTime: number): void {
            this._renderer.render(this._stage);
        }

        protected abstract _onStart(): void;
    }
}