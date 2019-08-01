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
var AnimationLayer = /** @class */ (function (_super) {
    __extends(AnimationLayer, _super);
    function AnimationLayer() {
        return _super.call(this, "AnimationLayer") || this;
    }
    AnimationLayer.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_1004d", "resource/mecha_1004d/mecha_1004d_tex.png", "resource/mecha_1004d/mecha_1004d_tex.json", "resource/mecha_1004d/mecha_1004d_ske.json");
    };
    AnimationLayer.prototype.create = function () {
        _super.prototype.create.call(this);
        this._armatureDisplay = this.add.armature("mecha_1004d", "mecha_1004d");
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");
        this._armatureDisplay.x = this.cameras.main.centerX;
        this._armatureDisplay.y = this.cameras.main.centerY + 100.0;
    };
    AnimationLayer.prototype._animationEventHandler = function (event) {
        var attackState = this._armatureDisplay.animation.getState("attack_01");
        if (!attackState) {
            attackState = this._armatureDisplay.animation.fadeIn("attack_01", 0.1, 1, 1);
            attackState.resetToPose = false;
            attackState.autoFadeOutTime = 0.1;
            attackState.addBoneMask("chest");
            attackState.addBoneMask("effect_l");
            attackState.addBoneMask("effect_r");
        }
    };
    return AnimationLayer;
}(BaseDemo));
