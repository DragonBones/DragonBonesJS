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
var HelloDragonBones = /** @class */ (function (_super) {
    __extends(HelloDragonBones, _super);
    function HelloDragonBones() {
        return _super.call(this, "HelloDragonBones") || this;
    }
    HelloDragonBones.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_1002_101d_show", "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png", "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json", "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin", null, null, { responseType: "arraybuffer" });
    };
    HelloDragonBones.prototype.create = function () {
        _super.prototype.create.call(this);
        var armatureDisplay = this.add.armature("mecha_1002_101d", "mecha_1002_101d_show");
        armatureDisplay.animation.play("idle");
        armatureDisplay.x = this.cameras.main.centerX;
        armatureDisplay.y = this.cameras.main.centerY + 200;
    };
    return HelloDragonBones;
}(BaseDemo));
