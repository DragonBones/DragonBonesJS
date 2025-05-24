"use strict";
class DragonBonesEvent extends BaseDemo {
    constructor() {
        super();
        this._resources.push("resource/mecha_1004d/mecha_1004d_ske.json", "resource/mecha_1004d/mecha_1004d_tex.json", "resource/mecha_1004d/mecha_1004d_tex.png");
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_1004d/mecha_1004d_ske.json"]);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1004d/mecha_1004d_tex.json"], this._pixiResources["resource/mecha_1004d/mecha_1004d_tex.png"]);
        factory.soundEventManager.on(dragonBones.EventObject.SOUND_EVENT, this._soundEventHandler, this);
        this._armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.on(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 100.0;
        this.addChild(this._armatureDisplay);
        //
        this.interactive = true;
        const touchHandler = () => {
            this._armatureDisplay.animation.fadeIn("skill_03", 0.2);
        };
        this.addListener("mousedown", touchHandler, this);
        this.addListener("touchstart", touchHandler, this);
        //
        this.createText("Touch to play animation.");
    }
    _soundEventHandler(event) {
        console.log('play sound:', event.name);
    }
    _animationEventHandler(event) {
        if (event.animationState.name === "skill_03") {
            this._armatureDisplay.animation.fadeIn("walk", 0.2);
        }
    }
}
