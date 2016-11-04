namespace demosEgret {
    /**
     * How to use
     * 1. Load data.
     * 2. factory.parseDragonBonesData();
     *    factory.parseTextureAtlasData();
     * 3. armatureDisplay = factory.buildArmatureDisplay("armatureName");
     * 4. armatureDisplay.animation.play("animationName");
     * 5. addChild(armatureDisplay);
     */
    export class HelloDragonBones extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/HelloDragonBones.res.json";
        }

        /** 
         * Init.
         */
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