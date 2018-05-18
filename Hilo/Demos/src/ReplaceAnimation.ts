class ReplaceAnimation extends BaseTest {
    private _armatureDisplayA: dragonBones.HiloArmatureDisplay;
    private _armatureDisplayB: dragonBones.HiloArmatureDisplay;
    private _armatureDisplayC: dragonBones.HiloArmatureDisplay;
    private _armatureDisplayD: dragonBones.HiloArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/core_element/mecha_2903_ske.json",
            "resource/assets/core_element/mecha_2903_tex.json",
            "resource/assets/core_element/mecha_2903_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.HiloFactory.factory;
        factory.parseDragonBonesData(this._hiloResources["resource/assets/core_element/mecha_2903_ske.json"]);
        factory.parseTextureAtlasData(this._hiloResources["resource/assets/core_element/mecha_2903_tex.json"], this._hiloResources["resource/assets/core_element/mecha_2903_tex.png"]);
        //
        this._armatureDisplayA = factory.buildArmatureDisplay("mecha_2903");
        this._armatureDisplayB = factory.buildArmatureDisplay("mecha_2903b");
        this._armatureDisplayC = factory.buildArmatureDisplay("mecha_2903c");
        this._armatureDisplayD = factory.buildArmatureDisplay("mecha_2903d");

        const sourceArmatureData = factory.getArmatureData("mecha_2903d");
        factory.replaceAnimation(this._armatureDisplayA.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayB.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayC.armature, sourceArmatureData);

        this.addChild(this._armatureDisplayA);
        this.addChild(this._armatureDisplayB);
        this.addChild(this._armatureDisplayC);
        this.addChild(this._armatureDisplayD);

        this._armatureDisplayA.x = this.stageWidth * 0.5 - 350;
        this._armatureDisplayA.y = this.stageHeight * 0.5 + 200.0;
        this._armatureDisplayB.x = this.stageWidth * 0.5;
        this._armatureDisplayB.y = this.stageHeight * 0.5 + 200.0;
        this._armatureDisplayC.x = this.stageWidth * 0.5 + 350;
        this._armatureDisplayC.y = this.stageHeight * 0.5 + 200.0;
        this._armatureDisplayD.x = this.stageWidth * 0.5;
        this._armatureDisplayD.y = this.stageHeight * 0.5 - 50.0;
        //
        this.on((Hilo.event as any).POINTER_START, () => {
            this._replaceAnimation();
        }, false);
        //
        this.createText("Click to change animation.");
    }

    private _replaceAnimation(): void {
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