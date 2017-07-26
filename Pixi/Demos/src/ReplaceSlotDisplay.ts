class ReplaceSlotDisplay extends BaseTest {

    private _displayIndex: number = 0;
    private readonly _replaceDisplays: string[] = [
        // Replace normal display.
        "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
        // Replace mesh display.
        "meshA", "meshB", "meshC",
    ];

    private readonly _factory: dragonBones.PixiFactory = dragonBones.PixiFactory.factory;
    private _armatureDisplay: dragonBones.PixiArmatureDisplay;

    protected _onStart(): void {
        PIXI.loader
            .add("dragonBonesDataA", "./resource/assets/replace_slot_display/main_ske.json")
            .add("textureDataA", "./resource/assets/replace_slot_display/main_tex.json")
            .add("textureA", "./resource/assets/replace_slot_display/main_tex.png")
            .add("dragonBonesDataB", "./resource/assets/replace_slot_display/replace_ske.json")
            .add("textureDataB", "./resource/assets/replace_slot_display/replace_tex.json")
            .add("textureB", "./resource/assets/replace_slot_display/replace_tex.png");

        PIXI.loader.once("complete", (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) => {
            this._factory.parseDragonBonesData(resources["dragonBonesDataA"].data);
            this._factory.parseTextureAtlasData(resources["textureDataA"].data, resources["textureA"].texture);
            this._factory.parseDragonBonesData(resources["dragonBonesDataB"].data);
            this._factory.parseTextureAtlasData(resources["textureDataB"].data, resources["textureB"].texture);

            this._armatureDisplay = this._factory.buildArmatureDisplay("MyArmature");
            this._armatureDisplay.animation.timeScale = 0.1;
            this._armatureDisplay.animation.play();

            this._armatureDisplay.x = this.stage.width * 0.5;
            this._armatureDisplay.y = this.stage.height * 0.5;
            this.stage.addChild(this._armatureDisplay);

            const touchHandler = (event: PIXI.interaction.InteractionEvent): void => {
                this._replaceDisplay();
            };
            this.stage.interactive = true;
            this.stage.addListener("touchstart", touchHandler, this);
            this.stage.addListener("mousedown", touchHandler, this);

            //
            this._startRenderTick();
        });

        PIXI.loader.load();
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