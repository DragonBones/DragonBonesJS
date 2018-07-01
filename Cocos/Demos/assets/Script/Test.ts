@cc._decorator.ccclass
export default class Test extends cc.Component {
    start() {
        const resources = [
            cc.url.raw("resources/test/test_ske.json"),
            cc.url.raw("resources/test/test_tex.json"),
            cc.url.raw("resources/test/test_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));

            const armatureComponent = factory.buildArmatureComponent("test");
            armatureComponent.animation.play("test");

            armatureComponent.node.x = 0.0;
            armatureComponent.node.y = -200.0;
            this.node.addChild(armatureComponent.node);
        });
    }
}
