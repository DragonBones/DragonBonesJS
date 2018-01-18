class PerformanceTest extends BaseDemo {
    private _addingArmature: boolean = false;
    private _removingArmature: boolean = false;
    private readonly _armatures: Array<dragonBones.PixiArmatureDisplay> = [];
    private _text: PIXI.Text;

    public constructor() {
        super();

        this._resources.push(
            "resource/mecha_1406/mecha_1406_ske.dbbin",
            "resource/mecha_1406/mecha_1406_tex.json",
            "resource/mecha_1406/mecha_1406_tex.png"
        );
    }

    protected _onStart(): void {
        this.interactive = true;
        this.addListener("touchstart", this._touchHandler, this);
        this.addListener("touchend", this._touchHandler, this);
        this.addListener("mousedown", this._touchHandler, this);
        this.addListener("mouseup", this._touchHandler, this);
        PIXI.ticker.shared.add(this._enterFrameHandler, this);
        //
        this._text = this.createText("");

        for (let i = 0; i < 300; ++i) {
            this._addArmature();
        }

        this._resetPosition();
        this._updateText();
    }

    private _enterFrameHandler(deltaTime: number): void {
        if (this._addingArmature) {
            for (let i = 0; i < 10; ++i) {
                this._addArmature();
            }

            this._resetPosition();
            this._updateText();
        }

        if (this._removingArmature) {
            for (let i = 0; i < 10; ++i) {
                this._removeArmature();
            }

            this._resetPosition();
            this._updateText();
        }
    }

    private _touchHandler(event: PIXI.interaction.InteractionEvent): void {
        switch (event.type) {
            case "touchstart":
            case "mousedown":
                const touchRight = event.data.global.x > this.stageWidth * 0.5;
                this._addingArmature = touchRight;
                this._removingArmature = !touchRight;
                break;

            case "touchend":
            case "mouseup":
                this._addingArmature = false;
                this._removingArmature = false;
                break;
        }
    }

    private _addArmature(): void {
        const factory = dragonBones.PixiFactory.factory;
        if (this._armatures.length === 0) {
            factory.parseDragonBonesData(this._pixiResources["resource/mecha_1406/mecha_1406_ske.dbbin"].data);
            factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1406/mecha_1406_tex.json"].data, this._pixiResources["resource/mecha_1406/mecha_1406_tex.png"].texture);
        }

        const armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("mecha_1406");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scale.x = armatureDisplay.scale.y = 0.5;
        this.addChild(armatureDisplay);

        this._armatures.push(armatureDisplay);
    }

    private _removeArmature(): void {
        if (this._armatures.length === 0) {
            return;
        }

        const armatureDisplay = this._armatures.pop();
        this.removeChild(armatureDisplay);
        armatureDisplay.dispose();

        if (this._armatures.length === 0) {
            dragonBones.PixiFactory.factory.clear(true);
            dragonBones.BaseObject.clearPool();
        }
    }

    private _resetPosition(): void {
        const armatureCount = this._armatures.length;
        if (armatureCount === 0) {
            return;
        }

        const paddingH = 100;
        const paddingT = 200;
        const paddingB = 100;
        const gapping = 90;
        const stageWidth = this.stageWidth - paddingH * 2;
        const columnCount = Math.floor(stageWidth / gapping);
        const paddingHModify = (this.stageWidth - columnCount * gapping) * 0.5;
        const dX = stageWidth / columnCount;
        const dY = (this.stageHeight - paddingT - paddingB) / Math.ceil(armatureCount / columnCount);

        for (let i = 0, l = armatureCount; i < l; ++i) {
            const armatureDisplay = this._armatures[i];
            const lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify - this.stageWidth * 0.5;
            armatureDisplay.y = lineY * dY + paddingT - this.stageHeight * 0.5;
        }
    }

    private _updateText(): void {
        this._text.text = "Count: " + this._armatures.length + ". Touch screen left to decrease count / right to increase count.";
        this._text.x = - this._text.width * 0.5;
        this._text.y = this.stageHeight * 0.5 - 100.0;
        this.addChild(this._text);
    }
}