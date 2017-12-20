class AnimationBase extends BaseDemo {
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/progress_bar/progress_bar_ske.json",
            "resource/progress_bar/progress_bar_tex.json",
            "resource/progress_bar/progress_bar_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/progress_bar/progress_bar_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/progress_bar/progress_bar_tex.json"), RES.getRes("resource/progress_bar/progress_bar_tex.png"));
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progress_bar");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 0.0;
        this.addChild(this._armatureDisplay);
        // Add animation event listener.
        this._armatureDisplay.addEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");
        //
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._touchHandler, this);
        //
        this.createText("Touch to control animation play progress.");
    }

    private _touchHandler(event: egret.TouchEvent): void {
        const progress = Math.min(Math.max((event.stageX - this.x + 300.0) / 600.0, 0.0), 1.0);
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
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
        console.log(event.eventObject.animationState.name, event.type, event.eventObject.name);
    }
}