namespace demosPixi {
    export class PerformanceTest extends BaseTest {
        private _addingArmature: boolean = false;
        private _removingArmature: boolean = false;
        private _dragonBonesData: dragonBones.DragonBonesData = null;
        private _text: PIXI.Text = null;

        private _armatures: Array<dragonBones.Armature> = [];

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

        private _loadComplateHandler(loader: PIXI.loaders.Loader, object: dragonBones.Map<PIXI.loaders.Resource>): void {
            // Parse data.
            this._dragonBonesData = dragonBones.PixiFactory.factory.parseDragonBonesData(object["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);

            if (this._dragonBonesData) {
                // Add infomation.            
                this._text = new PIXI.Text("", { align: "center" });
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
            } else {
                throw new Error();
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

            dragonBones.WorldClock.clock.advanceTime(-1);

            super._renderHandler(deltaTime);
        }

        private _addArmature(): void {
            const armature = dragonBones.PixiFactory.factory.buildArmature("DragonBoy");
            const armatureDisplay = <dragonBones.PixiArmatureDisplay>armature.display;

            armatureDisplay.scale.x = armatureDisplay.scale.y = 0.5;
            this._stage.addChild(armatureDisplay);

            armature.cacheFrameRate = 24;
            armature.animation.play("walk", 0);
            dragonBones.WorldClock.clock.add(armature);

            this._armatures.push(armature);
        }

        private _removeArmature(): void {
            if (this._armatures.length == 0) {
                return;
            }

            const armature = this._armatures.pop();
            const armatureDisplay = <dragonBones.PixiArmatureDisplay>armature.display;
            this._stage.removeChild(armatureDisplay);
            dragonBones.WorldClock.clock.remove(armature);
            armature.dispose();
        }

        private _resetPosition(): void {
            const count = this._armatures.length;
            if (!count) {
                return;
            }

            const paddingH = 50;
            const paddingV = 150;
            const gapping = 100;

            const stageWidth = this._renderer.width - paddingH * 2;
            const columnCount = Math.floor(stageWidth / gapping);
            const paddingHModify = (this._renderer.width - columnCount * gapping) * 0.5;

            const dX = stageWidth / columnCount;
            const dY = (this._renderer.height - paddingV * 2) / Math.ceil(count / columnCount);

            for (let i = 0, l = this._armatures.length; i < l; ++i) {
                const armature = this._armatures[i];
                const armatureDisplay = <dragonBones.PixiArmatureDisplay>armature.display;
                const lineY = Math.floor(i / columnCount);

                armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
                armatureDisplay.y = lineY * dY + paddingV;
            }
        }

        private _updateText(): void {
            this._text.x = 0;
            this._text.y = this._renderer.height - 60;
            this._text.width = this._renderer.width;
            this._text.text = "Count: " + this._armatures.length + " \nTouch screen left to decrease count / right to increase count.";
            this._text.scale.x = 0.8;
            this._text.scale.y = 0.8;
        }
    }
}