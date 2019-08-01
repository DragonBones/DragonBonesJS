class ReplaceSlotDisplay extends BaseDemo {
    private static readonly WEAPON_RIGHT_LIST: string[] = ["weapon_1004_r", "weapon_1004b_r", "weapon_1004c_r", "weapon_1004d_r", "weapon_1004e_r"];

    private _leftWeaponIndex: number = 0;
    private _rightWeaponIndex: number = 0;
    private _factory: dragonBones.phaser.Factory = null;
    private _armatureDisplay: dragonBones.phaser.display.ArmatureDisplay;
    private _logoText: Phaser.GameObjects.Text;

    public constructor() {
        super("ReplaceSlotDisplay");
    }

    preload(): void {
        super.preload();

        this.load.dragonbone(
            "mecha_1004d",
            "resource/mecha_1004d_show/mecha_1004d_show_tex.png",
            "resource/mecha_1004d_show/mecha_1004d_show_tex.json",
            "resource/mecha_1004d_show/mecha_1004d_show_ske.json"
        );
        this.load.dragonbone(
            "weapon_1004",
            "resource/weapon_1004_show/weapon_1004_show_tex.png",
            "resource/weapon_1004_show/weapon_1004_show_tex.json",
            "resource/weapon_1004_show/weapon_1004_show_ske.json"
        );
    }

    create(): void {
        super.create();

        this._factory = this.dragonbone.factory;

        this._armatureDisplay = this.add.armature("mecha_1004d", "mecha_1004d");
        this._armatureDisplay.animation.play();

        this.add.armature("weapon", "weapon_1004");
        //
        this._armatureDisplay.x = this.cameras.main.centerX + 100.0;
        this._armatureDisplay.y = this.cameras.main.centerY + 200.0;
        //
        this.input.on('pointerdown', () => {
            const localX = this.input.x - this._armatureDisplay.x;
            if (localX < -150.0)
                this._replaceDisplay(-1);
            else if (localX > 150.0)
                this._replaceDisplay(1);
            else
                this._replaceDisplay(0);
        });
        //
        this.createText("Touch screen left / center / right to replace slot display.");
    }

    private _replaceDisplay(type: number): void {
        if (type === -1) {
            this._rightWeaponIndex++;
            this._rightWeaponIndex %= ReplaceSlotDisplay.WEAPON_RIGHT_LIST.length;
            const displayName = ReplaceSlotDisplay.WEAPON_RIGHT_LIST[this._rightWeaponIndex];
            this._factory.replaceSlotDisplay("weapon_1004", "weapon", "weapon_r", displayName, this._armatureDisplay.armature.getSlot("weapon_hand_r"));
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
                    // mix skew component into Text class (also if you want to use some customized display object you must mix skew component into it, too)
                    dragonBones.phaser.util.extendSkew(Phaser.GameObjects.Text);

                    const style = { fontSize: 30, color: "#FFFFFF", align: "center" };
                    this._logoText = this.add.text(0.0, 0.0, "Core Element", style);

                    this._logoText.setPipeline("PhaserTextureTintPipeline");  // and use this customized pipeline to support skew

                    this._logoText.setOrigin(.5, .5);
                }
                logoSlot.display = this._logoText;
            }
        }
    }
}
