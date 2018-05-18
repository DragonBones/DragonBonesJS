class AnimationBaseTest extends BaseTest {
    private _isTouched: boolean = false;
    private _armatureDisplay: dragonBones.HiloArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/animation_base_test_ske.json",
            "resource/assets/animation_base_test_tex.json",
            "resource/assets/animation_base_test_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.HiloFactory.factory;
        factory.parseDragonBonesData(this._hiloResources["resource/assets/animation_base_test_ske.json"]);
        factory.parseTextureAtlasData(this._hiloResources["resource/assets/animation_base_test_tex.json"], this._hiloResources["resource/assets/animation_base_test_tex.png"]);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = this.stageWidth >= 300 ? 1 : this.stageWidth / 330;
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
        this.on((Hilo.event as any).POINTER_START, (v: MouseEvent) => {
            const progress = Math.min(Math.max((v.clientX - this._armatureDisplay.x + 300 * this._armatureDisplay.scaleX) / 600 * this._armatureDisplay.scaleX, 0), 1);
            this._isTouched = true;
            this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
        }, false);
        this.on((Hilo.event as any).POINTER_END, () => {
            this._isTouched = false;
            this._armatureDisplay.animation.play();
        }, false);
        this.on((Hilo.event as any).POINTER_MOVE, (v: MouseEvent) => {
            if (this._isTouched) {
                const progress = Math.min(Math.max((v.clientX - this._armatureDisplay.x + 300 * this._armatureDisplay.scaleX) / 600 * this._armatureDisplay.scaleX, 0), 1);
                const animationState = this._armatureDisplay.animation.getState("idle");
                animationState.currentTime = animationState.totalTime * progress;
            }
        }, false);
        //
        this.createText("Click to control animation play progress.");
    }

    private _animationEventHandler(event: any): void { // Hilo.EventObject
        const eventObject = event.detail as dragonBones.EventObject;
        console.log(eventObject.animationState.name, eventObject.type, eventObject.name || "");
    }
}