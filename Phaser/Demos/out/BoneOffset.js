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
var BoneOffset = /** @class */ (function (_super) {
    __extends(BoneOffset, _super);
    function BoneOffset() {
        return _super.call(this, "BoneOffset") || this;
    }
    BoneOffset.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("bullet_01", "resource/bullet_01/bullet_01_tex.png", "resource/bullet_01/bullet_01_tex.json", "resource/bullet_01/bullet_01_ske.json");
    };
    BoneOffset.prototype.create = function () {
        _super.prototype.create.call(this);
        for (var i = 0; i < 100; ++i) {
            var armatureDisplay = this.add.armature("bullet_01", "bullet_01");
            armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
            armatureDisplay.x = 0;
            armatureDisplay.y = 0;
            this.cameras.main.centerOn(armatureDisplay.x, armatureDisplay.y);
            this._moveTo(armatureDisplay);
        }
    };
    BoneOffset.prototype._animationHandler = function (event) {
        this._moveTo(event.armature.display);
    };
    BoneOffset.prototype._moveTo = function (armatureDisplay) {
        var fromX = armatureDisplay.x;
        var fromY = armatureDisplay.y;
        var camera = this.cameras.main;
        var toX = Math.random() * camera.width - camera.centerX;
        var toY = Math.random() * camera.height - camera.centerY;
        var dX = toX - fromX;
        var dY = toY - fromY;
        var rootSlot = armatureDisplay.armature.getBone("root");
        var effectSlot = armatureDisplay.armature.getBone("bullet");
        // Modify root and bullet bone offset.
        rootSlot.offset.scaleX = Math.sqrt(dX * dX + dY * dY) / 100; // Bullet translate distance is 100 px.
        rootSlot.offset.rotation = Math.atan2(dY, dX);
        rootSlot.offset.skew = Math.random() * Math.PI - Math.PI * 0.5; // Random skew.
        effectSlot.offset.scaleX = 0.5 + Math.random() * 0.5; // Random scale.
        effectSlot.offset.scaleY = 0.5 + Math.random() * 0.5;
        // Update root and bullet bone.
        rootSlot.invalidUpdate();
        effectSlot.invalidUpdate();
        //
        armatureDisplay.x = fromX;
        armatureDisplay.y = fromY;
        armatureDisplay.animation.timeScale = 0.5 + Math.random() * 1.0; // Random animation speed.
        armatureDisplay.animation.play("idle", 1);
    };
    return BoneOffset;
}(BaseDemo));
