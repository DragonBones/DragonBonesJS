class AnimationBase extends BaseDemo {
    private _armatureDisplay: dragonBones.PhaserArmatureDisplay;

    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            "resource/progress_bar/progress_bar_ske.json",
            "resource/progress_bar/progress_bar_tex.json",
            "resource/progress_bar/progress_bar_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/progress_bar/progress_bar_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/progress_bar/progress_bar_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/progress_bar/progress_bar_tex.png", true) as any).base
        );
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progress_bar");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 0.0;
        this.addChild(this._armatureDisplay);
        // Add animation event listener.
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(this._inputDown, this);
        this.events.onInputUp.add(this._inputUp, this);
        //
        this.createText("Touch to control animation play progress.");
    }

    private _isTouched: boolean = false;

    private _inputDown(): void {
        const progress = Math.min(Math.max((this.game.input.x - this.x + 300.0) / 600.0, 0.0), 1.0);
        this._isTouched = true;
        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
    }

    private _inputUp(): void {
        this._isTouched = false;
        this._armatureDisplay.animation.play();
    }

    public update(): void {
        if (this._isTouched) {
            const progress = Math.min(Math.max((this.game.input.x - this.x + 300.0) / 600.0, 0.0), 1.0);
            const animationState = this._armatureDisplay.animation.getState("idle");
            animationState.currentTime = animationState.totalTime * progress;
        }
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        console.log(event.animationState.name, event.type, event.name);
    }
}