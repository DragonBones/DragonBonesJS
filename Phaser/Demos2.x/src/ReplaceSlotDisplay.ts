class ReplaceSlotDisplay extends BaseDemo {
    private static readonly WEAPON_RIGHT_LIST: string[] = ["weapon_1004_r", "weapon_1004b_r", "weapon_1004c_r", "weapon_1004d_r", "weapon_1004e_r"];

    private _leftWeaponIndex: number = 0;
    private _rightWeaponIndex: number = 0;
    private readonly _factory: dragonBones.PhaserFactory = dragonBones.PhaserFactory.factory;
    private _armatureDisplay: dragonBones.PhaserArmatureDisplay;
    private _logoText: Phaser.Text;

    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            "resource/mecha_1004d_show/mecha_1004d_show_ske.json",
            "resource/mecha_1004d_show/mecha_1004d_show_tex.json",
            "resource/mecha_1004d_show/mecha_1004d_show_tex.png",
            "resource/weapon_1004_show/weapon_1004_show_ske.json",
            "resource/weapon_1004_show/weapon_1004_show_tex.json",
            "resource/weapon_1004_show/weapon_1004_show_tex.png"
        );
    }

    protected _onStart(): void {
        this._factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_1004d_show/mecha_1004d_show_ske.json", Phaser.Cache.JSON).data);
        this._factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/mecha_1004d_show/mecha_1004d_show_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/mecha_1004d_show/mecha_1004d_show_tex.png", true) as any).base
        );
        this._factory.parseDragonBonesData(this.game.cache.getItem("resource/weapon_1004_show/weapon_1004_show_ske.json", Phaser.Cache.JSON).data);
        this._factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/weapon_1004_show/weapon_1004_show_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/weapon_1004_show/weapon_1004_show_tex.png", true) as any).base
        );
        //
        this._armatureDisplay = this._factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.animation.play();
        //
        this._armatureDisplay.x = 100.0;
        this._armatureDisplay.y = 200.0;
        this.addChild(this._armatureDisplay);
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(() => {
            const localX = this.game.input.x - this.x;
            if (localX < -150.0) {
                this._replaceDisplay(-1);
            }
            else if (localX > 150.0) {
                this._replaceDisplay(1);
            }
            else {
                this._replaceDisplay(0);
            }
        }, this);
        //
        this.createText("Touch screen left / center / right to relace slot display.");
    }

    private _replaceDisplay(type: number): void {
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
                    const style = { font: "14px", fill: "#FFFFFF", align: "center" };
                    this._logoText = this.game.add.text(0.0, 0.0, "Core Element", style);
                    this._logoText.pivot.x = this._logoText.width * 0.5;
                    this._logoText.pivot.y = this._logoText.height * 0.5;
                }
                logoSlot.display = this._logoText;
            }
        }
    }
}