class AnimationLayer extends BaseDemo {
    private _armatureDisplay: dragonBones.phaser.display.ArmatureDisplay;

    public constructor() {
        super("AnimationLayer");
    }

    preload(): void {
        super.preload();
        this.load.dragonbone(
            "mecha_1004d",
            "resource/mecha_1004d/mecha_1004d_tex.png",
            "resource/mecha_1004d/mecha_1004d_tex.json",
            "resource/mecha_1004d/mecha_1004d_ske.json"
        );
    }

    create(): void {
        super.create();
        this._armatureDisplay = this.add.armature("mecha_1004d", "mecha_1004d");
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");

        this._armatureDisplay.x = this.cameras.main.centerX;
        this._armatureDisplay.y = this.cameras.main.centerY + 100.0;
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        let attackState = this._armatureDisplay.animation.getState("attack_01");
        if (!attackState) {
            attackState = this._armatureDisplay.animation.fadeIn("attack_01", 0.1, 1, 1);
            attackState.resetToPose = false;
            attackState.autoFadeOutTime = 0.1;
            attackState.addBoneMask("chest");
            attackState.addBoneMask("effect_l");
            attackState.addBoneMask("effect_r");
        }
    }
}
