class AnimationBaseTest extends BaseTest {
    private _armatureDisplay: dragonBones.PhaserArmatureDisplay;

    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            "resource/assets/animation_base_test_ske.json",
            "resource/assets/animation_base_test_tex.json",
            "resource/assets/animation_base_test_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/assets/animation_base_test_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/assets/animation_base_test_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/assets/animation_base_test_tex.png", true) as any).base
        );
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this._armatureDisplay.scale.x = this._armatureDisplay.scale.x = this.stageWidth >= 300 ? 1 : this.stageWidth / 330;
        this.addChild(this._armatureDisplay);
        // Test animation event
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle", 1);
        // Test animation config.
        // const animaitonConfig = this._armatureDisplay.animation.animationConfig;
        // animaitonConfig.name = "test"; // Animation state name.
        // animaitonConfig.animation = "idle"; // Animation name.

        // animaitonConfig.playTimes = 1; // Play one time.
        // animaitonConfig.playTimes = 3; // Play several times.
        // animaitonConfig.playTimes = 0; // Loop play.

        // animaitonConfig.timeScale = 1.0; // Play speed.
        // animaitonConfig.timeScale = -1.0; // Reverse play.

        // animaitonConfig.position = 1.0; // Goto and play.
        // animaitonConfig.duration = 0.0; // Goto and stop.
        // animaitonConfig.duration = 3.0; // Interval play.
        // this._armatureDisplay.animation.playConfig(animaitonConfig);
        //
        this.inputEnabled = true;
        this.events.onInputDown.add(this._inputDown, this);
        this.events.onInputUp.add(this._inputUp, this);
        //
        this.createText("Click to control animation play progress.");
    }

    private _isTouched: boolean = false;

    private _inputDown(): void {
        const progress = Math.min(Math.max((this.game.input.x - this._armatureDisplay.x + 300 * this._armatureDisplay.scale.x) / 600 * this._armatureDisplay.scale.x, 0), 1);
        this._isTouched = true;
        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
    }

    private _inputUp(): void {
        this._isTouched = false;
        this._armatureDisplay.animation.play();
    }

    public update(): void {
        if (this._isTouched) {
            const progress = Math.min(Math.max((this.game.input.x - this._armatureDisplay.x + 300 * this._armatureDisplay.scale.x) / 600 * this._armatureDisplay.scale.x, 0), 1);
            const animationState = this._armatureDisplay.animation.getState("idle");
            animationState.currentTime = animationState.totalTime * progress;
        }
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        console.log(event.animationState.name, event.type, event.name || "");
    }
}