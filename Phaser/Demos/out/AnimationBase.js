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
var AnimationBase = /** @class */ (function (_super) {
    __extends(AnimationBase, _super);
    function AnimationBase() {
        var _this = _super.call(this, "AnimationBase") || this;
        _this._isTouched = false;
        return _this;
    }
    AnimationBase.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("progress_bar", "resource/progress_bar/progress_bar_tex.png", "resource/progress_bar/progress_bar_tex.json", "resource/progress_bar/progress_bar_ske.json");
    };
    AnimationBase.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this._armatureDisplay = this.add.armature("progress_bar", "progress_bar");
        this._armatureDisplay.x = this.cameras.main.centerX;
        this._armatureDisplay.y = this.cameras.main.centerY;
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");
        this.input.enabled = true;
        this.input.on('pointerdown', function () { return _this._inputDown(); });
        this.input.on('pointerup', function () { return _this._inputUp(); });
        this.createText("Touch to control animation play progress.");
    };
    AnimationBase.prototype._inputDown = function () {
        var progress = Phaser.Math.Clamp((this.input.x - this._armatureDisplay.x + 300.0) / 600.0, 0.0, 1.0);
        this._isTouched = true;
        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
    };
    AnimationBase.prototype._inputUp = function () {
        this._isTouched = false;
        this._armatureDisplay.animation.play();
    };
    AnimationBase.prototype.update = function () {
        if (this._isTouched) {
            var progress = Phaser.Math.Clamp((this.input.x - this._armatureDisplay.x + 300.0) / 600.0, 0.0, 1.0);
            var animationState = this._armatureDisplay.animation.getState("idle");
            animationState.currentTime = animationState.totalTime * progress;
        }
    };
    AnimationBase.prototype._animationEventHandler = function (event) {
        console.log(event.animationState.name, event.type, event.name);
    };
    return AnimationBase;
}(BaseDemo));
