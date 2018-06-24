@cc._decorator.ccclass
export default class DragonBonesEvent extends cc.Component {
    private _armatureComponent: dragonBones.CocosArmatureComponent;

    start() {
        const resources = [
            cc.url.raw("resources/mecha_1004d/mecha_1004d_ske.json"),
            cc.url.raw("resources/mecha_1004d/mecha_1004d_tex.json"),
            cc.url.raw("resources/mecha_1004d/mecha_1004d_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            //
            factory.soundEventManager.on(dragonBones.EventObject.SOUND_EVENT, this._soundEventHandler, this);
            //
            this._armatureComponent = factory.buildArmatureComponent("mecha_1004d");
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.animation.play("idle");
            this._armatureComponent.node.x = 0.0;
            this._armatureComponent.node.y = -100.0;
            this.node.addChild(this._armatureComponent.node);
            // 
            this.node.on(cc.Node.EventType.TOUCH_START, () => {
                this._armatureComponent.animation.fadeIn("skill_03", 0.2);
            }, this);
        });
    }

    private _soundEventHandler(event: cc.Event.EventCustom): void {
        const eventObject = event.getUserData() as dragonBones.EventObject;
        console.log(eventObject.name);
    }

    private _animationEventHandler(event: cc.Event.EventCustom): void {
        const eventObject = event.getUserData() as dragonBones.EventObject;
        if (eventObject.animationState.name === "skill_03") {
            this._armatureComponent.animation.fadeIn("walk", 0.2);
        }
    }
}
