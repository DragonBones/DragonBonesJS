class AnimationCopyTest extends BaseTest {

    private _armatureDisplayA: dragonBones.EgretArmatureDisplay;
    private _armatureDisplayB: dragonBones.EgretArmatureDisplay;
    private _armatureDisplayC: dragonBones.EgretArmatureDisplay;
    private _armatureDisplayD: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/core_element/mecha_2903_ske.json",
            "resource/assets/core_element/mecha_2903_tex.json",
            "resource/assets/core_element/mecha_2903_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/assets/core_element/mecha_2903_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/assets/core_element/mecha_2903_tex.json"), RES.getRes("resource/assets/core_element/mecha_2903_tex.png"));

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

        this._armatureDisplayA.x = this.stage.stageWidth * 0.5 - 350;
        this._armatureDisplayA.y = this.stage.stageHeight * 0.5 + 200.0;
        this._armatureDisplayB.x = this.stage.stageWidth * 0.5;
        this._armatureDisplayB.y = this.stage.stageHeight * 0.5 + 200.0;
        this._armatureDisplayC.x = this.stage.stageWidth * 0.5 + 350;
        this._armatureDisplayC.y = this.stage.stageHeight * 0.5 + 200.0;
        this._armatureDisplayD.x = this.stage.stageWidth * 0.5;
        this._armatureDisplayD.y = this.stage.stageHeight * 0.5 - 50.0;

        this.stage.addEventListener(
            egret.TouchEvent.TOUCH_END,
            () => {
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
            },
            this
        );

        const text = new egret.TextField();
        text.size = 20;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.text = "Click to change animation.";
        text.width = this.stage.stageWidth;
        text.x = 0;
        text.y = this.stage.stageHeight - 60;
        this.addChild(text);
    }
}