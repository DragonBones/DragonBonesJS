"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PerformanceTest = /** @class */ (function (_super) {
    __extends(PerformanceTest, _super);
    function PerformanceTest() {
        var _this = _super.call(this, "PerformanceText") || this;
        _this._addingArmature = false;
        _this._removingArmature = false;
        _this._armatures = [];
        return _this;
    }
    PerformanceTest.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_1406", "resource/mecha_1406/mecha_1406_tex.png", "resource/mecha_1406/mecha_1406_tex.json", "resource/mecha_1406/mecha_1406_ske.dbbin", null, null, { responseType: "arraybuffer" });
    };
    PerformanceTest.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.input.enabled = true;
        this.input.on("pointerdown", function (p) { return _this._inputDown(p); });
        this.input.on("pointerup", function () { return _this._inputUp(); });
        this._text = this.createText("--");
        this._text.y = this.cameras.main.height - 80;
        this._perfText = this.createText("--");
        this._perfText.y = this._text.y + this._text.height + 10;
        for (var i = 0; i < 300; ++i) {
            this._addArmature();
        }
        this._resetPosition();
        this._updateText();
    };
    PerformanceTest.prototype.update = function (time, delta) {
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
        var game = this.scene.systems.game;
        this._perfText.setText("FPS:" + game.loop.actualFps.toFixed(1) + " (" + game.loop.minFps + "-" + game.loop.targetFps + ")");
    };
    PerformanceTest.prototype._inputDown = function (pointer) {
        var touchRight = pointer.x > this.cameras.main.centerX;
        this._addingArmature = touchRight;
        this._removingArmature = !touchRight;
    };
    PerformanceTest.prototype._inputUp = function () {
        this._addingArmature = false;
        this._removingArmature = false;
    };
    PerformanceTest.prototype._addArmature = function () {
        var armatureDisplay = this.add.armature("mecha_1406", "mecha_1406");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk");
        armatureDisplay.setScale(.5);
        this._armatures.push(armatureDisplay);
    };
    PerformanceTest.prototype._removeArmature = function () {
        if (this._armatures.length === 0) {
            return;
        }
        var armatureDisplay = this._armatures.pop();
        armatureDisplay.destroy();
        if (this._armatures.length === 0) {
            this.dragonbone.factory.clear(true);
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
        var stageHeight = this.cameras.main.height;
        var stageWidth = this.cameras.main.width - paddingH * 2;
        var columnCount = Math.floor(stageWidth / gapping);
        var paddingHModify = (stageWidth - columnCount * gapping);
        var dX = stageWidth / columnCount;
        var dY = (stageHeight - paddingT - paddingB) / Math.ceil(armatureCount / columnCount);
        for (var i = 0, l = armatureCount; i < l; ++i) {
            var armatureDisplay = this._armatures[i];
            var lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify + paddingH * .5;
            armatureDisplay.y = lineY * dY + paddingT;
        }
    };
    PerformanceTest.prototype._updateText = function () {
        this._text.setText("Count: " + this._armatures.length + ". Touch screen left to decrease count / right to increase count.");
    };
    return PerformanceTest;
}(BaseDemo));
