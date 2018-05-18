class DragonBonesEvent extends BaseDemo {
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/mecha_1004d/mecha_1004d_ske.json",
            "resource/mecha_1004d/mecha_1004d_tex.json",
            "resource/mecha_1004d/mecha_1004d_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/mecha_1004d/mecha_1004d_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/mecha_1004d/mecha_1004d_tex.json"), RES.getRes("resource/mecha_1004d/mecha_1004d_tex.png"));
        //
        factory.soundEventManager.addEventListener(dragonBones.EventObject.SOUND_EVENT, this._soundEventHandler, this);
        //
        this._armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");
        this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("walk");
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 100.0;
        this.addChild(this._armatureDisplay);
        //
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            this._armatureDisplay.animation.fadeIn("skill_03", 0.2);
        }, this);
        //
        this.createText("Touch to play animation.");
    }

    private _soundEventHandler(event: dragonBones.EgretEvent): void {
        const eventObject = event.eventObject;
        console.log(eventObject.name);
    }

    private _animationEventHandler(event: dragonBones.EgretEvent): void {
        const eventObject = event.eventObject;
        if (eventObject.animationState.name === "skill_03") {
            this._armatureDisplay.animation.fadeIn("walk", 0.2);
        }
    }
}