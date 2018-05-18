class AnimationLayer extends BaseDemo {
    private _armatureDisplay: dragonBones.PixiArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/mecha_1004d/mecha_1004d_ske.json",
            "resource/mecha_1004d/mecha_1004d_tex.json",
            "resource/mecha_1004d/mecha_1004d_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_1004d/mecha_1004d_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1004d/mecha_1004d_tex.json"].data, this._pixiResources["resource/mecha_1004d/mecha_1004d_tex.png"].texture);

        this._armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");

        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 100.0;
        this.addChild(this._armatureDisplay);
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        let attackState = this._armatureDisplay.animation.getState("attack_01");
        if (!attackState) {
            attackState = this._armatureDisplay.animation.fadeIn("attack_01", 0.1, 1, 1);
            attackState.resetToPose = false;
            attackState.autoFadeOutTime = 0.1;
            attackState.addBoneMask("chest");
            attackState.addBoneMask("effect_l");
            attackState.addBoneMask("effect_r");
        }
    }
}