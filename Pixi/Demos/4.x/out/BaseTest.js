"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseTest = (function (_super) {
    __extends(BaseTest, _super);
    function BaseTest() {
        var _this = _super.call(this) || this;
        _this._renderer = new PIXI.WebGLRenderer(1136, 640);
        _this._backgroud = new PIXI.Sprite(PIXI.Texture.EMPTY);
        _this._resources = [];
        _this._renderer.backgroundColor = 0x666666;
        _this._backgroud.width = _this._renderer.width;
        _this._backgroud.height = _this._renderer.height;
        _this.addChild(_this._backgroud);
        document.body.appendChild(_this._renderer.view);
        //
        setTimeout(function () {
            _this._loadResources();
        }, 10);
        return _this;
    }
    BaseTest.prototype._renderHandler = function (deltaTime) {
        this._renderer.render(this);
    };
    BaseTest.prototype._startRenderTick = function () {
        PIXI.ticker.shared.add(this._renderHandler, this);
    };
    BaseTest.prototype._loadResources = function () {
        var _this = this;
        var binaryOptions = { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER };
        for (var _i = 0, _a = this._resources; _i < _a.length; _i++) {
            var resource = _a[_i];
            if (resource.indexOf("dbbin") > 0) {
                PIXI.loader.add(resource, resource, binaryOptions);
            }
            else {
                PIXI.loader.add(resource, resource);
            }
        }
        PIXI.loader.once("complete", function (loader, resources) {
            _this._pixiResources = resources;
            _this._onStart();
            _this._startRenderTick(); // Make sure render after dragonBones update.
        });
        PIXI.loader.load();
    };
    BaseTest.prototype.createText = function (string) {
        var text = new PIXI.Text(string, { align: "center" });
        text.text = string;
        text.scale.x = 0.7;
        text.scale.y = 0.7;
        text.x = (this.stageWidth - text.width) * 0.5;
        text.y = this.stageHeight - 60;
        this.addChild(text);
        return text;
    };
    Object.defineProperty(BaseTest.prototype, "stageWidth", {
        get: function () {
            return this._renderer.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTest.prototype, "stageHeight", {
        get: function () {
            return this._renderer.height;
        },
        enumerable: true,
        configurable: true
    });
    return BaseTest;
}(PIXI.Container));
