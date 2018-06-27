@cc._decorator.ccclass
export default class ReplaceSkin extends cc.Component {
    private _replaceSuitIndex: number = 0;
    private readonly _suitConfigs: string[][] = [];
    private readonly _replaceSuitParts: string[] = [];
    private _armatureComponent: dragonBones.CocosArmatureComponent;

    start() {
        this._suitConfigs.push([
            "2010600a",
            "2010600a_1",
            "20208003",
            "20208003_1",
            "20208003_2",
            "20208003_3",
            "20405006",
            "20509005",
            "20703016",
            "20703016_1",
            "2080100c",
            "2080100e",
            "2080100e_1",
            "20803005",
            "2080500b",
            "2080500b_1"
        ]);

        this._suitConfigs.push([
            "20106010",
            "20106010_1",
            "20208006",
            "20208006_1",
            "20208006_2",
            "20208006_3",
            "2040600b",
            "2040600b_1",
            "20509007",
            "20703020",
            "20703020_1",
            "2080b003",
            "20801015"
        ]);

        const resources = [
            cc.url.raw("resources/you_xin/body/body_ske.json"),
            cc.url.raw("resources/you_xin/body/body_tex.json"),
            cc.url.raw("resources/you_xin/body/body_tex.png"),
        ];

        for (let i = 0, l = this._suitConfigs.length; i < l; ++i) {
            for (const partArmatureName of this._suitConfigs[i]) {
                // resources/you_xin/suit1/2010600a/xxxxxx
                const path = "resources/you_xin/suit" + (i + 1) + "/" + partArmatureName + "/" + partArmatureName;
                const dragonBonesJSONPath = path + "_ske.json";
                const textureAtlasJSONPath = path + "_tex.json";
                const textureAtlasPath = path + "_tex.png";
                //
                resources.push(
                    cc.url.raw(dragonBonesJSONPath),
                    cc.url.raw(textureAtlasJSONPath),
                    cc.url.raw(textureAtlasPath)
                );
            }
        }

        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));

            for (let i = 0, l = this._suitConfigs.length; i < l; ++i) {
                for (const partArmatureName of this._suitConfigs[i]) {
                    const path = "resources/you_xin/suit" + (i + 1) + "/" + partArmatureName + "/" + partArmatureName;
                    const dragonBonesJSONPath = cc.url.raw(path + "_ske.json");
                    const textureAtlasJSONPath = cc.url.raw(path + "_tex.json");
                    const textureAtlasPath = cc.url.raw(path + "_tex.png");
                    //
                    factory.parseDragonBonesData(cc.loader.getRes(dragonBonesJSONPath));
                    factory.parseTextureAtlasData(cc.loader.getRes(textureAtlasJSONPath), cc.loader.getRes(textureAtlasPath));
                }
            }
            //
            this._armatureComponent = factory.buildArmatureComponent("body");
            this._armatureComponent.node.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.animation.play("idle", 0);
            //
            this._armatureComponent.node.x = 0.0;
            this._armatureComponent.node.y = -200.0;
            this._armatureComponent.node.scaleX = this._armatureComponent.node.scaleY = 0.25;
            this.node.addChild(this._armatureComponent.node);
            // Init the first suit.
            for (const part of this._suitConfigs[0]) {
                const partArmatureData = factory.getArmatureData(part);
                factory.replaceSkin(this._armatureComponent.armature, partArmatureData.defaultSkin);
            }
            //
            this.node.on(cc.Node.EventType.TOUCH_START, () => {
                this._randomReplaceSkin();
            }, this);
        });
    }

    private _animationEventHandler(event: cc.Event.EventCustom): void {
        // Random animation index.
        const animationIndex = Math.floor(Math.random() * this._armatureComponent.animation.animationNames.length);
        const animationName = this._armatureComponent.animation.animationNames[animationIndex];
        // Play animation.
        this._armatureComponent.animation.fadeIn(animationName, 0.3, 0);
    }

    private _randomReplaceSkin(): void {
        const factory = dragonBones.CocosFactory.factory;
        // This suit has been replaced, next suit.
        if (this._replaceSuitParts.length === 0) {
            this._replaceSuitIndex++;

            if (this._replaceSuitIndex >= this._suitConfigs.length) {
                this._replaceSuitIndex = 0;
            }

            // Refill the unset parits.
            for (const partArmatureName of this._suitConfigs[this._replaceSuitIndex]) {
                this._replaceSuitParts.push(partArmatureName);
            }
        }

        // Random one part in this suit.
        const partIndex = Math.floor(Math.random() * this._replaceSuitParts.length);
        const partArmatureName = this._replaceSuitParts[partIndex];
        const partArmatureData = factory.getArmatureData(partArmatureName);
        // Replace skin.
        factory.replaceSkin(this._armatureComponent.armature, partArmatureData.defaultSkin);
        // Remove has been replaced
        this._replaceSuitParts.splice(partIndex, 1);
    }
}
