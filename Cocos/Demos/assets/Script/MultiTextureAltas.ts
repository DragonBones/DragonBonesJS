@cc._decorator.ccclass
export default class MultiTextureAltas extends cc.Component {
    private _armatureComponentA: dragonBones.CocosArmatureComponent;
    private _armatureComponentB: dragonBones.CocosArmatureComponent;
    private _armatureComponentC: dragonBones.CocosArmatureComponent;
    private _armatureComponentD: dragonBones.CocosArmatureComponent;

    start() {
        const resources = [
            cc.url.raw("resources/effect/effect_ske.json"),
            cc.url.raw("resources/effect/effect_tex.json"),
            cc.url.raw("resources/effect/effect_tex.png"),
            cc.url.raw("resources/effect/effect_sd_tex.json"),
            cc.url.raw("resources/effect/effect_sd_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]), "hd", 1.0);
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]), "sd", 0.5);
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]), "hd", 1.0);
            factory.parseTextureAtlasData(cc.loader.getRes(resources[3]), cc.loader.getRes(resources[4]), "sd", 2.0);
            //
            this._armatureComponentA = factory.buildArmatureComponent("flower", "hd", null, "hd"); // HD Armature and HD TextureAtlas.
            this._armatureComponentB = factory.buildArmatureComponent("flower", "hd", null, "sd"); // HD Armature and SD TextureAtlas.
            this._armatureComponentC = factory.buildArmatureComponent("flower", "sd", null, "hd"); // SD Armature and HD TextureAtlas.
            this._armatureComponentD = factory.buildArmatureComponent("flower", "sd", null, "sd"); // SD Armature and SD TextureAtlas.
            // Test flip.
            this._armatureComponentB.armature.flipX = true;
            this._armatureComponentC.armature.flipY = true;
            this._armatureComponentD.armature.flipX = true;
            this._armatureComponentD.armature.flipY = true;
            //
            this._armatureComponentA.node.x = -250.0;
            this._armatureComponentA.node.y = 0.0;
            this._armatureComponentB.node.x = 250.0;
            this._armatureComponentB.node.y = 0.0;
            this._armatureComponentC.node.x = -250.0;
            this._armatureComponentC.node.y = -200.0;
            this._armatureComponentD.node.x = 250.0;
            this._armatureComponentD.node.y = -200.0;
            //
            this.node.addChild(this._armatureComponentA.node);
            this.node.addChild(this._armatureComponentB.node);
            this.node.addChild(this._armatureComponentC.node);
            this.node.addChild(this._armatureComponentD.node);
            //
            this.node.on(cc.Node.EventType.TOUCH_START, () => {
                this._changeAnimation();
            }, this);
            //
            this._changeAnimation();
        });
    }

    private _changeAnimation(): void {
        let animationName = this._armatureComponentA.animation.lastAnimationName;
        if (animationName) {
            const animationNames = this._armatureComponentA.animation.animationNames;
            const animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureComponentA.animation.play(animationNames[animationIndex]).playTimes = 0;
        }
        else {
            this._armatureComponentA.animation.play().playTimes = 0;
        }

        animationName = this._armatureComponentA.animation.lastAnimationName;

        this._armatureComponentB.animation.play(animationName).playTimes = 0;
        this._armatureComponentC.animation.play(animationName).playTimes = 0;
        this._armatureComponentD.animation.play(animationName).playTimes = 0;
    }
}
