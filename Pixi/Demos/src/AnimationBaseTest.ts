class AnimationBaseTest extends BaseTest {

    private _armatureDisplay: dragonBones.PixiArmatureDisplay;

    protected _onStart(): void {
        PIXI.loader
            .add("dragonBonesData", "./resource/assets/animation_base_test_ske.json")
            .add("textureData", "./resource/assets/animation_base_test_tex.json")
            .add("texture", "./resource/assets/animation_base_test_tex.png");

        PIXI.loader.once("complete", (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) => {
            const factory = dragonBones.PixiFactory.factory;
            factory.parseDragonBonesData(resources["dragonBonesData"].data);
            factory.parseTextureAtlasData(resources["textureData"].data, resources["texture"].texture);

            this._armatureDisplay = factory.buildArmatureDisplay("progressBar");
            this._armatureDisplay.x = this.stage.width * 0.5;
            this._armatureDisplay.y = this.stage.height * 0.5;
            this.stage.addChild(this._armatureDisplay);

            // Test animation event
            this._armatureDisplay.addListener(dragonBones.EventObject.START, this._animationEventHandler, this);
            this._armatureDisplay.addListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.addListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.addListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
            this._armatureDisplay.addListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.addListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
            this._armatureDisplay.addListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);

            // Test frame event
            this._armatureDisplay.addListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);

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
            // animaitonConfig.duration = 3.0; // Interval play.
            // this._armatureDisplay.animation.playConfig(animaitonConfig);

            this._armatureDisplay.animation.play("idle", 1);

            //
            this.stage.interactive = true;
            this.stage.addListener("touchstart", this._touchHandler, this);
            this.stage.addListener("touchend", this._touchHandler, this);
            this.stage.addListener("touchmove", this._touchHandler, this);
            this.stage.addListener("mousedown", this._touchHandler, this);
            this.stage.addListener("mouseup", this._touchHandler, this);
            this.stage.addListener("mousemove", this._touchHandler, this);

            const text = new PIXI.Text("", { align: "center" });
            text.text = "Click to control animation play progress.";
            text.scale.x = 0.7;
            text.scale.y = 0.7;
            text.x = (this.renderer.width - text.width) * 0.5;
            text.y = this.renderer.height - 60;
            this._stage.addChild(text);

            //
            this._startRenderTick();
        });

        PIXI.loader.load();
    }

    private _isTouched: boolean = false;
    private _touchHandler(event: PIXI.interaction.InteractionEvent): void {
        const progress = Math.min(Math.max((event.data.global.x - this._armatureDisplay.x + 300) / 600, 0.0), 1.0);
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
        console.log(event.animationState.name, event.type, event.name ? event.name : "");
    }
}