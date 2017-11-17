class ReplaceSlotDisplay extends BaseTest {
    private _displayIndex: number = 0;
    private readonly _replaceDisplays: string[] = [
        // Replace normal display.
        "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
        // Replace mesh display.
        "meshA", "meshB", "meshC",
    ];
    private readonly _factory: dragonBones.PhaserFactory = dragonBones.PhaserFactory.factory;
    private _armatureDisplay: dragonBones.PhaserArmatureDisplay;

    public constructor(game: Phaser.Game) {
        super(game);

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
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/assets/replace_slot_display/main_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/assets/replace_slot_display/main_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/assets/replace_slot_display/main_tex.png", true) as any).base
        );
        factory.parseDragonBonesData(this.game.cache.getItem("resource/assets/replace_slot_display/replace_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/assets/replace_slot_display/replace_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/assets/replace_slot_display/replace_tex.png", true) as any).base
        );
        //
        this._armatureDisplay = this._factory.buildArmatureDisplay("MyArmature");
        this._armatureDisplay.animation.timeScale = 0.1;
        this._armatureDisplay.animation.play();
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this.addChild(this._armatureDisplay);
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(() => {
            this._replaceDisplay();
        });
        this.createText("Click to replace slot display.");
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