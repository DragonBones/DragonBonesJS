@cc._decorator.ccclass
export default class BoneOffset extends cc.Component {
    start() {
        const resources = [
            cc.url.raw("resources/bullet_01/bullet_01_ske.json"),
            cc.url.raw("resources/bullet_01/bullet_01_tex.json"),
            cc.url.raw("resources/bullet_01/bullet_01_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));

            for (let i = 0; i < 100; ++i) {
                //
                const armatureComponent = factory.buildArmatureComponent("bullet_01");
                armatureComponent.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
                armatureComponent.node.x = 0.0;
                armatureComponent.node.y = 0.0;
                this.node.addChild(armatureComponent.node);
                //
                this._moveTo(armatureComponent);
            }
        });
    }

    private _animationEventHandler(event: cc.Event.EventCustom): void {
        const eventObject = event.getUserData() as dragonBones.EventObject;
        this._moveTo(eventObject.armature.proxy as dragonBones.CocosArmatureComponent);
    }

    private _moveTo(armatureComponent: dragonBones.CocosArmatureComponent): void {
        const fromX = armatureComponent.node.x;
        const fromY = armatureComponent.node.y;

        const canvas = this.getComponent(cc.Canvas);
        const size = canvas.designResolution;

        const toX = Math.random() * size.width - size.width * 0.5;
        const toY = Math.random() * size.height - size.height * 0.5;
        const dX = toX - fromX;
        const dY = toY - fromY;
        const rootSlot = armatureComponent.armature.getBone("root");
        const bulletSlot = armatureComponent.armature.getBone("bullet");
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
        armatureComponent.animation.timeScale = 0.5 + Math.random() * 1.0; // Random animation speed.
        armatureComponent.animation.play("idle", 1);
    }
}
