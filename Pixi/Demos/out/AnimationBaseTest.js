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
var AnimationBaseTest = (function (_super) {
    __extends(AnimationBaseTest, _super);
    function AnimationBaseTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isTouched = false;
        return _this;
    }
    AnimationBaseTest.prototype._onStart = function () {
        var _this = this;
        PIXI.loader
            .add("dragonBonesData", "./resource/assets/animation_base_test_ske.json")
            .add("textureData", "./resource/assets/animation_base_test_tex.json")
            .add("texture", "./resource/assets/animation_base_test_tex.png");
        PIXI.loader.once("complete", function (loader, resources) {
            var factory = dragonBones.PixiFactory.factory;
            factory.parseDragonBonesData(resources["dragonBonesData"].data);
            factory.parseTextureAtlasData(resources["textureData"].data, resources["texture"].texture);
            _this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
            _this._armatureDisplay.x = _this.stage.width * 0.5;
            _this._armatureDisplay.y = _this.stage.height * 0.5;
            _this.stage.addChild(_this._armatureDisplay);
            // Test animation event
            _this._armatureDisplay.addListener(dragonBones.EventObject.START, _this._animationEventHandler, _this);
            _this._armatureDisplay.addListener(dragonBones.EventObject.LOOP_COMPLETE, _this._animationEventHandler, _this);
            _this._armatureDisplay.addListener(dragonBones.EventObject.COMPLETE, _this._animationEventHandler, _this);
            _this._armatureDisplay.addListener(dragonBones.EventObject.FADE_IN, _this._animationEventHandler, _this);
            _this._armatureDisplay.addListener(dragonBones.EventObject.FADE_IN_COMPLETE, _this._animationEventHandler, _this);
            _this._armatureDisplay.addListener(dragonBones.EventObject.FADE_OUT, _this._animationEventHandler, _this);
            _this._armatureDisplay.addListener(dragonBones.EventObject.FADE_OUT_COMPLETE, _this._animationEventHandler, _this);
            // Test frame event
            _this._armatureDisplay.addListener(dragonBones.EventObject.FRAME_EVENT, _this._animationEventHandler, _this);
            // Test animation config.
            // const animaitonConfig = this._armatureDisplay.animation.animationConfig;
            // animaitonConfig.name = "test"; // Animation state name.
            // animaitonConfig.animation = "idle"; // Animation name.
            // animaitonConfig.playTimes = 1; // Play one time.
            // animaitonConfig.playTimes = 3; // Play several times.
            // animaitonConfig.playTimes = 0; // Loop play.
            // animaitonConfig.timeScale = 1.0; // Play speed.
            // animaitonConfig.timeScale = -1.0; // Reverse play.
            // animaitonConfig.position = 1.0; // Goto and play.
            // animaitonConfig.duration = 3.0; // Interval play.
            // this._armatureDisplay.animation.playConfig(animaitonConfig);
            _this._armatureDisplay.animation.play("idle", 1);
            //
            _this.stage.interactive = true;
            _this.stage.addListener("touchstart", _this._touchHandler, _this);
            _this.stage.addListener("touchend", _this._touchHandler, _this);
            _this.stage.addListener("touchmove", _this._touchHandler, _this);
            _this.stage.addListener("mousedown", _this._touchHandler, _this);
            _this.stage.addListener("mouseup", _this._touchHandler, _this);
            _this.stage.addListener("mousemove", _this._touchHandler, _this);
            var text = new PIXI.Text("", { align: "center" });
            text.text = "Click to control animation play progress.";
            text.scale.x = 0.7;
            text.scale.y = 0.7;
            text.x = (_this.renderer.width - text.width) * 0.5;
            text.y = _this.renderer.height - 60;
            _this._stage.addChild(text);
            //
            _this._startRenderTick();
        });
        PIXI.loader.load();
    };
    AnimationBaseTest.prototype._touchHandler = function (event) {
        var progress = Math.min(Math.max((event.data.global.x - this._armatureDisplay.x + 300) / 600, 0.0), 1.0);
        switch (event.type) {
            case "touchstart":
            case "mousedown":
                this._isTouched = true;
                // this._armatureDisplay.animation.gotoAndPlayByTime("idle", 0.5, 1);
                // this._armatureDisplay.animation.gotoAndStopByTime("idle", 1);
                // this._armatureDisplay.animation.gotoAndPlayByFrame("idle", 25, 2);
                // this._armatureDisplay.animation.gotoAndStopByFrame("idle", 50);
                // this._armatureDisplay.animation.gotoAndPlayByProgress("idle", progress, 3);
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
                    animationState.currentTime = animationState.totalTime * progress;
                }
                break;
        }
    };
    AnimationBaseTest.prototype._animationEventHandler = function (event) {
        console.log(event.animationState.name, event.type, event.name ? event.name : "");
    };
    return AnimationBaseTest;
}(BaseTest));
