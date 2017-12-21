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
var AnimationBase = /** @class */ (function (_super) {
    __extends(AnimationBase, _super);
    function AnimationBase(game) {
        var _this = _super.call(this, game) || this;
        _this._isTouched = false;
        _this._resources.push("resource/progress_bar/progress_bar_ske.json", "resource/progress_bar/progress_bar_tex.json", "resource/progress_bar/progress_bar_tex.png");
        return _this;
    }
    AnimationBase.prototype._onStart = function () {
        var factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/progress_bar/progress_bar_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(this.game.cache.getItem("resource/progress_bar/progress_bar_tex.json", Phaser.Cache.JSON).data, this.game.cache.getImage("resource/progress_bar/progress_bar_tex.png", true).base);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progress_bar");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 0.0;
        this.addChild(this._armatureDisplay);
        // Add animation event listener.
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(this._inputDown, this);
        this.events.onInputUp.add(this._inputUp, this);
        //
        this.createText("Touch to control animation play progress.");
    };
    AnimationBase.prototype._inputDown = function () {
        var progress = Math.min(Math.max((this.game.input.x - this.x + 300.0) / 600.0, 0.0), 1.0);
        this._isTouched = true;
        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
    };
    AnimationBase.prototype._inputUp = function () {
        this._isTouched = false;
        this._armatureDisplay.animation.play();
    };
    AnimationBase.prototype.update = function () {
        if (this._isTouched) {
            var progress = Math.min(Math.max((this.game.input.x - this.x + 300.0) / 600.0, 0.0), 1.0);
            var animationState = this._armatureDisplay.animation.getState("idle");
            animationState.currentTime = animationState.totalTime * progress;
        }
    };
    AnimationBase.prototype._animationEventHandler = function (event) {
        console.log(event.animationState.name, event.type, event.name);
    };
    return AnimationBase;
}(BaseDemo));
