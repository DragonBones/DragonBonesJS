class ReplaceSkin extends BaseDemo {
    private _replaceSuitIndex: number = 0;
    private readonly _factory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
    private readonly _suitConfigs: string[][] = [];
    private readonly _replaceSuitParts: string[] = [];
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

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

        this._resources.push(
            "resource/you_xin/body/body_ske.json",
            "resource/you_xin/body/body_tex.json",
            "resource/you_xin/body/body_tex.png"
        );

        for (let i = 0, l = this._suitConfigs.length; i < l; ++i) {
            for (const partArmatureName of this._suitConfigs[i]) {
                // resource/you_xin/suit1/2010600a/xxxxxx
                const path = "resource/you_xin/suit" + (i + 1) + "/" + partArmatureName + "/" + partArmatureName;
                const dragonBonesJSONPath = path + "_ske.json";
                const textureAtlasJSONPath = path + "_tex.json";
                const textureAtlasPath = path + "_tex.png";
                //
                this._resources.push(
                    dragonBonesJSONPath,
                    textureAtlasJSONPath,
                    textureAtlasPath
                );
            }
        }
    }

    protected _onStart(): void {
        this._factory.parseDragonBonesData(RES.getRes("resource/you_xin/body/body_ske.json"));
        this._factory.parseTextureAtlasData(RES.getRes("resource/you_xin/body/body_tex.json"), RES.getRes("resource/you_xin/body/body_tex.png"));

        for (let i = 0, l = this._suitConfigs.length; i < l; ++i) {
            for (const partArmatureName of this._suitConfigs[i]) {
                const path = "resource/you_xin/suit" + (i + 1) + "/" + partArmatureName + "/" + partArmatureName;
                const dragonBonesJSONPath = path + "_ske.json";
                const textureAtlasJSONPath = path + "_tex.json";
                const textureAtlasPath = path + "_tex.png";
                //
                this._factory.parseDragonBonesData(RES.getRes(dragonBonesJSONPath));
                this._factory.parseTextureAtlasData(RES.getRes(textureAtlasJSONPath), RES.getRes(textureAtlasPath));
            }
        }
        //
        this._armatureDisplay = this._factory.buildArmatureDisplay("body");
        this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle", 0);
        //
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 200.0;
        this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = 0.25;
        this.addChild(this._armatureDisplay);
        // Init the first suit.
        for (const part of this._suitConfigs[0]) {
            const partArmatureData = this._factory.getArmatureData(part);
            this._factory.replaceSkin(this._armatureDisplay.armature, partArmatureData.defaultSkin);
        }
        //
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            this._randomReplaceSkin();
        }, this);
        //
        this.createText("Touch to replace armature skin.");
    }

    private _animationEventHandler(event: dragonBones.EgretEvent): void {
        // Random animation index.
        const animationIndex = Math.floor(Math.random() * this._armatureDisplay.animation.animationNames.length);
        const animationName = this._armatureDisplay.animation.animationNames[animationIndex];
        // Play animation.
        this._armatureDisplay.animation.fadeIn(animationName, 0.3, 0);
    }

    private _randomReplaceSkin(): void {
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
        const partArmatureData = this._factory.getArmatureData(partArmatureName);
        // Replace skin.
        this._factory.replaceSkin(this._armatureDisplay.armature, partArmatureData.defaultSkin);
        // Remove has been replaced
        this._replaceSuitParts.splice(partIndex, 1);
    }
}