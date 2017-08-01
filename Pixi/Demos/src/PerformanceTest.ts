class PerformanceTest extends BaseTest {
    private _addingArmature: boolean = false;
    private _removingArmature: boolean = false;
    private readonly _text: PIXI.Text = new PIXI.Text("", { align: "center" });
    private readonly _armatures: Array<dragonBones.PixiArmatureDisplay> = [];
    private _resources: dragonBones.Map<PIXI.loaders.Resource>;

    protected _onStart(): void {
        PIXI.loader
            .add("dragonBonesData", "./resource/assets/dragon_boy_ske.json")
            .add("textureData", "./resource/assets/dragon_boy_tex.json")
            .add("texture", "./resource/assets/dragon_boy_tex.png");

        PIXI.loader.once("complete", (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) => {
            this._resources = resources;
            //
            this._text.scale.x = 0.7;
            this._text.scale.y = 0.7;
            this.stage.addChild(this._text);

            //
            this._stage.interactive = true;
            this._stage.addListener("touchstart", this._touchHandler, this);
            this._stage.addListener("touchend", this._touchHandler, this);
            this._stage.addListener("mousedown", this._touchHandler, this);
            this._stage.addListener("mouseup", this._touchHandler, this);
            PIXI.ticker.shared.add(this._enterFrameHandler, this);

            for (let i = 0; i < 100; ++i) {
                this._addArmature();
            }

            this._resetPosition();
            this._updateText();

            //
            this._startRenderTick();
        });

        PIXI.loader.load();
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
                const touchRight = event.data.global.x > this._renderer.width * 0.5;
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
        if (this._armatures.length === 0) {
            dragonBones.PixiFactory.factory.parseDragonBonesData(this._resources["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(this._resources["textureData"].data, this._resources["texture"].texture);
        }

        const armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scale.set(0.7, 0.7);
        this.stage.addChild(armatureDisplay);

        this._armatures.push(armatureDisplay);
    }

    private _removeArmature(): void {
        if (this._armatures.length === 0) {
            return;
        }

        const armatureDisplay = this._armatures.pop();
        this.stage.removeChild(armatureDisplay);
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

        const paddingH = 50;
        const paddingV = 150;
        const gapping = 100;

        const stageWidth = this.renderer.width - paddingH * 2;
        const columnCount = Math.floor(stageWidth / gapping);
        const paddingHModify = (this.renderer.width - columnCount * gapping) * 0.5;
        const dX = stageWidth / columnCount;
        const dY = (this.renderer.height - paddingV * 2) / Math.ceil(armatureCount / columnCount);

        for (let i = 0, l = armatureCount; i < l; ++i) {
            const armatureDisplay = this._armatures[i];
            const lineY = Math.floor(i / columnCount);

            armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
            armatureDisplay.y = lineY * dY + paddingV;
        }
    }

    private _updateText(): void {
        this._text.text = "Count: " + this._armatures.length + " \nTouch screen left to decrease count / right to increase count.";
        this._text.x = (this.renderer.width - this._text.width) * 0.5;
        this._text.y = this.renderer.height - 60;
        this.stage.addChild(this._text);
    }
}