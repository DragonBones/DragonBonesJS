namespace demosEgret {
    /**
     * How to use
     * 1. Load data.
     *
     * 2. ParseData.
     *  factory.parseDragonBonesData();
     *  factory.parseTextureAtlasData();
     *
     * 3. Build armature.
     *  armatureDisplay = factory.buildArmatureDisplay("armatureName");
     *
     * 4. Play animation.
     *  armatureDisplay.animation.play("animationName");
     *
     * 5. Add armature to stage.
     *  addChild(armatureDisplay);
     */
    export class HelloDragonBones extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/hello_dragonbones.res.json";
        }

        protected _onStart(): void {
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

            const armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.animation.play("walk");
            this.addChild(armatureDisplay);

            armatureDisplay.x = this.stage.stageWidth * 0.5;
            armatureDisplay.y = this.stage.stageHeight * 0.5 + 100;
        }
    }
}