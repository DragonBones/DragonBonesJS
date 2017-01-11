namespace demosPixi {
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
        protected _onStart(): void {
            // Load data.
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/DragonBoy/DragonBoy.json")
                .add("textureDataA", "./resource/assets/DragonBoy/DragonBoy_texture_1.json")
                .add("textureA", "./resource/assets/DragonBoy/DragonBoy_texture_1.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        }

        private _loadComplateHandler(loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>): void {
            dragonBones.PixiFactory.factory.parseDragonBonesData(resources["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(resources["textureDataA"].data, resources["textureA"].texture);

            const armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.animation.play("walk");
            this._stage.addChild(armatureDisplay);

            armatureDisplay.x = this._renderer.width * 0.5;
            armatureDisplay.y = this._renderer.height * 0.5 + 100;
        }
    }
}