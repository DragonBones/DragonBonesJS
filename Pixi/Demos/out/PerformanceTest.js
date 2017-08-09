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
var PerformanceTest = (function (_super) {
    __extends(PerformanceTest, _super);
    function PerformanceTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._addingArmature = false;
        _this._removingArmature = false;
        _this._text = new PIXI.Text("", { align: "center" });
        _this._armatures = [];
        return _this;
    }
    PerformanceTest.prototype._onStart = function () {
        var _this = this;
        PIXI.loader
            .add("dragonBonesData", "./resource/assets/dragon_boy_ske.json")
            .add("textureData", "./resource/assets/dragon_boy_tex.json")
            .add("texture", "./resource/assets/dragon_boy_tex.png");
        PIXI.loader.once("complete", function (loader, resources) {
            _this._resources = resources;
            //
            _this._text.scale.x = 0.7;
            _this._text.scale.y = 0.7;
            _this.stage.addChild(_this._text);
            //
            _this._stage.interactive = true;
            _this._stage.addListener("touchstart", _this._touchHandler, _this);
            _this._stage.addListener("touchend", _this._touchHandler, _this);
            _this._stage.addListener("mousedown", _this._touchHandler, _this);
            _this._stage.addListener("mouseup", _this._touchHandler, _this);
            PIXI.ticker.shared.add(_this._enterFrameHandler, _this);
            for (var i = 0; i < 100; ++i) {
                _this._addArmature();
            }
            _this._resetPosition();
            _this._updateText();
            //
            _this._startRenderTick();
        });
        PIXI.loader.load();
    };
    PerformanceTest.prototype._enterFrameHandler = function (deltaTime) {
        if (this._addingArmature) {
            for (var i = 0; i < 10; ++i) {
                this._addArmature();
            }
            this._resetPosition();
            this._updateText();
        }
        if (this._removingArmature) {
            for (var i = 0; i < 10; ++i) {
                this._removeArmature();
            }
            this._resetPosition();
            this._updateText();
        }
    };
    PerformanceTest.prototype._touchHandler = function (event) {
        switch (event.type) {
            case "touchstart":
            case "mousedown":
                var touchRight = event.data.global.x > this._renderer.width * 0.5;
                this._addingArmature = touchRight;
                this._removingArmature = !touchRight;
                break;
            case "touchend":
            case "mouseup":
                this._addingArmature = false;
                this._removingArmature = false;
                break;
        }
    };
    PerformanceTest.prototype._addArmature = function () {
        if (this._armatures.length === 0) {
            dragonBones.PixiFactory.factory.parseDragonBonesData(this._resources["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(this._resources["textureData"].data, this._resources["texture"].texture);
        }
        var armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scale.set(0.7, 0.7);
        this.stage.addChild(armatureDisplay);
        this._armatures.push(armatureDisplay);
    };
    PerformanceTest.prototype._removeArmature = function () {
        if (this._armatures.length === 0) {
            return;
        }
        var armatureDisplay = this._armatures.pop();
        this.stage.removeChild(armatureDisplay);
        armatureDisplay.dispose();
        if (this._armatures.length === 0) {
            dragonBones.PixiFactory.factory.clear(true);
            dragonBones.BaseObject.clearPool();
        }
    };
    PerformanceTest.prototype._resetPosition = function () {
        var armatureCount = this._armatures.length;
        if (armatureCount === 0) {
            return;
        }
        var paddingH = 50;
        var paddingV = 150;
        var gapping = 100;
        var stageWidth = this.renderer.width - paddingH * 2;
        var columnCount = Math.floor(stageWidth / gapping);
        var paddingHModify = (this.renderer.width - columnCount * gapping) * 0.5;
        var dX = stageWidth / columnCount;
        var dY = (this.renderer.height - paddingV * 2) / Math.ceil(armatureCount / columnCount);
        for (var i = 0, l = armatureCount; i < l; ++i) {
            var armatureDisplay = this._armatures[i];
            var lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
            armatureDisplay.y = lineY * dY + paddingV;
        }
    };
    PerformanceTest.prototype._updateText = function () {
        this._text.text = "Count: " + this._armatures.length + " \nTouch screen left to decrease count / right to increase count.";
        this._text.x = (this.renderer.width - this._text.width) * 0.5;
        this._text.y = this.renderer.height - 60;
        this.stage.addChild(this._text);
    };
    return PerformanceTest;
}(BaseTest));
