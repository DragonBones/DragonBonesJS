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
            "resource/right_abcd/right_abcd_ske.json",
            "resource/right_abcd/right_abcd_tex.json",
            "resource/right_abcd/right_abcd_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/right_abcd/right_abcd_ske.json", Phaser.Cache.JSON).data);
        // factory.parseDragonBonesData(this.game.cache.getItem("resource/right_abcd/right_abcd_ske.dbbin", Phaser.Cache.BINARY));
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/right_abcd/right_abcd_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/right_abcd/right_abcd_tex.png", true) as any).base
        );

        const armatureDisplay = factory.buildArmatureDisplay("right_abcd", "right_abcd");
        armatureDisplay.animation.play("right_a");

        armatureDisplay.x = -1920 / 2;
        armatureDisplay.y = -1080 / 2;
        this.addChild(armatureDisplay);
    }
}