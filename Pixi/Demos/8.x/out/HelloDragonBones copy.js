"use strict";
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
    constructor() {
        super();
        this._resources.push(
        // "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json",
        "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin", "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json", "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png");
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        console.log('skk', this._pixiResources);
        // factory.parseDragonBonesData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json"]);
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin"]);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json"], this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png"]);
        const armatureDisplay = factory.buildArmatureDisplay("mecha_1002_101d", "mecha_1002_101d_show");
        armatureDisplay.animation.play("idle");
        armatureDisplay.x = 0.0;
        armatureDisplay.y = 200.0;
        this.addChild(armatureDisplay);
    }
}
