class DragonBonesEvent extends BaseDemo {
    private _armatureDisplay: dragonBones.phaser.display.ArmatureDisplay;

    public constructor() {
        super("DragonBonesEvent");
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
        this._armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");

        this._armatureDisplay.x = this.cameras.main.centerX;
        this._armatureDisplay.y = this.cameras.main.centerY + 100.0;
        //
        this.input.enabled = true;
        this.input.on('pointerdown', () => {
            this._armatureDisplay.animation.fadeIn("skill_03", 0.2);
        });
        //
        this.createText("Touch to play animation.");
    }

    private _animationEventHandler(event: dragonBones.EventObject): void {
        if (event.animationState.name === "skill_03") {
            this._armatureDisplay.animation.fadeIn("walk", 0.2);
        }
    }
}
