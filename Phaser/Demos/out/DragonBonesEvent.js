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
var DragonBonesEvent = /** @class */ (function (_super) {
    __extends(DragonBonesEvent, _super);
    function DragonBonesEvent() {
        return _super.call(this, "DragonBonesEvent") || this;
    }
    DragonBonesEvent.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_1004d", "resource/mecha_1004d/mecha_1004d_tex.png", "resource/mecha_1004d/mecha_1004d_tex.json", "resource/mecha_1004d/mecha_1004d_ske.json");
    };
    DragonBonesEvent.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this._armatureDisplay = this.add.armature("mecha_1004d", "mecha_1004d");
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");
        this._armatureDisplay.x = this.cameras.main.centerX;
        this._armatureDisplay.y = this.cameras.main.centerY + 100.0;
        //
        this.input.enabled = true;
        this.input.on('pointerdown', function () {
            _this._armatureDisplay.animation.fadeIn("skill_03", 0.2);
        });
        //
        this.createText("Touch to play animation.");
    };
    DragonBonesEvent.prototype._animationEventHandler = function (event) {
        if (event.animationState.name === "skill_03") {
            this._armatureDisplay.animation.fadeIn("walk", 0.2);
        }
    };
    return DragonBonesEvent;
}(BaseDemo));
