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
var AnimationLayer = /** @class */ (function (_super) {
    __extends(AnimationLayer, _super);
    function AnimationLayer() {
        var _this = _super.call(this) || this;
        _this._resources.push("resource/mecha_1004d/mecha_1004d_ske.json", "resource/mecha_1004d/mecha_1004d_tex.json", "resource/mecha_1004d/mecha_1004d_tex.png");
        return _this;
    }
    AnimationLayer.prototype._onStart = function () {
        var factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_1004d/mecha_1004d_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1004d/mecha_1004d_tex.json"].data, this._pixiResources["resource/mecha_1004d/mecha_1004d_tex.png"].texture);
        this._armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 100.0;
        this.addChild(this._armatureDisplay);
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
