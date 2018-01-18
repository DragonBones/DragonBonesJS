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
var BaseDemo = /** @class */ (function (_super) {
    __extends(BaseDemo, _super);
    function BaseDemo(game) {
        var _this = _super.call(this, game, 0.0, 0.0) || this;
        _this._resources = [];
        _this._resources.push(BaseDemo.BACKGROUND_URL);
        setTimeout(function () {
            _this.x = _this.stageWidth * 0.5;
            _this.y = _this.stageHeight * 0.5;
            _this._loadResources();
        }, 10);
        return _this;
    }
    BaseDemo.prototype._loadResources = function () {
        var _this = this;
        var loadCount = 0;
        for (var _i = 0, _a = this._resources; _i < _a.length; _i++) {
            var resource = _a[_i];
            if (resource.indexOf("dbbin") > 0) {
                this.game.load.binary(resource, resource);
            }
            else if (resource.indexOf("png") > 0) {
                this.game.load.image(resource, resource);
            }
            else {
                this.game.load.json(resource, resource);
            }
            loadCount++;
        }
        this.game.load.onFileComplete.add(function () {
            loadCount--;
            if (loadCount === 0) {
                var texture = new PIXI.Texture(_this.game.cache.getImage(BaseDemo.BACKGROUND_URL, true).base);
                _this._background = new Phaser.Sprite(_this.game, 0.0, 0.0, texture);
                _this._background.x = -_this._background.texture.width * 0.5;
                _this._background.y = -_this._background.texture.height * 0.5;
                _this.addChild(_this._background);
                //
                _this._onStart();
            }
        });
        this.game.load.start();
    };
    BaseDemo.prototype.createText = function (string) {
        var style = { font: "14px", fill: "#FFFFFF", align: "center" };
        var text = this.game.add.text(0.0, 0.0, string, style);
        text.x = -text.width * 0.5;
        text.y = this.stageHeight * 0.5 - 100;
        this.addChild(text);
        return text;
    };
    Object.defineProperty(BaseDemo.prototype, "stageWidth", {
        get: function () {
            return this.game.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDemo.prototype, "stageHeight", {
        get: function () {
            return this.game.height;
        },
        enumerable: true,
        configurable: true
    });
    BaseDemo.BACKGROUND_URL = "resource/background.png";
    return BaseDemo;
}(Phaser.Sprite));
