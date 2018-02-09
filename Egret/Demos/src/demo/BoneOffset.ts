class BoneOffset extends BaseDemo {
    public constructor() {
        super();

        this._resources.push(
            "resource/bullet_01/bullet_01_ske.json",
            "resource/bullet_01/bullet_01_tex.json",
            "resource/bullet_01/bullet_01_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/bullet_01/bullet_01_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/bullet_01/bullet_01_tex.json"), RES.getRes("resource/bullet_01/bullet_01_tex.png"));

        for (let i = 0; i < 100; ++i) {
            const armatureDisplay = factory.buildArmatureDisplay("bullet_01");
            armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
            armatureDisplay.x = 0.0;
            armatureDisplay.y = 0.0;
            this.addChild(armatureDisplay);
            //
            this._moveTo(armatureDisplay);
        }
    }

    private _animationHandler(event: dragonBones.EgretEvent): void {
        this._moveTo(event.eventObject.armature.display);
    }

    private _moveTo(armatureDisplay: dragonBones.EgretArmatureDisplay): void {
        const fromX = armatureDisplay.x;
        const fromY = armatureDisplay.y;
        const toX = Math.random() * this.stageWidth - this.stageWidth * 0.5;
        const toY = Math.random() * this.stageHeight - this.stageHeight * 0.5;
        const dX = toX - fromX;
        const dY = toY - fromY;
        const rootSlot = armatureDisplay.armature.getBone("root");
        const bulletSlot = armatureDisplay.armature.getBone("bullet");
        // Modify root and bullet bone offset.
        rootSlot.offset.scaleX = Math.sqrt(dX * dX + dY * dY) / 100.0; // Bullet translate distance is 100 px.
        rootSlot.offset.rotation = Math.atan2(dY, dX);
        rootSlot.offset.skew = Math.random() * Math.PI - Math.PI * 0.5; // Random skew.
        bulletSlot.offset.scaleX = 0.5 + Math.random() * 0.5; // Random scale.
        bulletSlot.offset.scaleY = 0.5 + Math.random() * 0.5;
        // Update root and bullet bone.
        rootSlot.invalidUpdate();
        bulletSlot.invalidUpdate();
        //
        armatureDisplay.animation.timeScale = 0.5 + Math.random() * 1.0; // Random animation speed.
        armatureDisplay.animation.play("idle", 1);
    }
}