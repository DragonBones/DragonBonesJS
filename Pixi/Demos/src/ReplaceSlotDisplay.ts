namespace demosPixi {
    export class ReplaceSlotDisplay extends BaseTest {
        private _displayIndex: number = 0;
        private _replaceDisplays: string[] = [
            // Replace normal display.
            "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
            // Replace mesh display.
            "meshA", "meshB", "mesh",
        ];

        private _factory: dragonBones.PixiFactory = dragonBones.PixiFactory.factory;
        private _armatureDisplay: dragonBones.PixiArmatureDisplay = null;

        protected _onStart(): void {
            // Load data.
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/ReplaceSlotDisplay/ReplaceSlotDisplay.json")
                .add("textureDataA", "./resource/assets/ReplaceSlotDisplay/texture.json")
                .add("textureA", "./resource/assets/ReplaceSlotDisplay/texture.png")
                .add("textureRP", "./resource/assets/ReplaceSlotDisplay/textureReplace.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        }

        private _loadComplateHandler(loader: PIXI.loaders.Loader, object: dragonBones.Map<PIXI.loaders.Resource>): void {
            this._factory.parseDragonBonesData(object["dragonBonesData"].data);
            this._factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);

            this._armatureDisplay = this._factory.buildArmatureDisplay("MyArmature");
            this._armatureDisplay.animation.timeScale = 0.1;
            this._armatureDisplay.animation.play();

            this._armatureDisplay.x = this._renderer.width * 0.5;
            this._armatureDisplay.y = this._renderer.height * 0.5;
            this._stage.addChild(this._armatureDisplay);

            const touchHandler = (event: PIXI.interaction.InteractionEvent): void => {
                this._replaceDisplay();
            };

            this._stage.interactive = true;
            this._stage.on("touchstart", touchHandler, this);
            this._stage.on("mousedown", touchHandler, this);

            // Replace armature texture.
            document.addEventListener("keydown", (event): void => {
                if (this._armatureDisplay.armature.replacedTexture) {
                    this._armatureDisplay.armature.replacedTexture = null;
                }
                else {
                    this._armatureDisplay.armature.replacedTexture = object["textureRP"].texture;
                }
            });
        }

        private _replaceDisplay(): void {
            this._displayIndex = (this._displayIndex + 1) % this._replaceDisplays.length;

            const replaceDisplayName = this._replaceDisplays[this._displayIndex];

            if (replaceDisplayName.indexOf("mesh") >= 0) { // Replace mesh display.
                switch (replaceDisplayName) {
                    case "meshA":
                        // Normal to mesh.
                        this._factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyMesh",
                            "meshA",
                            "weapon_1004_1",
                            this._armatureDisplay.armature.getSlot("weapon")
                        );

                        // Replace mesh texture. 
                        this._factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyDisplay",
                            "ball",
                            "display0002",
                            this._armatureDisplay.armature.getSlot("mesh")
                        );
                        break;

                    case "meshB":
                        // Normal to mesh.
                        this._factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyMesh",
                            "meshB",
                            "weapon_1004_1",
                            this._armatureDisplay.armature.getSlot("weapon")
                        );

                        // Replace mesh texture. 
                        this._factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyDisplay",
                            "ball",
                            "display0003",
                            this._armatureDisplay.armature.getSlot("mesh")
                        );
                        break;

                    case "mesh":
                        // Back to normal.
                        this._factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyMesh",
                            "mesh",
                            "weapon_1004_1",
                            this._armatureDisplay.armature.getSlot("weapon")
                        );

                        // Replace mesh texture. 
                        this._factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
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
                    "ReplaceSlotDisplay",
                    "MyDisplay",
                    "ball",
                    replaceDisplayName,
                    this._armatureDisplay.armature.getSlot("ball")
                );
            }
        }
    }
}