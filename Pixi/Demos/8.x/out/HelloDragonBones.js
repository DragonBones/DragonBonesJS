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
        // this._resources.push(
        //     "resource/debug/loongbones-web/loongbones-web.json",
        //     // "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin",
        //     "resource/debug/loongbones-web/loongbones-web_tex.json",
        //     "resource/debug/loongbones-web/loongbones-web_tex.png"
        // );
        this._resources.push("resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json", 
        // "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin",
        "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json", "resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png");
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json"]);
        // factory.parseDragonBonesData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin"]);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json"], this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png"]);
        const armatureDisplay = factory.buildArmatureDisplay("mecha_1002_101d", "mecha_1002_101d_show");
        // factory.parseDragonBonesData(this._pixiResources["resource/debug/loongbones-web/loongbones-web.json"]);
        // // factory.parseDragonBonesData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin"]);
        // factory.parseTextureAtlasData(this._pixiResources["resource/debug/loongbones-web/loongbones-web_tex.json"], this._pixiResources["resource/debug/loongbones-web/loongbones-web_tex.png"]);
        // const armatureDisplay = factory.buildArmatureDisplay("newArmature");
        armatureDisplay.debugDraw = true;
        armatureDisplay.animation.play("idle", 0);
        // armatureDisplay.scale.set(0.3, 0.3);
        armatureDisplay.x = 0.0;
        armatureDisplay.y = 200.0;
        this.addChild(armatureDisplay);
    }
}
