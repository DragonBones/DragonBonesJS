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
var ReplaceSlotDisplay = /** @class */ (function (_super) {
    __extends(ReplaceSlotDisplay, _super);
    function ReplaceSlotDisplay() {
        var _this = _super.call(this, "ReplaceSlotDisplay") || this;
        _this._leftWeaponIndex = 0;
        _this._rightWeaponIndex = 0;
        _this._factory = null;
        return _this;
    }
    ReplaceSlotDisplay.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_1004d", "resource/mecha_1004d_show/mecha_1004d_show_tex.png", "resource/mecha_1004d_show/mecha_1004d_show_tex.json", "resource/mecha_1004d_show/mecha_1004d_show_ske.json");
        this.load.dragonbone("weapon_1004", "resource/weapon_1004_show/weapon_1004_show_tex.png", "resource/weapon_1004_show/weapon_1004_show_tex.json", "resource/weapon_1004_show/weapon_1004_show_ske.json");
    };
    ReplaceSlotDisplay.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this._factory = this.dragonbone.factory;
        this._armatureDisplay = this.add.armature("mecha_1004d", "mecha_1004d");
        this._armatureDisplay.animation.play();
        // Dragonbones data will be finded only when add.armature called, this makes replaceSlotDisplay work
        this.add.armature("weapon", "weapon_1004");
        //
        this._armatureDisplay.x = this.cameras.main.centerX + 100.0;
        this._armatureDisplay.y = this.cameras.main.centerY + 200.0;
        //
        this.input.on('pointerdown', function () {
            var localX = _this.input.x - _this._armatureDisplay.x;
            if (localX < -150.0)
                _this._replaceDisplay(-1);
            else if (localX > 150.0)
                _this._replaceDisplay(1);
            else
                _this._replaceDisplay(0);
        });
        //
        this.createText("Touch screen left / center / right to replace slot display.");
    };
    ReplaceSlotDisplay.prototype._replaceDisplay = function (type) {
        if (type === -1) {
            this._rightWeaponIndex++;
            this._rightWeaponIndex %= ReplaceSlotDisplay.WEAPON_RIGHT_LIST.length;
            var displayName = ReplaceSlotDisplay.WEAPON_RIGHT_LIST[this._rightWeaponIndex];
            this._factory.replaceSlotDisplay("weapon_1004", "weapon", "weapon_r", displayName, this._armatureDisplay.armature.getSlot("weapon_hand_r"));
        }
        else if (type === 1) {
            this._leftWeaponIndex++;
            this._leftWeaponIndex %= 5;
            this._armatureDisplay.armature.getSlot("weapon_hand_l").displayIndex = this._leftWeaponIndex;
        }
        else {
            var logoSlot = this._armatureDisplay.armature.getSlot("logo");
            if (logoSlot.display === this._logoText) {
                logoSlot.display = logoSlot.rawDisplay;
            }
            else {
                if (!this._logoText) {
                    // mix skew component into Text class (also if you want to use some customized display object you must mix skew component into it, too)
                    dragonBones.phaser.util.extendSkew(Phaser.GameObjects.Text);
                    var style = { fontSize: 30, color: "#FFFFFF", align: "center" };
                    this._logoText = this.add.text(0.0, 0.0, "Core Element", style);
                    this._logoText.setPipeline("PhaserTextureTintPipeline"); // and use this customized pipeline to support skew
                    this._logoText.setOrigin(.5, .5);
                }
                logoSlot.display = this._logoText;
            }
        }
    };
    ReplaceSlotDisplay.WEAPON_RIGHT_LIST = ["weapon_1004_r", "weapon_1004b_r", "weapon_1004c_r", "weapon_1004d_r", "weapon_1004e_r"];
    return ReplaceSlotDisplay;
}(BaseDemo));
