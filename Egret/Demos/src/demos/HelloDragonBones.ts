namespace demosEgret {
    /**
     * How to use
     * 1. Load data.
     *
     * 2. Parse data.
     *    factory.parseDragonBonesData();
     *    factory.parseTextureAtlasData();
     *
     * 3. Build armature.
     *    armatureDisplay = factory.buildArmatureDisplay("armatureName");
     *
     * 4. Play animation.
     *    armatureDisplay.animation.play("animationName");
     *
     * 5. Add armature to stage.
     *    addChild(armatureDisplay);
     */
    export class HelloDragonBones extends BaseTest {
        public constructor() {
            super();

            //this._resourceConfigURL = "resource/hello_dragonbones.res.json";

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onStart, this);
        }

        protected _onStart(): void {
            //dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
            //dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

            const dbd = JSON.parse(document.getElementById("dbd").innerHTML);
            const dbtd = JSON.parse(document.getElementById("dbtd").innerHTML);
            const dbt = new egret.Texture();
            dbt.bitmapData = new egret.BitmapData(document.getElementById("dbt"));

            dragonBones.EgretFactory.factory.parseDragonBonesData(dbd);
            dragonBones.EgretFactory.factory.parseTextureAtlasData(dbtd, dbt);

            const armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.animation.play("walk");
            this.addChild(armatureDisplay);

            armatureDisplay.x = this.stage.stageWidth * 0.5;
            armatureDisplay.y = this.stage.stageHeight * 0.5 + 100;
        }
    }
}