"use strict";
class ReplaceSlotDisplay extends BaseDemo {
    constructor() {
        super();
        this._leftWeaponIndex = 0;
        this._rightWeaponIndex = 0;
        this._factory = dragonBones.PixiFactory.factory;
        this._resources.push("resource/mecha_1004d_show/mecha_1004d_show_ske.json", "resource/mecha_1004d_show/mecha_1004d_show_tex.json", "resource/mecha_1004d_show/mecha_1004d_show_tex.png", "resource/weapon_1004_show/weapon_1004_show_ske.json", "resource/weapon_1004_show/weapon_1004_show_tex.json", "resource/weapon_1004_show/weapon_1004_show_tex.png");
    }
    _onStart() {
        this._factory.parseDragonBonesData(this._pixiResources["resource/mecha_1004d_show/mecha_1004d_show_ske.json"]);
        this._factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1004d_show/mecha_1004d_show_tex.json"], this._pixiResources["resource/mecha_1004d_show/mecha_1004d_show_tex.png"]);
        this._factory.parseDragonBonesData(this._pixiResources["resource/weapon_1004_show/weapon_1004_show_ske.json"]);
        this._factory.parseTextureAtlasData(this._pixiResources["resource/weapon_1004_show/weapon_1004_show_tex.json"], this._pixiResources["resource/weapon_1004_show/weapon_1004_show_tex.png"]);
        //
        this._armatureDisplay = this._factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.animation.play();
        //
        this._armatureDisplay.x = 100.0;
        this._armatureDisplay.y = 200.0;
        this.addChild(this._armatureDisplay);
        //
        this.interactive = true;
        const touchHandler = (event) => {
            const localX = event.data.global.x - this.x;
            if (localX < -150.0) {
                this._replaceDisplay(-1);
            }
            else if (localX > 150.0) {
                this._replaceDisplay(1);
            }
            else {
                this._replaceDisplay(0);
            }
        };
        this.addListener("touchstart", touchHandler, this);
        this.addListener("mousedown", touchHandler, this);
        //
        this.createText("Touch screen left / center / right to relace slot display.");
    }
    _replaceDisplay(type) {
        if (type === -1) {
            this._rightWeaponIndex++;
            this._rightWeaponIndex %= ReplaceSlotDisplay.WEAPON_RIGHT_LIST.length;
            const displayName = ReplaceSlotDisplay.WEAPON_RIGHT_LIST[this._rightWeaponIndex];
            this._factory.replaceSlotDisplay("weapon_1004_show", "weapon", "weapon_r", displayName, this._armatureDisplay.armature.getSlot("weapon_hand_r"));
        }
        else if (type === 1) {
            this._leftWeaponIndex++;
            this._leftWeaponIndex %= 5;
            this._armatureDisplay.armature.getSlot("weapon_hand_l").displayIndex = this._leftWeaponIndex;
        }
        else {
            const logoSlot = this._armatureDisplay.armature.getSlot("logo");
            if (logoSlot.display === this._logoText) {
                logoSlot.display = logoSlot.rawDisplay;
            }
            else {
                if (!this._logoText) {
                    this._logoText = new PIXI.Text();
                    this._logoText.text = "Core Element";
                    this._logoText.pivot.x = this._logoText.width * 0.5;
                    this._logoText.pivot.y = this._logoText.height * 0.5;
                }
                logoSlot.display = this._logoText;
            }
        }
    }
}
ReplaceSlotDisplay.WEAPON_RIGHT_LIST = ["weapon_1004_r", "weapon_1004b_r", "weapon_1004c_r", "weapon_1004d_r", "weapon_1004e_r"];
