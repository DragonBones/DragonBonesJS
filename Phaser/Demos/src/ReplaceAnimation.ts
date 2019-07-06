class ReplaceAnimation extends BaseDemo {
    private _armatureDisplayA: dragonBones.phaser.display.ArmatureDisplay;
    private _armatureDisplayB: dragonBones.phaser.display.ArmatureDisplay;
    private _armatureDisplayC: dragonBones.phaser.display.ArmatureDisplay;
    private _armatureDisplayD: dragonBones.phaser.display.ArmatureDisplay;

    public constructor() {
        super("ReplaceAnimation");
    }

    preload(): void {
        super.preload();

        this.load.dragonbone(
            "mecha_2903",
            "resource/mecha_2903/mecha_2903_tex.png",
            "resource/mecha_2903/mecha_2903_tex.json",
            "resource/mecha_2903/mecha_2903_ske.json"
        );
    }

    create(): void {
        super.create();

        this._armatureDisplayA = this.add.armature("mecha_2903", "mecha_2903");
        this._armatureDisplayB = this.add.armature("mecha_2903b", "mecha_2903");
        this._armatureDisplayC = this.add.armature("mecha_2903c", "mecha_2903");
        this._armatureDisplayD = this.add.armature("mecha_2903d", "mecha_2903");

        const factory = this.dragonbone.factory;
        const sourceArmatureData = factory.getArmatureData("mecha_2903d");
        factory.replaceAnimation(this._armatureDisplayA.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayB.armature, sourceArmatureData);
        factory.replaceAnimation(this._armatureDisplayC.armature, sourceArmatureData);

        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this._armatureDisplayA.x = cx - 350.0;
        this._armatureDisplayA.y = cy + 150.0;
        this._armatureDisplayB.x = cx;
        this._armatureDisplayB.y = cy + 150.0;
        this._armatureDisplayC.x = cx + 350.0;
        this._armatureDisplayC.y = cy + 150.0;
        this._armatureDisplayD.x = cx;
        this._armatureDisplayD.y = cy - 50.0;

        this.input.enabled = true;
        this.input.on('pointerdown', () => {
            this._changeAnimation();
        });

        this.createText("Touch to change animation.");
    }

    private _changeAnimation(): void {
        let animationName = this._armatureDisplayD.animation.lastAnimationName;
        if (animationName) {
            const animationNames = this._armatureDisplayD.animation.animationNames;
            const animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureDisplayD.animation.play(animationNames[animationIndex]);
        }
        else {
            this._armatureDisplayD.animation.play();
        }

        animationName = this._armatureDisplayD.animation.lastAnimationName;

        this._armatureDisplayA.animation.play(animationName);
        this._armatureDisplayB.animation.play(animationName);
        this._armatureDisplayC.animation.play(animationName);
    }
}
