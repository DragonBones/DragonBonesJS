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
    public constructor() {
        super();

        this._resources.push(
            // "resource/assets/dragon_boy_ske.json",
            "resource/assets/dragon_boy_ske.dbbin",
            "resource/assets/dragon_boy_tex.json",
            "resource/assets/dragon_boy_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.HiloFactory.factory;
        // factory.parseDragonBonesData(this._hiloResources["resource/assets/dragon_boy_ske.json"]);
        factory.parseDragonBonesData(this._hiloResources["resource/assets/dragon_boy_ske.dbbin"]);
        factory.parseTextureAtlasData(this._hiloResources["resource/assets/dragon_boy_tex.json"], this._hiloResources["resource/assets/dragon_boy_tex.png"]);

        const armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.animation.play("walk");

        armatureDisplay.x = this.stageWidth * 0.5;
        armatureDisplay.y = this.stageHeight * 0.5 + 100;
        this.addChild(armatureDisplay);
    }
}