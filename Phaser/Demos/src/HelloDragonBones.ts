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
class HelloDragonBones extends BaseDemo {
    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            // "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json",
            "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin",
            "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json",
            "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        // factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json", Phaser.Cache.JSON).data);
        factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin", Phaser.Cache.BINARY));
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png", true) as any).base
        );

        const armatureDisplay = factory.buildArmatureDisplay("mecha_1002_101d", "mecha_1002_101d_show");
        armatureDisplay.animation.play("idle");

        armatureDisplay.x = 0.0;
        armatureDisplay.y = 200.0;
        this.addChild(armatureDisplay);
    }
}