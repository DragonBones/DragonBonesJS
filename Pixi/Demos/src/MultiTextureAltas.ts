class MultiTextureAltas extends BaseDemo {
    private _armatureDisplayA: dragonBones.PixiArmatureDisplay;
    private _armatureDisplayB: dragonBones.PixiArmatureDisplay;
    private _armatureDisplayC: dragonBones.PixiArmatureDisplay;
    private _armatureDisplayD: dragonBones.PixiArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/effect/effect_ske.json",
            "resource/effect/effect_tex.json",
            "resource/effect/effect_tex.png",
            "resource/effect/effect_sd_tex.json",
            "resource/effect/effect_sd_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/effect/effect_ske.json"].data, "hd", 1.0);
        factory.parseDragonBonesData(this._pixiResources["resource/effect/effect_ske.json"].data, "sd", 0.5);
        factory.parseTextureAtlasData(this._pixiResources["resource/effect/effect_tex.json"].data, this._pixiResources["resource/effect/effect_tex.png"].texture, "hd", 1.0);
        factory.parseTextureAtlasData(this._pixiResources["resource/effect/effect_sd_tex.json"].data, this._pixiResources["resource/effect/effect_sd_tex.png"].texture, "sd", 2.0);

        this._armatureDisplayA = factory.buildArmatureDisplay("flower", "hd", null, "hd"); // HD Armature and HD TextureAtlas.
        this._armatureDisplayB = factory.buildArmatureDisplay("flower", "hd", null, "sd"); // HD Armature and SD TextureAtlas.
        this._armatureDisplayC = factory.buildArmatureDisplay("flower", "sd", null, "hd"); // SD Armature and HD TextureAtlas.
        this._armatureDisplayD = factory.buildArmatureDisplay("flower", "sd", null, "sd"); // SD Armature and SD TextureAtlas.

        this._armatureDisplayA.x = -250.0;
        this._armatureDisplayA.y = 0.0;
        this._armatureDisplayB.x = 250.0;
        this._armatureDisplayB.y = 0.0;
        this._armatureDisplayC.x = -250.0;
        this._armatureDisplayC.y = 200.0;
        this._armatureDisplayD.x = 250.0;
        this._armatureDisplayD.y = 200.0;

        this.addChild(this._armatureDisplayA);
        this.addChild(this._armatureDisplayB);
        this.addChild(this._armatureDisplayC);
        this.addChild(this._armatureDisplayD);
        //
        this.interactive = true;
        const touchHandler = (event: PIXI.interaction.InteractionEvent) => {
            this._changeAnimation();
        };
        this.addListener("touchstart", touchHandler, this);
        this.addListener("mousedown", touchHandler, this);
        //
        this._changeAnimation();
    }

    private _changeAnimation(): void {
        let animationName = this._armatureDisplayA.animation.lastAnimationName;
        if (animationName) {
            const animationNames = this._armatureDisplayA.animation.animationNames;
            const animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureDisplayA.animation.play(animationNames[animationIndex]).playTimes = 0;
        }
        else {
            this._armatureDisplayA.animation.play().playTimes = 0;
        }

        animationName = this._armatureDisplayA.animation.lastAnimationName;

        this._armatureDisplayB.animation.play(animationName).playTimes = 0;
        this._armatureDisplayC.animation.play(animationName).playTimes = 0;
        this._armatureDisplayD.animation.play(animationName).playTimes = 0;
    }
}