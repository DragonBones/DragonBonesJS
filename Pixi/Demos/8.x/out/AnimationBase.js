"use strict";
class AnimationBase extends BaseDemo {
    constructor() {
        super();
        this._isTouched = false;
        this._resources.push("resource/progress_bar/progress_bar_ske.json", "resource/progress_bar/progress_bar_tex.json", "resource/progress_bar/progress_bar_tex.png");
    }
    _onStart() {
        const factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/progress_bar/progress_bar_ske.json"]);
        factory.parseTextureAtlasData(this._pixiResources["resource/progress_bar/progress_bar_tex.json"], this._pixiResources["resource/progress_bar/progress_bar_tex.png"]);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("progress_bar");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 0.0;
        this.addChild(this._armatureDisplay);
        // Add animation event listener.
        this._armatureDisplay.on(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.on(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");
        //
        this.interactive = true;
        this.addListener("touchstart", this._touchHandler, this);
        this.addListener("touchend", this._touchHandler, this);
        this.addListener("touchmove", this._touchHandler, this);
        this.addListener("mousedown", this._touchHandler, this);
        this.addListener("mouseup", this._touchHandler, this);
        this.addListener("mousemove", this._touchHandler, this);
        //
        this.createText("Touch to control animation play progress.");
    }
    _touchHandler(event) {
        const progress = Math.min(Math.max((event.global.x - this.armatureContainer.x + 300.0) / 600.0, 0.0), 1.0);
        switch (event.type) {
            case "touchstart":
            case "mousedown":
            case "pointerdown":
                this._isTouched = true;
                this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
                break;
            case "touchend":
            case "mouseup":
            case "pointerup":
                this._isTouched = false;
                this._armatureDisplay.animation.play();
                break;
            case "touchmove":
            case "mousemove":
            case "pointermove":
                if (this._isTouched) {
                    const animationState = this._armatureDisplay.animation.getState("idle");
                    if (animationState) {
                        animationState.currentTime = animationState.totalTime * progress;
                    }
                }
                break;
        }
    }
    _animationEventHandler(event) {
        console.log(event.animationState.name, event.type, event.name);
    }
}
