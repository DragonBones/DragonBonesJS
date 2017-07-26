class ReplaceSlotDisplay extends BaseTest {

    private _displayIndex: number = 0;
    private readonly _replaceDisplays: string[] = [
        // Replace normal display.
        "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
        // Replace mesh display.
        "meshA", "meshB", "meshC",
    ];

    private readonly _factory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/replace_slot_display/main_ske.json",
            "resource/assets/replace_slot_display/main_tex.json",
            "resource/assets/replace_slot_display/main_tex.png",
            "resource/assets/replace_slot_display/replace_ske.json",
            "resource/assets/replace_slot_display/replace_tex.json",
            "resource/assets/replace_slot_display/replace_tex.png"
        );
    }

    protected _onStart(): void {
        this._factory.parseDragonBonesData(RES.getRes("resource/assets/replace_slot_display/main_ske.json"));
        this._factory.parseTextureAtlasData(RES.getRes("resource/assets/replace_slot_display/main_tex.json"), RES.getRes("resource/assets/replace_slot_display/main_tex.png"));
        this._factory.parseDragonBonesData(RES.getRes("resource/assets/replace_slot_display/replace_ske.json"));
        this._factory.parseTextureAtlasData(RES.getRes("resource/assets/replace_slot_display/replace_tex.json"), RES.getRes("resource/assets/replace_slot_display/replace_tex.png"));

        this._armatureDisplay = this._factory.buildArmatureDisplay("MyArmature");
        this._armatureDisplay.animation.timeScale = 0.1;
        this._armatureDisplay.animation.play();

        this._armatureDisplay.x = this.stage.stageWidth * 0.5;
        this._armatureDisplay.y = this.stage.stageHeight * 0.5;
        this.addChild(this._armatureDisplay);

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,
            (event: egret.TouchEvent): void => {
                this._replaceDisplay();
            },
            this
        );
    }

    private _replaceDisplay(): void {
        this._displayIndex = (this._displayIndex + 1) % this._replaceDisplays.length;

        const replaceDisplayName = this._replaceDisplays[this._displayIndex];

        if (replaceDisplayName.indexOf("mesh") >= 0) { // Replace mesh display.
            switch (replaceDisplayName) {
                case "meshA":
                    // Normal to mesh.
                    this._factory.replaceSlotDisplay(
                        "replace",
                        "MyMesh",
                        "meshA",
                        "weapon_1004_1",
                        this._armatureDisplay.armature.getSlot("weapon")
                    );

                    // Replace mesh texture. 
                    this._factory.replaceSlotDisplay(
                        "replace",
                        "MyDisplay",
                        "ball",
                        "display0002",
                        this._armatureDisplay.armature.getSlot("mesh")
                    );
                    break;

                case "meshB":
                    // Normal to mesh.
                    this._factory.replaceSlotDisplay(
                        "replace",
                        "MyMesh",
                        "meshB",
                        "weapon_1004_1",
                        this._armatureDisplay.armature.getSlot("weapon")
                    );

                    // Replace mesh texture. 
                    this._factory.replaceSlotDisplay(
                        "replace",
                        "MyDisplay",
                        "ball",
                        "display0003",
                        this._armatureDisplay.armature.getSlot("mesh")
                    );
                    break;

                case "meshC":
                    // Back to normal.
                    this._factory.replaceSlotDisplay(
                        "replace",
                        "MyMesh",
                        "mesh",
                        "weapon_1004_1",
                        this._armatureDisplay.armature.getSlot("weapon")
                    );

                    // Replace mesh texture. 
                    this._factory.replaceSlotDisplay(
                        "replace",
                        "MyDisplay",
                        "ball",
                        "display0005",
                        this._armatureDisplay.armature.getSlot("mesh")
                    );
                    break;
            }
        }
        else { // Replace normal display.
            this._factory.replaceSlotDisplay(
                "replace",
                "MyDisplay",
                "ball",
                replaceDisplayName,
                this._armatureDisplay.armature.getSlot("ball")
            );
        }
    }
}