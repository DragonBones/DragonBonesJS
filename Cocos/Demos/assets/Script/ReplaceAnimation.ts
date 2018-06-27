@cc._decorator.ccclass
export default class ReplaceSlotDisplay extends cc.Component {
    private _armatureComponentA: dragonBones.CocosArmatureComponent;
    private _armatureComponentB: dragonBones.CocosArmatureComponent;
    private _armatureComponentC: dragonBones.CocosArmatureComponent;
    private _armatureComponentD: dragonBones.CocosArmatureComponent;

    start() {
        const resources = [
            cc.url.raw("resources/mecha_2903/mecha_2903_ske.json"),
            cc.url.raw("resources/mecha_2903/mecha_2903_tex.json"),
            cc.url.raw("resources/mecha_2903/mecha_2903_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            //
            this._armatureComponentA = factory.buildArmatureComponent("mecha_2903");
            this._armatureComponentB = factory.buildArmatureComponent("mecha_2903b");
            this._armatureComponentC = factory.buildArmatureComponent("mecha_2903c");
            this._armatureComponentD = factory.buildArmatureComponent("mecha_2903d");
            //
            const sourceArmatureData = factory.getArmatureData("mecha_2903d");
            factory.replaceAnimation(this._armatureComponentA.armature, sourceArmatureData);
            factory.replaceAnimation(this._armatureComponentB.armature, sourceArmatureData);
            factory.replaceAnimation(this._armatureComponentC.armature, sourceArmatureData);
            //
            this._armatureComponentA.node.x = 0.0 - 350.0;
            this._armatureComponentA.node.y = 0.0 - 150.0;
            this._armatureComponentB.node.x = 0.0;
            this._armatureComponentB.node.y = 0.0 - 150.0;
            this._armatureComponentC.node.x = 0.0 + 350.0;
            this._armatureComponentC.node.y = 0.0 - 150.0;
            this._armatureComponentD.node.x = 0.0;
            this._armatureComponentD.node.y = 0.0 + 50.0;
            //
            this.node.addChild(this._armatureComponentD.node);
            this.node.addChild(this._armatureComponentA.node);
            this.node.addChild(this._armatureComponentB.node);
            this.node.addChild(this._armatureComponentC.node);
            //
            this.node.on(cc.Node.EventType.TOUCH_START, () => {
                this._changeAnimation();
            }, this);
        });
    }

    private _changeAnimation(): void {
        let animationName = this._armatureComponentD.animation.lastAnimationName;
        if (animationName) {
            const animationNames = this._armatureComponentD.animation.animationNames;
            const animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureComponentD.animation.play(animationNames[animationIndex]);
        }
        else {
            this._armatureComponentD.animation.play();
        }

        animationName = this._armatureComponentD.animation.lastAnimationName;

        this._armatureComponentA.animation.play(animationName);
        this._armatureComponentB.animation.play(animationName);
        this._armatureComponentC.animation.play(animationName);
    }
}
