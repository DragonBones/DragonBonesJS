class AnimationBaseTest extends BaseTest {
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/animation_base_test_ske.json",
            "resource/assets/animation_base_test_tex.json",
            "resource/assets/animation_base_test_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/assets/animation_base_test_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/assets/animation_base_test_tex.json"), RES.getRes("resource/assets/animation_base_test_tex.png"));

        this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
        this._armatureDisplay.x = this.stage.stageWidth * 0.5;
        this._armatureDisplay.y = this.stage.stageHeight * 0.5;
        this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = this.stage.stageWidth >= 300 ? 1 : this.stage.stageWidth / 330;
        this.addChild(this._armatureDisplay);

        // Test animation event
        this._armatureDisplay.addEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);

        // Test frame event
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);

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

        this._armatureDisplay.animation.play("idle", 1);

        //            
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._touchHandler, this);

        const text = new egret.TextField();
        text.size = 20;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.text = "Click to control animation play progress.";
        text.width = this.stage.stageWidth;
        text.x = 0;
        text.y = this.stage.stageHeight - 60;
        this.addChild(text);
    }

    private _touchHandler(event: egret.TouchEvent): void {
        const progress = Math.min(Math.max((event.stageX - this._armatureDisplay.x + 300 * this._armatureDisplay.scaleX) / 600 * this._armatureDisplay.scaleX, 0), 1);
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                // this._armatureDisplay.animation.gotoAndPlayByTime("idle", 0.5, 1);
                // this._armatureDisplay.animation.gotoAndStopByTime("idle", 1);

                // this._armatureDisplay.animation.gotoAndPlayByFrame("idle", 25, 2);
                // this._armatureDisplay.animation.gotoAndStopByFrame("idle", 50);

                // this._armatureDisplay.animation.gotoAndPlayByProgress("idle", progress, 3);
                this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
                break;

            case egret.TouchEvent.TOUCH_END:
                this._armatureDisplay.animation.play();
                break;

            case egret.TouchEvent.TOUCH_MOVE:
                if (event.touchDown) {
                    const animationState = this._armatureDisplay.animation.getState("idle");
                    if (animationState) {
                        animationState.currentTime = animationState.totalTime * progress;
                    }
                }
                break;
        }
    }

    private _animationEventHandler(event: dragonBones.EgretEvent): void {
        console.log(event.eventObject.animationState.name, event.type, event.eventObject.name ? event.eventObject.name : "");
    }
}