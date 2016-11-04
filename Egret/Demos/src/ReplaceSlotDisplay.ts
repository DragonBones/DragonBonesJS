namespace demosEgret {
    export class ReplaceSlotDisplay extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/replaceSlotDisplay.res.json";
        }

        private _displayIndex: number = 0;
        private _replaceDisplays: string[] = [
            // Replace normal display.
            "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
            // Replace mesh display.
            "meshA", "meshB", "mesh",
        ];

        private _factory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;

        protected _onStart(): void {
            this._factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
            this._factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

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

            document.addEventListener(
                "keydown",
                (event: KeyboardEvent): void => {
                    if (this._armatureDisplay.armature.replacedTexture) {
                        this._armatureDisplay.armature.replacedTexture = null;
                    }
                    else {
                        this._armatureDisplay.armature.replacedTexture = RES.getRes("textureRP");
                    }
                }
            );
        }

        private _replaceDisplay(): void {
            this._displayIndex++;
            this._displayIndex %= this._replaceDisplays.length;

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