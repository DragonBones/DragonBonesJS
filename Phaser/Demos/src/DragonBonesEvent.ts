class DragonBonesEvent extends BaseDemo {
    private _armatureDisplay: dragonBones.PhaserArmatureDisplay;

    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            "resource/mecha_1004d/mecha_1004d_ske.json",
            "resource/mecha_1004d/mecha_1004d_tex.json",
            "resource/mecha_1004d/mecha_1004d_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_1004d/mecha_1004d_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/mecha_1004d/mecha_1004d_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/mecha_1004d/mecha_1004d_tex.png", true) as any).base
        );
        factory.soundEventManager.addDBEventListener(dragonBones.EventObject.SOUND_EVENT, this._soundEventHandler, this);

        this._armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");

        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 100.0;
        this.addChild(this._armatureDisplay);
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(() => {
            this._armatureDisplay.animation.fadeIn("skill_03", 0.2);
        }, this);
        //
        this.createText("Touch to play animation.");
    }

    private _soundEventHandler(event: dragonBones.EventObject): void {
        console.log(event.name);
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        if (event.animationState.name === "skill_03") {
            this._armatureDisplay.animation.fadeIn("walk", 0.2);
        }
    }
}