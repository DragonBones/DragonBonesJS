@cc._decorator.ccclass
export default class ReplaceSlotDisplay extends cc.Component {
    private static readonly WEAPON_RIGHT_LIST: string[] = ["weapon_1004_r", "weapon_1004b_r", "weapon_1004c_r", "weapon_1004d_r", "weapon_1004e_r"];

    private _leftWeaponIndex: number = 0;
    private _rightWeaponIndex: number = 0;
    private _armatureComponent: dragonBones.CocosArmatureComponent;
    private _logoText: cc.Node;

    start() {
        const resources = [
            cc.url.raw("resources/mecha_1004d_show/mecha_1004d_show_ske.json"),
            cc.url.raw("resources/mecha_1004d_show/mecha_1004d_show_tex.json"),
            cc.url.raw("resources/mecha_1004d_show/mecha_1004d_show_tex.png"),
            cc.url.raw("resources/weapon_1004_show/weapon_1004_show_ske.json"),
            cc.url.raw("resources/weapon_1004_show/weapon_1004_show_tex.json"),
            cc.url.raw("resources/weapon_1004_show/weapon_1004_show_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            factory.parseDragonBonesData(cc.loader.getRes(resources[3]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[4]), cc.loader.getRes(resources[5]));
            //
            this._armatureComponent = factory.buildArmatureComponent("mecha_1004d");
            this._armatureComponent.animation.play();
            //
            this._armatureComponent.node.x = 100.0;
            this._armatureComponent.node.y = -200.0;
            this.node.addChild(this._armatureComponent.node);
            //
            this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                const localX = event.getLocationX() - this.node.x;
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
        });
    }

    private _replaceDisplay(type: number): void {
        const factory = dragonBones.CocosFactory.factory;
        if (type === -1) {
            this._rightWeaponIndex++;
            this._rightWeaponIndex %= ReplaceSlotDisplay.WEAPON_RIGHT_LIST.length;
            const displayName = ReplaceSlotDisplay.WEAPON_RIGHT_LIST[this._rightWeaponIndex];
            factory.replaceSlotDisplay("weapon_1004_show", "weapon", "weapon_r", displayName, this._armatureComponent.armature.getSlot("weapon_hand_r"));
        }
        else if (type === 1) {
            this._leftWeaponIndex++;
            this._leftWeaponIndex %= 5;
            this._armatureComponent.armature.getSlot("weapon_hand_l").displayIndex = this._leftWeaponIndex;
        }
        else {
            const logoSlot = this._armatureComponent.armature.getSlot("logo");

            if (logoSlot.display === this._logoText) {
                logoSlot.display = logoSlot.rawDisplay;
            }
            else {
                if (!this._logoText) {
                    this._logoText = new cc.Node();
                    const label = this._logoText.addComponent(cc.Label);
                    label.string = "Core Element";
                    this._logoText.anchorX = 0.5;
                    this._logoText.anchorY = 0.5;
                }

                logoSlot.display = this._logoText;
            }
        }
    }
}
