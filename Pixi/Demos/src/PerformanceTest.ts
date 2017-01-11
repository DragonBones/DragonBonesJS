namespace demosPixi {
    export class PerformanceTest extends BaseTest {
        private _addingArmature: boolean = false;
        private _removingArmature: boolean = false;
        private _resources: dragonBones.Map<PIXI.loaders.Resource> = null;
        private _text: PIXI.Text = null;

        private _armatures: Array<dragonBones.PixiArmatureDisplay> = [];

        protected _onStart(): void {
            document.body.appendChild(this._renderer.view);
            PIXI.ticker.shared.add(this._renderHandler, this);
            // Load data.
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/DragonBoy/DragonBoy.json")
                .add("textureDataA", "./resource/assets/DragonBoy/DragonBoy_texture_1.json")
                .add("textureA", "./resource/assets/DragonBoy/DragonBoy_texture_1.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        }

        private _loadComplateHandler(loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>): void {
            // Parse data.
            this._resources = resources;

            // Add infomation.            
            this._text = new PIXI.Text("", { align: "center" });
            this._text.scale.x = 0.6;
            this._text.scale.y = 0.6;
            this._stage.addChild(this._text);

            // Add event listeners.
            this._stage.interactive = true;
            this._stage.on("touchstart", this._touchHandler, this);
            this._stage.on("touchend", this._touchHandler, this);
            this._stage.on("mousedown", this._touchHandler, this);
            this._stage.on("mouseup", this._touchHandler, this);
            this._stage.addChild(this._backgroud);
            this._backgroud.width = this._renderer.width;
            this._backgroud.height = this._renderer.height;

            for (let i = 0; i < 100; ++i) {
                this._addArmature();
            }

            this._resetPosition();
            this._updateText();
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

        protected _renderHandler(deltaTime: number): void {
            if (this._addingArmature) {
                for (let i = 0; i < 5; ++i) {

                    this._addArmature();
                }

                this._resetPosition();
                this._updateText();
            }

            if (this._removingArmature) {
                for (let i = 0; i < 5; ++i) {

                    this._removeArmature();
                }

                this._resetPosition();
                this._updateText();
            }

            super._renderHandler(deltaTime);
        }

        private _addArmature(): void {
            if (this._armatures.length == 0) {
                dragonBones.PixiFactory.factory.parseDragonBonesData(this._resources["dragonBonesData"].data);
                dragonBones.PixiFactory.factory.parseTextureAtlasData(this._resources["textureDataA"].data, this._resources["textureA"].texture);
            }

            const armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("DragonBoy");

            armatureDisplay.scale.x = armatureDisplay.scale.y = 0.7;
            this._stage.addChild(armatureDisplay);

            armatureDisplay.armature.cacheFrameRate = 24;
            armatureDisplay.armature.animation.play("walk", 0);

            this._armatures.push(armatureDisplay);
        }

        private _removeArmature(): void {
            if (this._armatures.length == 0) {
                return;
            }

            const armatureDisplay = this._armatures.pop();
            this._stage.removeChild(armatureDisplay);
            armatureDisplay.dispose();

            if (this._armatures.length == 0) { // Test factory clear.
                dragonBones.PixiFactory.factory.clear(true);
            }
        }

        private _resetPosition(): void {
            const armatureCount = this._armatures.length;
            if (!armatureCount) {
                return;
            }

            const paddingH = 50;
            const paddingV = 150;
            const gapping = 100;

            const stageWidth = this._renderer.width - paddingH * 2;
            const columnCount = Math.floor(stageWidth / gapping);
            const paddingHModify = (this._renderer.width - columnCount * gapping) * 0.5;

            const dX = stageWidth / columnCount;
            const dY = (this._renderer.height - paddingV * 2) / Math.ceil(armatureCount / columnCount);

            for (let i = 0, l = armatureCount; i < l; ++i) {
                const armatureDisplay = this._armatures[i];
                const lineY = Math.floor(i / columnCount);

                armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
                armatureDisplay.y = lineY * dY + paddingV;
            }
        }

        private _updateText(): void {
            this._text.text = "Count: " + this._armatures.length + " \nTouch screen left / right to decrease / increase count.";
            this._text.x = (this._renderer.width - this._text.width) * 0.5;
            this._text.y = this._renderer.height - 60;
        }
    }
}