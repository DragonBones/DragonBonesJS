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
var ReplaceAnimation = /** @class */ (function (_super) {
    __extends(ReplaceAnimation, _super);
    function ReplaceAnimation() {
        return _super.call(this, "ReplaceAnimation") || this;
    }
    ReplaceAnimation.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_2903", "resource/mecha_2903/mecha_2903_tex.png", "resource/mecha_2903/mecha_2903_tex.json", "resource/mecha_2903/mecha_2903_ske.json");
    };
    ReplaceAnimation.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this._armatureDisplayA = this.add.armature("mecha_2903", "mecha_2903");
        this._armatureDisplayB = this.add.armature("mecha_2903b", "mecha_2903");
        this._armatureDisplayC = this.add.armature("mecha_2903c", "mecha_2903");
        this._armatureDisplayD = this.add.armature("mecha_2903d", "mecha_2903");
        var factory = this.dragonbone.factory;
        var sourceArmatureData = factory.getArmatureData("mecha_2903d");
        factory.replaceAnimation(this._armatureDisplayA.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayB.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayC.armature, sourceArmatureData);
        var cx = this.cameras.main.centerX;
        var cy = this.cameras.main.centerY;
        this._armatureDisplayA.x = cx - 350.0;
        this._armatureDisplayA.y = cy + 150.0;
        this._armatureDisplayB.x = cx;
        this._armatureDisplayB.y = cy + 150.0;
        this._armatureDisplayC.x = cx + 350.0;
        this._armatureDisplayC.y = cy + 150.0;
        this._armatureDisplayD.x = cx;
        this._armatureDisplayD.y = cy - 50.0;
        this.input.enabled = true;
        this.input.on('pointerdown', function () {
            _this._changeAnimation();
        });
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
