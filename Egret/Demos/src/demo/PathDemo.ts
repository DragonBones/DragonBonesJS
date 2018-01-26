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
class PathDemo extends BaseDemo {
    public constructor() {
        super();

        this._resources.push(
            // "resource/assets/dragon_boy_ske.json",
            "resource/vine/vine-pro_ske.json",
            "resource/vine/vine-pro_tex.json",
            "resource/vine/vine-pro_tex.png",
            "resource/Ubbie/Ubbie.json",
            "resource/Ubbie/texture.json",
            "resource/Ubbie/texture.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        // factory.parseDragonBonesData(RES.getRes("resource/assets/dragon_boy_ske.json"));
        factory.parseDragonBonesData(RES.getRes("resource/vine/vine-pro_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/vine/vine-pro_tex.json"), RES.getRes("resource/vine/vine-pro_tex.png"));

        // factory.parseDragonBonesData(RES.getRes("resource/Ubbie/Ubbie.json"));
        // factory.parseTextureAtlasData(RES.getRes("resource/Ubbie/texture.json"), RES.getRes("resource/Ubbie/texture.png"));

        // const armatureDisplay = factory.buildArmatureDisplay("ubbie");
        // armatureDisplay.animation.play("stand");

        const armatureDisplay = factory.buildArmatureDisplay("vine-pro");
        armatureDisplay.animation.play("grow");

        // armatureDisplay.x = this.stage.stageWidth * 0.5;
        // armatureDisplay.y = this.stage.stageHeight * 0.5;

        armatureDisplay.x -= 200.0;

        armatureDisplay.scaleX = armatureDisplay.scaleY = 0.5;
        this.addChild(armatureDisplay);
    }
}