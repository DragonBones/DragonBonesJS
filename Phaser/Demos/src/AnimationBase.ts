class AnimationBase extends BaseDemo {
    private _armatureDisplay: dragonBones.phaser.display.ArmatureDisplay;

    public constructor() {
        super("AnimationBase");
    }

    preload(): void {
        super.preload();

        this.load.dragonbone(
            "progress_bar",
            "resource/progress_bar/progress_bar_tex.png",
            "resource/progress_bar/progress_bar_tex.json",
            "resource/progress_bar/progress_bar_ske.json"
        );
    }

    create(): void {
        super.create();

        this._armatureDisplay = this.add.armature("progress_bar", "progress_bar");
        this._armatureDisplay.x = this.cameras.main.centerX;
        this._armatureDisplay.y = this.cameras.main.centerY;
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle");

        this.input.enabled = true;
        this.input.on('pointerdown', () => this._inputDown());
        this.input.on('pointerup', () => this._inputUp());

        this.createText("Touch to control animation play progress.");
    }

    private _isTouched: boolean = false;

    private _inputDown(): void {
        const progress = Phaser.Math.Clamp((this.input.x - this._armatureDisplay.x + 300.0) / 600.0, 0.0, 1.0);
        this._isTouched = true;
        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
    }

    private _inputUp(): void {
        this._isTouched = false;
        this._armatureDisplay.animation.play();
    }

    public update(): void {
        if (this._isTouched) {
            const progress = Phaser.Math.Clamp((this.input.x - this._armatureDisplay.x + 300.0) / 600.0, 0.0, 1.0);
            const animationState = this._armatureDisplay.animation.getState("idle");
            animationState.currentTime = animationState.totalTime * progress;
        }
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        console.log(event.animationState.name, event.type, event.name);
    }
}
