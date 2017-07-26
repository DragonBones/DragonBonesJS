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
class HelloDragonBones extends BaseTest {
    protected _onStart(): void {
        PIXI.loader
            // .add("dragonBonesData", "./resource/assets/dragon_boy_ske.json")
            .add("dragonBonesData", "./resource/assets/dragon_boy_ske.dbbin", { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER } as any)
            .add("textureData", "./resource/assets/dragon_boy_tex.json")
            .add("texture", "./resource/assets/dragon_boy_tex.png");

        PIXI.loader.once("complete", (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) => {
            const factory = dragonBones.PixiFactory.factory;
            factory.parseDragonBonesData(resources["dragonBonesData"].data);
            factory.parseTextureAtlasData(resources["textureData"].data, resources["texture"].texture);

            const armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.animation.play("walk");
            this.stage.addChild(armatureDisplay);

            armatureDisplay.x = this._renderer.width * 0.5;
            armatureDisplay.y = this._renderer.height * 0.5 + 100;

            //
            this._startRenderTick();
        });

        PIXI.loader.load();
    }
}