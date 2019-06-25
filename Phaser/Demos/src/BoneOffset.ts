class BoneOffset extends BaseDemo {
    public constructor() {
        super("BoneOffset");
    }

    preload(): void {
        super.preload();
        this.load.dragonbone(
            "bullet_01",
            "resource/bullet_01/bullet_01_tex.png",
            "resource/bullet_01/bullet_01_tex.json",
            "resource/bullet_01/bullet_01_ske.json",
        );
    }

    create(): void {
        super.create();

        for (let i = 0; i < 100; ++i) {
            const armatureDisplay = this.add.armature("bullet_01", "bullet_01");
            armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
            armatureDisplay.x = 0;
            armatureDisplay.y = 0;
            this.cameras.main.centerOn(armatureDisplay.x, armatureDisplay.y);

            this._moveTo(armatureDisplay);
        }
    }

    private _animationHandler(event: dragonBones.EventObject): void {
        this._moveTo(event.armature.display);
    }

    private _moveTo(armatureDisplay: dragonBones.phaser.display.ArmatureDisplay): void {
        const fromX = armatureDisplay.x;
        const fromY = armatureDisplay.y;
        const camera = this.cameras.main;
        const toX = Math.random() * camera.width - camera.centerX;
        const toY = Math.random() * camera.height - camera.centerY;
        const dX = toX - fromX;
        const dY = toY - fromY;
        const rootSlot = armatureDisplay.armature.getBone("root");
        const effectSlot = armatureDisplay.armature.getBone("bullet");
        // Modify root and bullet bone offset.
        rootSlot.offset.scaleX = Math.sqrt(dX * dX + dY * dY) / 100; // Bullet translate distance is 100 px.
        rootSlot.offset.rotation = Math.atan2(dY, dX);
        rootSlot.offset.skew = Math.random() * Math.PI - Math.PI * 0.5; // Random skew.
        effectSlot.offset.scaleX = 0.5 + Math.random() * 0.5; // Random scale.
        effectSlot.offset.scaleY = 0.5 + Math.random() * 0.5;
        // Update root and bullet bone.
        rootSlot.invalidUpdate();
        effectSlot.invalidUpdate();
        //
        armatureDisplay.x = fromX;
        armatureDisplay.y = fromY;
        armatureDisplay.animation.timeScale = 0.5 + Math.random() * 1.0; // Random animation speed.
        armatureDisplay.animation.play("idle", 1);
    }
}
