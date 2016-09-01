namespace demosEgret {
    export class ReplaceSlotDisplayTest extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/ReplaceSlotDisplayTest.res.json";
        }

        private _displayIndex: number = 0;
        private _replaceDisplay: string[] = [
            // Replace normal display.
            "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
            // Replace mesh display.
            "meshA", "meshB", "mesh",
        ];

        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;

        protected createGameScene(): void {
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

            this._armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("MyArmature");
            this._armatureDisplay.x = this.stage.stageWidth * 0.5;
            this._armatureDisplay.y = this.stage.stageHeight * 0.5;
            this._armatureDisplay.animation.timeScale = 0.1;
            this._armatureDisplay.animation.play();
            this.addChild(this._armatureDisplay);

            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
        }

        private _touchHandler(event: egret.TouchEvent): void {
            this._displayIndex++;
            this._displayIndex %= this._replaceDisplay.length;

            const replaceDisplayName = this._replaceDisplay[this._displayIndex];

            if (replaceDisplayName.indexOf("mesh") >= 0) { // Replace mesh display.
                switch (replaceDisplayName) {
                    case "meshA":
                        // Normal to mesh.
                        dragonBones.EgretFactory.factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyMesh",
                            "meshA",
                            "weapon_1004_1",
                            this._armatureDisplay.armature.getSlot("weapon")
                        );

                        // Replace mesh texture. 
                        dragonBones.EgretFactory.factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyDisplay",
                            "ball",
                            "display0002",
                            this._armatureDisplay.armature.getSlot("mesh")
                        );
                        break;

                    case "meshB":
                        // Normal to mesh.
                        dragonBones.EgretFactory.factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyMesh",
                            "meshB",
                            "weapon_1004_1",
                            this._armatureDisplay.armature.getSlot("weapon")
                        );

                        // Replace mesh texture. 
                        dragonBones.EgretFactory.factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyDisplay",
                            "ball",
                            "display0003",
                            this._armatureDisplay.armature.getSlot("mesh")
                        );
                        break;

                    case "mesh":
                        // Back to normal.
                        dragonBones.EgretFactory.factory.replaceSlotDisplay(
                            "ReplaceSlotDisplay",
                            "MyMesh",
                            "mesh",
                            "weapon_1004_1",
                            this._armatureDisplay.armature.getSlot("weapon")
                        );

                        // Replace mesh texture. 
                        dragonBones.EgretFactory.factory.replaceSlotDisplay(
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
                dragonBones.EgretFactory.factory.replaceSlotDisplay(
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