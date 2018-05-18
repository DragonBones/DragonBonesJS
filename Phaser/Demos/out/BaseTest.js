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
    function BaseTest(game) {
        var _this = _super.call(this, game, 0.0, 0.0) || this;
        _this._resources = [];
        _this._background = new Phaser.Graphics(_this.game);
        _this._background.beginFill(0x666666);
        _this._background.drawRect(0.0, 0.0, _this.stageWidth, _this.stageHeight);
        _this.addChild(_this._background);
        setTimeout(function () {
            _this._loadResources();
        }, 10);
        return _this;
    }
    BaseTest.prototype._loadResources = function () {
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
                _this._onStart();
            }
        });
        this.game.load.start();
    };
    BaseTest.prototype.createText = function (string) {
        var style = { font: "14px", fill: "#FFFFFF", align: "center" };
        var text = this.game.add.text(0.0, 0.0, string, style);
        text.x = (this.stageWidth - text.width) * 0.5;
        text.y = this.stageHeight - 60;
        this.addChild(text);
        return text;
    };
    Object.defineProperty(BaseTest.prototype, "stageWidth", {
        get: function () {
            return this.game.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTest.prototype, "stageHeight", {
        get: function () {
            return this.game.height;
        },
        enumerable: true,
        configurable: true
    });
    return BaseTest;
}(Phaser.Sprite));
