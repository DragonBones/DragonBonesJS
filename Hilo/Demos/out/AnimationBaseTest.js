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
var AnimationBaseTest = /** @class */ (function (_super) {
    __extends(AnimationBaseTest, _super);
    function AnimationBaseTest() {
        var _this = _super.call(this) || this;
        _this._isTouched = false;
        _this._resources.push("resource/assets/animation_base_test_ske.json", "resource/assets/animation_base_test_tex.json", "resource/assets/animation_base_test_tex.png");
        return _this;
    }
    AnimationBaseTest.prototype._onStart = function () {
        var _this = this;
        var factory = dragonBones.HiloFactory.factory;
        factory.parseDragonBonesData(this._hiloResources["resource/assets/animation_base_test_ske.json"]);
        factory.parseTextureAtlasData(this._hiloResources["resource/assets/animation_base_test_tex.json"], this._hiloResources["resource/assets/animation_base_test_tex.png"]);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = this.stageWidth >= 300 ? 1 : this.stageWidth / 330;
        this.addChild(this._armatureDisplay);
        // Test animation event
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle", 1);
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
        // animaitonConfig.duration = 0.0; // Goto and stop.
        // animaitonConfig.duration = 3.0; // Interval play.
        // this._armatureDisplay.animation.playConfig(animaitonConfig);
        //
        this.on(Hilo.event.POINTER_START, function (v) {
            var progress = Math.min(Math.max((v.clientX - _this._armatureDisplay.x + 300 * _this._armatureDisplay.scaleX) / 600 * _this._armatureDisplay.scaleX, 0), 1);
            _this._isTouched = true;
            _this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
        }, false);
        this.on(Hilo.event.POINTER_END, function () {
            _this._isTouched = false;
            _this._armatureDisplay.animation.play();
        }, false);
        this.on(Hilo.event.POINTER_MOVE, function (v) {
            if (_this._isTouched) {
                var progress = Math.min(Math.max((v.clientX - _this._armatureDisplay.x + 300 * _this._armatureDisplay.scaleX) / 600 * _this._armatureDisplay.scaleX, 0), 1);
                var animationState = _this._armatureDisplay.animation.getState("idle");
                animationState.currentTime = animationState.totalTime * progress;
            }
        }, false);
        //
        this.createText("Click to control animation play progress.");
    };
    AnimationBaseTest.prototype._animationEventHandler = function (event) {
        var eventObject = event.detail;
        console.log(eventObject.animationState.name, eventObject.type, eventObject.name || "");
    };
    return AnimationBaseTest;
}(BaseTest));
