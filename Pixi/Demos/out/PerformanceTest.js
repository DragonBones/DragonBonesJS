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
var PerformanceTest = /** @class */ (function (_super) {
    __extends(PerformanceTest, _super);
    function PerformanceTest() {
        var _this = _super.call(this) || this;
        _this._addingArmature = false;
        _this._removingArmature = false;
        _this._armatures = [];
        _this._resources.push("resource/mecha_1406/mecha_1406_ske.dbbin", "resource/mecha_1406/mecha_1406_tex.json", "resource/mecha_1406/mecha_1406_tex.png");
        return _this;
    }
    PerformanceTest.prototype._onStart = function () {
        this.interactive = true;
        this.addListener("touchstart", this._touchHandler, this);
        this.addListener("touchend", this._touchHandler, this);
        this.addListener("mousedown", this._touchHandler, this);
        this.addListener("mouseup", this._touchHandler, this);
        PIXI.ticker.shared.add(this._enterFrameHandler, this);
        //
        this._text = this.createText("");
        for (var i = 0; i < 300; ++i) {
            this._addArmature();
        }
        this._resetPosition();
        this._updateText();
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
                var touchRight = event.data.global.x > this.stageWidth * 0.5;
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
        var factory = dragonBones.PixiFactory.factory;
        if (this._armatures.length === 0) {
            factory.parseDragonBonesData(this._pixiResources["resource/mecha_1406/mecha_1406_ske.dbbin"].data);
            factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1406/mecha_1406_tex.json"].data, this._pixiResources["resource/mecha_1406/mecha_1406_tex.png"].texture);
        }
        var armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("mecha_1406");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scale.x = armatureDisplay.scale.y = 0.5;
        this.addChild(armatureDisplay);
        this._armatures.push(armatureDisplay);
    };
    PerformanceTest.prototype._removeArmature = function () {
        if (this._armatures.length === 0) {
            return;
        }
        var armatureDisplay = this._armatures.pop();
        this.removeChild(armatureDisplay);
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
        var paddingH = 100;
        var paddingT = 200;
        var paddingB = 100;
        var gapping = 90;
        var stageWidth = this.stageWidth - paddingH * 2;
        var columnCount = Math.floor(stageWidth / gapping);
        var paddingHModify = (this.stageWidth - columnCount * gapping) * 0.5;
        var dX = stageWidth / columnCount;
        var dY = (this.stageHeight - paddingT - paddingB) / Math.ceil(armatureCount / columnCount);
        for (var i = 0, l = armatureCount; i < l; ++i) {
            var armatureDisplay = this._armatures[i];
            var lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify - this.stageWidth * 0.5;
            armatureDisplay.y = lineY * dY + paddingT - this.stageHeight * 0.5;
        }
    };
    PerformanceTest.prototype._updateText = function () {
        this._text.text = "Count: " + this._armatures.length + ". Touch screen left to decrease count / right to increase count.";
        this._text.x = -this._text.width * 0.5;
        this._text.y = this.stageHeight * 0.5 - 100.0;
        this.addChild(this._text);
    };
    return PerformanceTest;
}(BaseDemo));
