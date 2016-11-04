namespace demosPixi {
    /**
     * How to use
     * 1. Load data.
     * 2. factory.parseDragonBonesData();
     *    factory.parseTextureAtlasData();
     * 3. armatureDisplay = factory.buildArmatureDisplay("armatureName");
     * 4. armatureDisplay.animation.play("animationName");
     * 5. addChild(armatureDisplay);
     */
    export class HelloDragonBones extends BaseTest {
        private _isDown: boolean = false;
        private _isMoved: boolean = false;
        private _isHorizontalMoved: boolean = false;
        private _armatureIndex: number = 1;
        private _animationIndex: number = 0;
        private _prevArmatureScale: number = 1;
        private _prevAnimationScale: number = 1;
        private _startPoint: PIXI.Point = new PIXI.Point();

        private _dragonBonesData: dragonBones.DragonBonesData = null;
        private _armatureDisplay: dragonBones.PixiArmatureDisplay = null;

        protected _onStart(): void {
            // Load data.
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/Old/Warrior/skeleton.json")
                .add("textureDataA", "./resource/assets/Old/Warrior/texture.json")
                .add("textureA", "./resource/assets/Old/Warrior/texture.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        }

        private _loadComplateHandler(loader: PIXI.loaders.Loader, object: dragonBones.Map<PIXI.loaders.Resource>): void {
            // Parse data.
            this._dragonBonesData = dragonBones.PixiFactory.factory.parseDragonBonesData(object["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);

            if (this._dragonBonesData) {
                // Add event listeners.
                this._stage.interactive = true;
                this._stage.on("touchstart", this._touchHandler, this);
                this._stage.on("touchend", this._touchHandler, this);
                this._stage.on("touchmove", this._touchHandler, this);
                this._stage.on("mousedown", this._touchHandler, this);
                this._stage.on("mouseup", this._touchHandler, this);
                this._stage.on("mousemove", this._touchHandler, this);

                // Add Armature.            
                this._changeArmature();

                // Add infomation.            
                const text = new PIXI.Text("", { align: "center" });
                text.x = 0;
                text.y = this._renderer.height - 60;
                text.scale.x = 0.8;
                text.scale.y = 0.8;
                text.text = "Touch screen left to change Armature / right to change Animation.\nTouch move to scale Armatrue and Animation.";
                this._stage.addChild(text);
            } else {
                throw new Error();
            }
        }
        /** 
         * Touch event listeners.
         * Touch to change Armature and Animation.
         * Touch move to change Armature and Animation scale.
         */
        private _touchHandler(event: PIXI.interaction.InteractionEvent): void {
            switch (event.type) {
                case "touchstart":
                case "mousedown":
                    this._isDown = true;
                    this._prevArmatureScale = this._armatureDisplay.scale.x;
                    this._prevAnimationScale = this._armatureDisplay.animation.timeScale;
                    this._startPoint.set(event.data.global.x, event.data.global.y);
                    break;

                case "touchend":
                case "mouseup":
                    this._isDown = false;
                    if (this._isMoved) {
                        this._isMoved = false;
                    } else {
                        const touchRight = event.data.global.x > this._renderer.width * 0.5;
                        if (this._dragonBonesData.armatureNames.length > 1 && !touchRight) {
                            this._changeArmature();
                        }

                        this._changeAnimation();
                    }
                    break;

                case "touchmove":
                case "mousemove":
                    if (this._isDown) {
                        const dX = this._startPoint.x - event.data.global.x;
                        const dY = this._startPoint.y - event.data.global.y;

                        if (!this._isMoved) {
                            const dAX = Math.abs(dX);
                            const dAY = Math.abs(dY);

                            if (dAX > 5 || dAY > 5) {
                                this._isMoved = true;
                                this._isHorizontalMoved = dAX > dAY;
                            }
                        }

                        if (this._isMoved) {
                            if (this._isHorizontalMoved) {
                                const currentAnimationScale = Math.max(-dX / 200 + this._prevAnimationScale, 0.01);
                                this._armatureDisplay.animation.timeScale = currentAnimationScale;
                            } else {
                                const currentArmatureScale = Math.max(dY / 200 + this._prevArmatureScale, 0.01);
                                this._armatureDisplay.scale.x = this._armatureDisplay.scale.y = currentArmatureScale;
                            }
                        }
                    }
                    break;
            }
        }
        /** 
         * Change Armature.
         */
        private _changeArmature(): void {
            const armatureNames = this._dragonBonesData.armatureNames;
            if (armatureNames.length == 0) {
                return;
            }

            // Remove prev Armature.
            if (this._armatureDisplay) {
                this._armatureDisplay.dispose();
                this._stage.removeChild(this._armatureDisplay);
            }

            // Get next Armature name.
            this._animationIndex = 0;
            this._armatureIndex++;
            if (this._armatureIndex >= armatureNames.length) {
                this._armatureIndex = 0;
            }

            const armatureName = armatureNames[this._armatureIndex];

            // Build Armature display. (Factory.buildArmatureDisplay() will update Armature animation by Armature display)
            this._armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay(armatureName);

            // Add FrameEvent listener.
            this._armatureDisplay.addEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            // Add Armature display.
            this._armatureDisplay.x = this._renderer.width * 0.5;
            this._armatureDisplay.y = this._renderer.height * 0.5 + 100;
            this._stage.addChild(this._armatureDisplay);

        }
        /** 
         * Change Armature animation.
         */
        private _changeAnimation(): void {
            if (!this._armatureDisplay) {
                return;
            }

            const animationNames = this._armatureDisplay.animation.animationNames;
            if (animationNames.length == 0) {
                return;
            }

            // Get next animation name.
            this._animationIndex++;
            if (this._animationIndex >= animationNames.length) {
                this._animationIndex = 0;
            }

            const animationName = animationNames[this._animationIndex];

            // Play animation.
            this._armatureDisplay.animation.play(animationName);
        }
        /** 
         * FrameEvent listener. (If animation has FrameEvent)
         */
        private _frameEventHandler(event: dragonBones.EventObject): void {
            console.log(event.animationState.name, event.name);
        }
    }
}