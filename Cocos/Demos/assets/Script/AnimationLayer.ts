@cc._decorator.ccclass
export default class AnimationLayer extends cc.Component {
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
            this._armatureComponent = factory.buildArmatureComponent("mecha_1004d");
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.animation.play("walk");

            this._armatureComponent.node.x = 0.0;
            this._armatureComponent.node.y = -100.0;
            this.node.addChild(this._armatureComponent.node);
        });
    }

    private _animationEventHandler(event: cc.Event.EventCustom): void {
        let attackState = this._armatureComponent.animation.getState("attack_01");
        if (!attackState) {
            attackState = this._armatureComponent.animation.fadeIn("attack_01", 0.1, 1, 1);
            attackState.resetToPose = false;
            attackState.autoFadeOutTime = 0.1;
            attackState.addBoneMask("chest");
            attackState.addBoneMask("effect_l");
            attackState.addBoneMask("effect_r");
        }
    }
}
