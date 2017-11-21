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
var ReplaceAnimation = /** @class */ (function (_super) {
    __extends(ReplaceAnimation, _super);
    function ReplaceAnimation() {
        var _this = _super.call(this) || this;
        _this._resources.push("resource/assets/core_element/mecha_2903_ske.json", "resource/assets/core_element/mecha_2903_tex.json", "resource/assets/core_element/mecha_2903_tex.png");
        return _this;
    }
    ReplaceAnimation.prototype._onStart = function () {
        var _this = this;
        var factory = dragonBones.HiloFactory.factory;
        factory.parseDragonBonesData(this._hiloResources["resource/assets/core_element/mecha_2903_ske.json"]);
        factory.parseTextureAtlasData(this._hiloResources["resource/assets/core_element/mecha_2903_tex.json"], this._hiloResources["resource/assets/core_element/mecha_2903_tex.png"]);
        //
        this._armatureDisplayA = factory.buildArmatureDisplay("mecha_2903");
        this._armatureDisplayB = factory.buildArmatureDisplay("mecha_2903b");
        this._armatureDisplayC = factory.buildArmatureDisplay("mecha_2903c");
        this._armatureDisplayD = factory.buildArmatureDisplay("mecha_2903d");
        var sourceArmatureData = factory.getArmatureData("mecha_2903d");
        factory.replaceAnimation(this._armatureDisplayA.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayB.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayC.armature, sourceArmatureData);
        this.addChild(this._armatureDisplayA);
        this.addChild(this._armatureDisplayB);
        this.addChild(this._armatureDisplayC);
        this.addChild(this._armatureDisplayD);
        this._armatureDisplayA.x = this.stageWidth * 0.5 - 350;
        this._armatureDisplayA.y = this.stageHeight * 0.5 + 200.0;
        this._armatureDisplayB.x = this.stageWidth * 0.5;
        this._armatureDisplayB.y = this.stageHeight * 0.5 + 200.0;
        this._armatureDisplayC.x = this.stageWidth * 0.5 + 350;
        this._armatureDisplayC.y = this.stageHeight * 0.5 + 200.0;
        this._armatureDisplayD.x = this.stageWidth * 0.5;
        this._armatureDisplayD.y = this.stageHeight * 0.5 - 50.0;
        //
        this.on(Hilo.event.POINTER_START, function () {
            _this._replaceAnimation();
        }, false);
        //
        this.createText("Click to change animation.");
    };
    ReplaceAnimation.prototype._replaceAnimation = function () {
        var animationName = this._armatureDisplayD.animation.lastAnimationName;
        if (animationName) {
            var animationNames = this._armatureDisplayD.animation.animationNames;
            var animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureDisplayD.animation.play(animationNames[animationIndex]);
        }
        else {
            this._armatureDisplayD.animation.play();
        }
        animationName = this._armatureDisplayD.animation.lastAnimationName;
        this._armatureDisplayA.animation.play(animationName);
        this._armatureDisplayB.animation.play(animationName);
        this._armatureDisplayC.animation.play(animationName);
    };
    return ReplaceAnimation;
}(BaseTest));
