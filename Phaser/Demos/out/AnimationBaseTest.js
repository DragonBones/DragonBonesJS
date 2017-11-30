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
    function AnimationBaseTest(game) {
        var _this = _super.call(this, game) || this;
        _this._isTouched = false;
        _this._resources.push("resource/assets/animation_base_test_ske.json", "resource/assets/animation_base_test_tex.json", "resource/assets/animation_base_test_tex.png");
        return _this;
    }
    AnimationBaseTest.prototype._onStart = function () {
        var factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/assets/animation_base_test_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(this.game.cache.getItem("resource/assets/animation_base_test_tex.json", Phaser.Cache.JSON).data, this.game.cache.getImage("resource/assets/animation_base_test_tex.png", true).base);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this._armatureDisplay.scale.x = this._armatureDisplay.scale.x = this.stageWidth >= 300 ? 1 : this.stageWidth / 330;
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
        this.inputEnabled = true;
        this.events.onInputDown.add(this._inputDown, this);
        this.events.onInputUp.add(this._inputUp, this);
        //
        this.createText("Click to control animation play progress.");
    };
    AnimationBaseTest.prototype._inputDown = function () {
        var progress = Math.min(Math.max((this.game.input.x - this._armatureDisplay.x + 300 * this._armatureDisplay.scale.x) / 600 * this._armatureDisplay.scale.x, 0), 1);
        this._isTouched = true;
        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
    };
    AnimationBaseTest.prototype._inputUp = function () {
        this._isTouched = false;
        this._armatureDisplay.animation.play();
    };
    AnimationBaseTest.prototype.update = function () {
        if (this._isTouched) {
            var progress = Math.min(Math.max((this.game.input.x - this._armatureDisplay.x + 300 * this._armatureDisplay.scale.x) / 600 * this._armatureDisplay.scale.x, 0), 1);
            var animationState = this._armatureDisplay.animation.getState("idle");
            animationState.currentTime = animationState.totalTime * progress;
        }
    };
    AnimationBaseTest.prototype._animationEventHandler = function (event) {
        console.log(event.animationState.name, event.type, event.name || "");
    };
    return AnimationBaseTest;
}(BaseTest));
