class AnimationCopy extends BaseTest {
    private _armatureDisplayA: dragonBones.PixiArmatureDisplay;
    private _armatureDisplayB: dragonBones.PixiArmatureDisplay;
    private _armatureDisplayC: dragonBones.PixiArmatureDisplay;
    private _armatureDisplayD: dragonBones.PixiArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/core_element/mecha_2903_ske.json",
            "resource/assets/core_element/mecha_2903_tex.json",
            "resource/assets/core_element/mecha_2903_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/assets/core_element/mecha_2903_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/assets/core_element/mecha_2903_tex.json"].data, this._pixiResources["resource/assets/core_element/mecha_2903_tex.png"].texture);

        this._armatureDisplayA = factory.buildArmatureDisplay("mecha_2903");
        this._armatureDisplayB = factory.buildArmatureDisplay("mecha_2903b");
        this._armatureDisplayC = factory.buildArmatureDisplay("mecha_2903c");
        this._armatureDisplayD = factory.buildArmatureDisplay("mecha_2903d");

        factory.copyAnimationsToArmature(this._armatureDisplayA.armature, "mecha_2903d");
        factory.copyAnimationsToArmature(this._armatureDisplayB.armature, "mecha_2903d");
        factory.copyAnimationsToArmature(this._armatureDisplayC.armature, "mecha_2903d");

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
        //
        const touchHandler = (event: PIXI.interaction.InteractionEvent): void => {
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
        };
        this.interactive = true;
        this.addListener("touchstart", touchHandler, this);
        this.addListener("mousedown", touchHandler, this);
        //
        this.createText("Click to change animation.");
    }
}