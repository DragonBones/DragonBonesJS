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
        this.mask                = false;
        this.transformConstraint = false;
        this.physics             = false;
        this.vine                = false;
        this.test                = false;
        this.coin                = false;
        this.path_rigging        = true;

        if (this.mask) {
            this._resources.push("resource/debug/dragonbones-mask.json");
            this._resources.push("resource/debug/dragonbones-mask_tex.json");
            this._resources.push("resource/debug/dragonbones-mask_tex.png");
        }
        if (this.transformConstraint) {
            this._resources.push("resource/debug/dragonbones-trans.json");
        }
        if (this.physics) {
            this._resources.push("resource/debug/dragonbones-physics.json");
        }
        if (this.vine) {
            this._resources.push("resource/debug/vine.json");
            this._resources.push("resource/debug/vine_tex.json");
            this._resources.push("resource/debug/vine_tex.png");
        }
        if (this.test) {
            this._resources.push("resource/debug/test.json");
            this._resources.push("resource/debug/test_tex.json");
            this._resources.push("resource/debug/test_tex.png");
        }
        if (this.coin) {
            this._resources.push("resource/debug/coin.json");
            this._resources.push("resource/debug/coin_tex.json");
            this._resources.push("resource/debug/coin_tex.png");
        }
        if (this.path_rigging) {
            this._resources.push("resource/debug/path-rigging.json");
            this._resources.push("resource/debug/path-rigging_tex.json");
            this._resources.push("resource/debug/path-rigging_tex.png");
        }
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        if(this.mask) {
            factory.parseDragonBonesData(this._pixiResources["resource/debug/dragonbones-mask.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/debug/dragonbones-mask_tex.json"], 
                                          this._pixiResources["resource/debug/dragonbones-mask_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("armature1");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200.0;
            armatureDisplay.y = -100.0;
            armatureDisplay.scale.set(0.3);
            this.addChild(armatureDisplay);
        }
        if (this.transformConstraint) {
            factory.parseDragonBonesData(this._pixiResources["resource/debug/dragonbones-trans.json"]);
            // factory.parseTextureAtlasData(this._pixiResources["resource/debug/dragonbones-mask_tex.json"], 
            //                               this._pixiResources["resource/debug/dragonbones-mask_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("newArmature");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200.0;
            armatureDisplay.y = -100.0;
            armatureDisplay.scale.set(0.3);
            this.addChild(armatureDisplay);  
        }
        if (this.physics) {
            factory.parseDragonBonesData(this._pixiResources["resource/debug/dragonbones-physics.json"]);
            // factory.parseTextureAtlasData(this._pixiResources["resource/debug/dragonbones-mask_tex.json"], 
            //                               this._pixiResources["resource/debug/dragonbones-mask_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("armature1");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200.0;
            armatureDisplay.y = -100.0;
            armatureDisplay.scale.set(0.6);
            this.addChild(armatureDisplay);  
        }
        if (this.vine) {
            console.log('vine', )
            factory.parseDragonBonesData(this._pixiResources["resource/debug/vine.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/debug/vine_tex.json"], 
                                          this._pixiResources["resource/debug/vine_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("vine");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200.0;
            armatureDisplay.y = 200.0;
            armatureDisplay.scale.set(0.3);
            this.addChild(armatureDisplay);
        }
        if (this.test) {
            console.log('test', )
            factory.parseDragonBonesData(this._pixiResources["resource/debug/test.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/debug/test_tex.json"], 
                                          this._pixiResources["resource/debug/test_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("newArmature");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200.0;
            armatureDisplay.y = 200.0;
            armatureDisplay.scale.set(0.3);
            this.addChild(armatureDisplay);
        }
        if (this.coin) {
            console.log('coin', )
            factory.parseDragonBonesData(this._pixiResources["resource/debug/coin.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/debug/coin_tex.json"], 
                                          this._pixiResources["resource/debug/coin_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("coin");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200.0;
            armatureDisplay.y = 200.0;
            armatureDisplay.scale.set(0.3);
            this.addChild(armatureDisplay);
        }
        if (this.path_rigging) {
            console.log('path_rigging', )
            factory.parseDragonBonesData(this._pixiResources["resource/debug/path-rigging.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/debug/path-rigging_tex.json"], 
                                          this._pixiResources["resource/debug/path-rigging_tex.png"]);
            factory.pixiApp = this;
            const armatureDisplay = factory.buildArmatureDisplay("newArmature");
            armatureDisplay.debugDraw = true;
            armatureDisplay.animation.play("newAnimation", 1);
            armatureDisplay.x = -200;
            armatureDisplay.y = 200
            armatureDisplay.scale.set(0.55);
            this.addChild(armatureDisplay);
        }
       
    }
}
