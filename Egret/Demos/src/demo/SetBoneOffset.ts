class SetBoneOffset extends BaseDemo {
    public constructor() {
        super();

        this._resources.push(
            "resource/assets/effect_ske.json",
            "resource/assets/effect_tex.json",
            "resource/assets/effect_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/assets/effect_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/assets/effect_tex.json"), RES.getRes("resource/assets/effect_tex.png"));

        for (let i = 0; i < 100; ++i) {
            const armatureDisplay = factory.buildArmatureDisplay("effect");
            armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
            this._moveTo(armatureDisplay);
            this.addChild(armatureDisplay);
        }
    }

    private _animationHandler(event: dragonBones.EgretEvent): void {
        this._moveTo(event.eventObject.armature.display);
    }

    private _moveTo(armatureDisplay: dragonBones.EgretArmatureDisplay): void {
        const fromX = Math.random() * this.stageWidth;
        const fromY = Math.random() * this.stageHeight;
        const toX = Math.random() * this.stageWidth;
        const toY = Math.random() * this.stageHeight;
        const dX = toX - fromX;
        const dY = toY - fromY;
        const rootSlot = armatureDisplay.armature.getBone("root");
        const effectSlot = armatureDisplay.armature.getBone("effect");
        // Modify root and effect bone offset.
        rootSlot.offset.scaleX = Math.sqrt(dX * dX + dY * dY) / 100; // Effect translate distance is 100 px.
        rootSlot.offset.rotation = Math.atan2(dY, dX);
        rootSlot.offset.skew = Math.random() * Math.PI - Math.PI * 0.5; // Random skew.
        effectSlot.offset.scaleX = 0.5 + Math.random() * 0.5; // Random scale.
        effectSlot.offset.scaleY = 0.5 + Math.random() * 0.5;
        // Update root and effect bone.
        rootSlot.invalidUpdate();
        effectSlot.invalidUpdate();
        //
        armatureDisplay.x = fromX;
        armatureDisplay.y = fromY;
        armatureDisplay.animation.timeScale = 0.5 + Math.random() * 1.0; // Random animation speed.
        armatureDisplay.animation.play("idle", 1);
    }
}