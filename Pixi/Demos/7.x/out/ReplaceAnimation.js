"use strict";
class ReplaceAnimation extends BaseDemo {
    constructor() {
        super();
        this._resources.push("resource/mecha_2903/mecha_2903_ske.json", "resource/mecha_2903/mecha_2903_tex.json", "resource/mecha_2903/mecha_2903_tex.png");
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_2903/mecha_2903_ske.json"]);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_2903/mecha_2903_tex.json"], this._pixiResources["resource/mecha_2903/mecha_2903_tex.png"]);
        this._armatureDisplayA = factory.buildArmatureDisplay("mecha_2903");
        this._armatureDisplayB = factory.buildArmatureDisplay("mecha_2903b");
        this._armatureDisplayC = factory.buildArmatureDisplay("mecha_2903c");
        this._armatureDisplayD = factory.buildArmatureDisplay("mecha_2903d");
        const sourceArmatureData = factory.getArmatureData("mecha_2903d");
        factory.replaceAnimation(this._armatureDisplayA.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayB.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayC.armature, sourceArmatureData);
        this.addChild(this._armatureDisplayD);
        this.addChild(this._armatureDisplayA);
        this.addChild(this._armatureDisplayB);
        this.addChild(this._armatureDisplayC);
        this._armatureDisplayA.x = 0.0 - 350.0;
        this._armatureDisplayA.y = 0.0 + 150.0;
        this._armatureDisplayB.x = 0.0;
        this._armatureDisplayB.y = 0.0 + 150.0;
        this._armatureDisplayC.x = 0.0 + 350.0;
        this._armatureDisplayC.y = 0.0 + 150.0;
        this._armatureDisplayD.x = 0.0;
        this._armatureDisplayD.y = 0.0 - 50.0;
        //
        this.interactive = true;
        const touchHandler = () => {
            this._changeAnimation();
        };
        this.addListener("touchstart", touchHandler, this);
        this.addListener("mousedown", touchHandler, this);
        //
        this.createText("Touch to change animation.");
    }
    _changeAnimation() {
        let animationName = this._armatureDisplayD.animation.lastAnimationName;
        if (animationName) {
            const animationNames = this._armatureDisplayD.animation.animationNames;
            const animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureDisplayD.animation.play(animationNames[animationIndex]);
        }
        else {
            this._armatureDisplayD.animation.play();
        }
        animationName = this._armatureDisplayD.animation.lastAnimationName;
        this._armatureDisplayA.animation.play(animationName);
        this._armatureDisplayB.animation.play(animationName);
        this._armatureDisplayC.animation.play(animationName);
    }
}
