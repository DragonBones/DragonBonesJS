/**
 * How to use
 * 1. Load data.
 *
 * 2. Parse data.
 *    factory.parseDragonBonesData();
 *    factory.parseTextureAtlasData();
 *
 * 3. Build armature.
 *    armatureComponent = factory.buildArmatureComponent("armatureName");
 *
 * 4. Play animation.
 *    armatureComponent.animation.play("animationName");
 *
 * 5. Add armature to stage.
 *    addChild(armatureComponent.node);
 */
@cc._decorator.ccclass
export default class HelloDragonBones extends cc.Component {
    start() {
        const resources = [
            cc.url.raw("resources/mecha_1002_101d_show/mecha_1002_101d_show_ske.json"),
            cc.url.raw("resources/mecha_1002_101d_show/mecha_1002_101d_show_tex.json"),
            cc.url.raw("resources/mecha_1002_101d_show/mecha_1002_101d_show_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));

            const armatureComponent = factory.buildArmatureComponent("mecha_1002_101d", "mecha_1002_101d_show");
            armatureComponent.animation.play("idle");

            armatureComponent.node.x = 0.0;
            armatureComponent.node.y = -200.0;
            this.node.addChild(armatureComponent.node);
        });
    }
}
