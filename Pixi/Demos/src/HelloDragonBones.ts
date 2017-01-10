namespace demosPixi {
    /**
     * How to use
     * 1. Load data.
     *
     * 2. ParseData.
     *  factory.parseDragonBonesData();
     *  factory.parseTextureAtlasData();
     *
     * 3. Build armature.
     *  armatureDisplay = factory.buildArmatureDisplay("armatureName");
     *
     * 4. Play animation.
     *  armatureDisplay.animation.play("animationName");
     *
     * 5. Add armature to stage.
     *  addChild(armatureDisplay);
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
        private _text: PIXI.Text = new PIXI.Text("", { align: "center" });

        private _dragonBonesData: dragonBones.DragonBonesData = null;
        private _armatureDisplay: dragonBones.PixiArmatureDisplay = null;

        protected _onStart(): void {
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
                // Add event listeners.
                this._stage.interactive = true;
                this._stage.on("touchstart", this._touchHandler, this);
                this._stage.on("touchend", this._touchHandler, this);
                this._stage.on("touchmove", this._touchHandler, this);
                this._stage.on("mousedown", this._touchHandler, this);
                this._stage.on("mouseup", this._touchHandler, this);
                this._stage.on("mousemove", this._touchHandler, this);

                // Add armature.
                this._changeArmature();

                // Add infomation.
                this._text.scale.x = 0.6;
                this._text.scale.y = 0.6;
                this._text.x = (this._renderer.width - this._text.width) * 0.5;
                this._text.y = this._renderer.height - 60;

                this._stage.addChild(this._text);
            } else {
                throw new Error();
            }
        }
        /** 
         * Touch event listeners.
         * Touch to change armature and animation.
         * Touch move to scale armature and animation.
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
         * Change armature.
         */
        private _changeArmature(): void {
            const armatureNames = this._dragonBonesData.armatureNames;
            if (armatureNames.length == 0) {
                return;
            }

            // Remove prev armature.
            if (this._armatureDisplay) {
                this._armatureDisplay.removeEvent(dragonBones.EventObject.START, this._armatureEventHandler, this);
                this._armatureDisplay.removeEvent(dragonBones.EventObject.LOOP_COMPLETE, this._armatureEventHandler, this);
                this._armatureDisplay.removeEvent(dragonBones.EventObject.COMPLETE, this._armatureEventHandler, this);
                this._armatureDisplay.removeEvent(dragonBones.EventObject.FRAME_EVENT, this._armatureEventHandler, this);
                this._armatureDisplay.dispose();
                this._stage.removeChild(this._armatureDisplay);
            }

            // Get next armature name.
            this._animationIndex = 0;
            this._armatureIndex++;
            if (this._armatureIndex >= armatureNames.length) {
                this._armatureIndex = 0;
            }

            const armatureName = armatureNames[this._armatureIndex];

            // Build armature.
            this._armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay(armatureName);

            // Add event listener.
            this._armatureDisplay.addEvent(dragonBones.EventObject.START, this._armatureEventHandler, this);
            this._armatureDisplay.addEvent(dragonBones.EventObject.LOOP_COMPLETE, this._armatureEventHandler, this);
            this._armatureDisplay.addEvent(dragonBones.EventObject.COMPLETE, this._armatureEventHandler, this);
            this._armatureDisplay.addEvent(dragonBones.EventObject.FRAME_EVENT, this._armatureEventHandler, this);

            // Add armature to stage.
            this._armatureDisplay.x = this._renderer.width * 0.5;
            this._armatureDisplay.y = this._renderer.height * 0.5 + 100;
            this._stage.addChild(this._armatureDisplay);

            // Change animation.            
            this._changeAnimation();
        }
        /** 
         * Change armature animation.
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

            // Update infomation.
            this._text.text =
                "DragonBones: " + this._armatureDisplay.armature.armatureData.parent.name +
                "    Armature: " + this._armatureDisplay.armature.name +
                "    Animation: " + this._armatureDisplay.armature.animation.lastAnimationName +
                "\nTouch screen left / right to change armature / animation.\nTouch move to scale armatrue / animation.";
            this._text.x = (this._renderer.width - this._text.width) * 0.5;
        }
        /** 
         * Armature event listener.
         */
        private _armatureEventHandler(event: dragonBones.EventObject): void {
            console.log(event.type, event.animationState.name, event.name || "");
        }
    }
}