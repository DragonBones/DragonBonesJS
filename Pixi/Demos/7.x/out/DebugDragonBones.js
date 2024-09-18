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
class DebugDragonBones extends BaseDemo {
    constructor() {
        super();
        this._resources.push("resource/debug/dragonbones-web.json");
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/debug/dragonbones-web.json"]);
        // factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.json"], this._pixiResources["resource/mecha_1002_101d_show/mecha_1002_101d_show_tex.png"]);
        const armatureDisplay = factory.buildArmatureDisplay("armature1");
        armatureDisplay.debugDraw = true;
        armatureDisplay.animation.play("新建动画");
        armatureDisplay.x = -200.0;
        armatureDisplay.y = 100.0;
        this.addChild(armatureDisplay);
    }
}
