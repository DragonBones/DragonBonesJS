var demosPixi;
(function (demosPixi) {
    var BaseTest = (function () {
        function BaseTest() {
            this._renderer = new PIXI.WebGLRenderer(800, 600);
            this._stage = new PIXI.Container();
            this._backgroud = new PIXI.Sprite(PIXI.Texture.EMPTY);
            this._backgroud.width = this._renderer.width;
            this._backgroud.height = this._renderer.height;
            this._stage.addChild(this._backgroud);
            document.body.appendChild(this._renderer.view);
            PIXI.ticker.shared.add(this._renderHandler, this);
            this._onStart();
        }
        BaseTest.prototype._renderHandler = function (deltaTime) {
            this._renderer.render(this._stage);
        };
        return BaseTest;
    }());
    demosPixi.BaseTest = BaseTest;
})(demosPixi || (demosPixi = {}));
