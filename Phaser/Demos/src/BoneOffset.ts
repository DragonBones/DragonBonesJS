class BoneOffset extends BaseDemo {
    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            "resource/bullet_01/bullet_01_ske.json",
            "resource/bullet_01/bullet_01_tex.json",
            "resource/bullet_01/bullet_01_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/bullet_01/bullet_01_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/bullet_01/bullet_01_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/bullet_01/bullet_01_tex.png", true) as any).base
        );

        for (let i = 0; i < 100; ++i) {
            const armatureDisplay = factory.buildArmatureDisplay("bullet_01");
            armatureDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
            armatureDisplay.x = 0.0;
            armatureDisplay.y = 0.0;
            this.addChild(armatureDisplay);
            //
            this._moveTo(armatureDisplay);
        }
    }

    private _animationHandler(event: dragonBones.EventObject): void {
        this._moveTo(event.armature.display);
    }

    private _moveTo(armatureDisplay: dragonBones.PhaserArmatureDisplay): void {
        const fromX = armatureDisplay.x;
        const fromY = armatureDisplay.y;
        const toX = Math.random() * this.stageWidth - this.stageWidth * 0.5;
        const toY = Math.random() * this.stageHeight - this.stageHeight * 0.5;
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