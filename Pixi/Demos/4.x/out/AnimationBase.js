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
    function AnimationBase() {
        var _this = _super.call(this) || this;
        _this._isTouched = false;
        _this._resources.push("resource/progress_bar/progress_bar_ske.json", "resource/progress_bar/progress_bar_tex.json", "resource/progress_bar/progress_bar_tex.png");
        return _this;
    }
    AnimationBase.prototype._onStart = function () {
        var factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/progress_bar/progress_bar_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/progress_bar/progress_bar_tex.json"].data, this._pixiResources["resource/progress_bar/progress_bar_tex.png"].texture);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progress_bar");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 0.0;
        this.addChild(this._armatureDisplay);
        // Add animation event listener.
        this._armatureDisplay.on(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");
        //
        this.interactive = true;
        this.addListener("touchstart", this._touchHandler, this);
        this.addListener("touchend", this._touchHandler, this);
        this.addListener("touchmove", this._touchHandler, this);
        this.addListener("mousedown", this._touchHandler, this);
        this.addListener("mouseup", this._touchHandler, this);
        this.addListener("mousemove", this._touchHandler, this);
        //
        this.createText("Touch to control animation play progress.");
    };
    AnimationBase.prototype._touchHandler = function (event) {
        var progress = Math.min(Math.max((event.data.global.x - this.x + 300.0) / 600.0, 0.0), 1.0);
        switch (event.type) {
            case "touchstart":
            case "mousedown":
                this._isTouched = true;
                this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
                break;
            case "touchend":
            case "mouseup":
                this._isTouched = false;
                this._armatureDisplay.animation.play();
                break;
            case "touchmove":
            case "mousemove":
                if (this._isTouched) {
                    var animationState = this._armatureDisplay.animation.getState("idle");
                    if (animationState) {
                        animationState.currentTime = animationState.totalTime * progress;
                    }
                }
                break;
        }
    };
    AnimationBase.prototype._animationEventHandler = function (event) {
        console.log(event.animationState.name, event.type, event.name);
    };
    return AnimationBase;
}(BaseDemo));
