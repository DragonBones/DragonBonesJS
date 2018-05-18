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
        _this._resources.push("resource/assets/dragon_boy_ske.dbbin", "resource/assets/dragon_boy_tex.json", "resource/assets/dragon_boy_tex.png");
        return _this;
    }
    PerformanceTest.prototype.tick = function () {
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
    PerformanceTest.prototype._onStart = function () {
        var _this = this;
        this.on(Hilo.event.POINTER_START, function (v) {
            var touchRight = v.clientX > _this.stageWidth * 0.5;
            _this._addingArmature = touchRight;
            _this._removingArmature = !touchRight;
        }, false);
        this.on(Hilo.event.POINTER_END, function () {
            _this._addingArmature = false;
            _this._removingArmature = false;
        }, false);
        //
        this._text = this.createText("");
        for (var i = 0; i < 300; ++i) {
            this._addArmature();
        }
        this._resetPosition();
        this._updateText();
    };
    PerformanceTest.prototype._addArmature = function () {
        var factory = dragonBones.HiloFactory.factory;
        if (this._armatures.length === 0) {
            factory.parseDragonBonesData(this._hiloResources["resource/assets/dragon_boy_ske.dbbin"]);
            factory.parseTextureAtlasData(this._hiloResources["resource/assets/dragon_boy_tex.json"], this._hiloResources["resource/assets/dragon_boy_tex.png"]);
        }
        var armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scaleX = armatureDisplay.scaleY = 0.7;
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
            dragonBones.HiloFactory.factory.clear(true);
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
        var stageWidth = this.stageWidth - paddingH * 2;
        var columnCount = Math.floor(stageWidth / gapping);
        var paddingHModify = (this.stageWidth - columnCount * gapping) * 0.5;
        var dX = stageWidth / columnCount;
        var dY = (this.stageHeight - paddingV * 2) / Math.ceil(armatureCount / columnCount);
        for (var i = 0, l = armatureCount; i < l; ++i) {
            var armatureDisplay = this._armatures[i];
            var lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
            armatureDisplay.y = lineY * dY + paddingV;
        }
    };
    PerformanceTest.prototype._updateText = function () {
        this._text.text = "Count: " + this._armatures.length + " \nTouch screen left to decrease count / right to increase count.";
        this._text.x = (this.stageWidth - this._text.width) * 0.5;
        this._text.y = this.stageHeight - 60;
        this.addChild(this._text);
    };
    return PerformanceTest;
}(BaseTest));
