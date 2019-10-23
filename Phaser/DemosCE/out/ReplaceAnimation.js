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
    function ReplaceAnimation(game) {
        var _this = _super.call(this, game) || this;
        _this._resources.push("resource/mecha_2903/mecha_2903_ske.json", "resource/mecha_2903/mecha_2903_tex.json", "resource/mecha_2903/mecha_2903_tex.png");
        return _this;
    }
    ReplaceAnimation.prototype._onStart = function () {
        var _this = this;
        var factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_2903/mecha_2903_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(this.game.cache.getItem("resource/mecha_2903/mecha_2903_tex.json", Phaser.Cache.JSON).data, this.game.cache.getImage("resource/mecha_2903/mecha_2903_tex.png", true).base);
        this._armatureDisplayA = factory.buildArmatureDisplay("mecha_2903");
        this._armatureDisplayB = factory.buildArmatureDisplay("mecha_2903b");
        this._armatureDisplayC = factory.buildArmatureDisplay("mecha_2903c");
        this._armatureDisplayD = factory.buildArmatureDisplay("mecha_2903d");
        var sourceArmatureData = factory.getArmatureData("mecha_2903d");
        factory.replaceAnimation(this._armatureDisplayA.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayB.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayC.armature, sourceArmatureData);
        this.addChild(this._armatureDisplayD);
        this.addChild(this._armatureDisplayA);
        this.addChild(this._armatureDisplayB);
        this.addChild(this._armatureDisplayC);
        this._armatureDisplayA.x = 0.0 - 350.0;
        this._armatureDisplayA.y = 0.0 + 150.0;
        this._armatureDisplayB.x = 0.0;
        this._armatureDisplayB.y = 0.0 + 150.0;
        this._armatureDisplayC.x = 0.0 + 350.0;
        this._armatureDisplayC.y = 0.0 + 150.0;
        this._armatureDisplayD.x = 0.0;
        this._armatureDisplayD.y = 0.0 - 50.0;
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(function () {
            _this._changeAnimation();
        });
        //
        this.createText("Touch to change animation.");
    };
    ReplaceAnimation.prototype._changeAnimation = function () {
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
}(BaseDemo));
