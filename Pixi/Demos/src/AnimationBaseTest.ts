class AnimationBaseTest extends BaseTest {
    private _armatureDisplay: dragonBones.PixiArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/animation_base_test_ske.json",
            "resource/assets/animation_base_test_tex.json",
            "resource/assets/animation_base_test_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/assets/animation_base_test_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/assets/animation_base_test_tex.json"].data, this._pixiResources["resource/assets/animation_base_test_tex.png"].texture);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this._armatureDisplay.scale.x = this._armatureDisplay.scale.x = this.stageWidth >= 300 ? 1 : this.stageWidth / 330;
        this.addChild(this._armatureDisplay);
        // Test animation event
        this._armatureDisplay.addListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
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
        this.interactive = true;
        this.addListener("touchstart", this._touchHandler, this);
        this.addListener("touchend", this._touchHandler, this);
        this.addListener("touchmove", this._touchHandler, this);
        this.addListener("mousedown", this._touchHandler, this);
        this.addListener("mouseup", this._touchHandler, this);
        this.addListener("mousemove", this._touchHandler, this);
        //
        this.createText("Click to control animation play progress.");
    }

    private _isTouched: boolean = false;
    private _touchHandler(event: PIXI.interaction.InteractionEvent): void {
        const progress = Math.min(Math.max((event.data.global.x - this._armatureDisplay.x + 300 * this._armatureDisplay.scale.x) / 600 * this._armatureDisplay.scale.x, 0), 1);
        switch (event.type) {
            case "touchstart":
            case "mousedown":
                this._isTouched = true;
                // this._armatureDisplay.animation.gotoAndPlayByTime("idle", 0.5, 1);
                // this._armatureDisplay.animation.gotoAndStopByTime("idle", 1);

                // this._armatureDisplay.animation.gotoAndPlayByFrame("idle", 25, 2);
                // this._armatureDisplay.animation.gotoAndStopByFrame("idle", 50);

                // this._armatureDisplay.animation.gotoAndPlayByProgress("idle", progress, 3);
                this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
                break;

            case "touchend":
            case "mouseup":
                this._isTouched = false;
                this._armatureDisplay.animation.play();
                break;

            case "touchmove":
            case "mousemove":
                if (this._isTouched) {
                    const animationState = this._armatureDisplay.animation.getState("idle");
                    animationState.currentTime = animationState.totalTime * progress;
                }
                break;
        }
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        console.log(event.animationState.name, event.type, event.name || "");
    }
}