"use strict";
var BaseTest = (function () {
    function BaseTest() {
        this._renderer = new PIXI.WebGLRenderer(1136, 640);
        this._stage = new PIXI.Container();
        this._backgroud = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this._renderer.backgroundColor = 0x666666;
        this._backgroud.width = this._renderer.width;
        this._backgroud.height = this._renderer.height;
        this._stage.addChild(this._backgroud);
        document.body.appendChild(this._renderer.view);
        this._onStart();
    }
    BaseTest.prototype._renderHandler = function (deltaTime) {
        this._renderer.render(this._stage);
    };
    BaseTest.prototype._startRenderTick = function () {
        // Make sure render after dragonBones update.
        PIXI.ticker.shared.add(this._renderHandler, this);
    };
    Object.defineProperty(BaseTest.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTest.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    return BaseTest;
}());
