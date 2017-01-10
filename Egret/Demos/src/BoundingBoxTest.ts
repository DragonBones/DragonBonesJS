namespace demosEgret {
    export class BoundingBoxTest extends BaseTest {
        private _tester: BoundingBoxTester = new BoundingBoxTester();
        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;

        public constructor() {
            super();

            this._resourceGroup = "boundingBoxTest";
            this._resourceConfigURL = "resource/Test.res.json";
        }

        protected _onStart(): void {
            dragonBones.DragonBones.debugDraw = true;

            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes(this._resourceGroup));
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes(this._resourceGroup + "_texture_config"), RES.getRes(this._resourceGroup + "_texture"));

            const armatureName = "DragonBoy";
            const animationName = "walk";

            this._armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay(armatureName);
            this._armatureDisplay.animation.play(animationName);
            this.addChild(this._armatureDisplay);

            this._armatureDisplay.animation.timeScale = 0.1;
            this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = 2;

            this._armatureDisplay.x = this.stage.stageWidth * 0.5;
            this._armatureDisplay.y = this.stage.stageHeight * 0.5 + 100;

            enableDrag(this._armatureDisplay);

            //
            this._tester.armatureDisplay = this._armatureDisplay;
            this._tester.x = 200;
            this._tester.y = 200;
            this.addChild(this._tester);
        }
    }
}