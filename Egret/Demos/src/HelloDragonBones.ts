namespace demosEgret {
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
        public constructor() {
            super();

            this._resourceConfigURL = "resource/HelloDragonBones.res.json";
        }

        private _isMoved: boolean = false;
        private _isHorizontalMoved: boolean = false;
        private _prevArmatureScale: number = 1;
        private _prevAnimationScale: number = 1;
        private _startPoint: egret.Point = new egret.Point();
        private _text: egret.TextField = new egret.TextField();

        private _dragonBonesIndex: number = 0;
        private _armatureIndex: number = 0;
        private _animationIndex: number = 0;
        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;
        private _allDragonBonesData: dragonBones.DragonBonesData[] = [];
        /** 
         * Init.
         */
        protected createGameScene(): void {
            // Parse data.
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

            // 
            const allDragonBonesData = dragonBones.EgretFactory.factory.getAllDragonBonesData();
            for (let i in allDragonBonesData) {
                const dragonBonesData = allDragonBonesData[i];
                this._allDragonBonesData.push(dragonBonesData);
            }

            if (this._allDragonBonesData.length > 0) {
                // Add event listeners.
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._touchHandler, this);

                // Add sound event listener.
                dragonBones.EgretFactory.factory.soundEventManater.addEventListener(dragonBones.EventObject.SOUND_EVENT, this._frameEventHandler, this);

                // Add armature.
                this._changeArmature(1);
                this._changeAnimation();

                // Add infomation.
                this._text.x = 0;
                this._text.y = this.stage.stageHeight - 80;
                this._text.width = this.stage.stageWidth;
                this._text.textAlign = egret.HorizontalAlign.CENTER;
                this._text.size = 20;
                this.addChild(this._text);
            }
            else {
                throw new Error();
            }
        }
        /** 
         * Touch event listeners.
         * Touch to change armature and animation.
         * Touch move to change armature and animation scale.
         */
        private _touchHandler(event: egret.TouchEvent): void {
            switch (event.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    this._prevArmatureScale = this._armatureDisplay.scaleX;
                    this._prevAnimationScale = this._armatureDisplay.animation.timeScale;
                    this._startPoint.setTo(event.stageX, event.stageY);
                    break;

                case egret.TouchEvent.TOUCH_END:
                    if (this._isMoved) {
                        this._isMoved = false;
                    }
                    else {
                        if (this._allDragonBonesData.length > 1 || this._allDragonBonesData[0].armatureNames.length > 1) {
                            const isSide = Math.abs(this.stage.stageWidth / 2 - event.stageX) > this.stage.stageWidth / 6;
                            const touchRight = event.stageX > this.stage.stageWidth / 2;
                            if (isSide) {
                                if (touchRight) {
                                    this._changeArmature(1);
                                }
                                else {
                                    this._changeArmature(-1);
                                }
                            }
                        }

                        this._changeAnimation();
                    }
                    break;

                case egret.TouchEvent.TOUCH_MOVE:
                    if (event.touchDown) {
                        const dX = this._startPoint.x - event.stageX;
                        const dY = this._startPoint.y - event.stageY;

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
                            }
                            else {
                                const currentArmatureScale = Math.max(dY / 200 + this._prevArmatureScale, 0.01);
                                this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = currentArmatureScale;
                            }
                        }
                    }
                    break;
            }
        }
        /** 
         * Change armature.
         */
        private _changeArmature(dir: number): void {
            let dragonBonesChange = false;
            let armatureNames = this._allDragonBonesData[this._dragonBonesIndex].armatureNames;

            // Get next armature name.
            this._animationIndex = 0;
            this._armatureIndex += dir > 0 ? 1 : -1;
            if (this._armatureIndex < 0) {
                dragonBonesChange = true;
                this._dragonBonesIndex--;
            }
            else if (this._armatureIndex >= armatureNames.length) {
                this._armatureIndex = 0;
                dragonBonesChange = true;
                this._dragonBonesIndex++;
            }

            if (dragonBonesChange) {
                if (this._dragonBonesIndex < 0) {
                    this._dragonBonesIndex = this._allDragonBonesData.length - 1;
                }
                else if (this._dragonBonesIndex >= this._allDragonBonesData.length) {
                    this._dragonBonesIndex = 0;
                }

                armatureNames = this._allDragonBonesData[this._dragonBonesIndex].armatureNames;
                this._armatureIndex = dir > 0 ? 0 : armatureNames.length - 1;
            }

            const armatureName = armatureNames[this._armatureIndex];

            // Remove prev armature.
            if (this._armatureDisplay) {
                // Remove listeners.
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.START, this._animationHandler, this);
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationHandler, this);
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

                this._armatureDisplay.dispose();
                this.removeChild(this._armatureDisplay);
            }

            // Build armature display.
            this._armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay(armatureName);
            //this._armatureDisplay.armature.cacheFrameRate = 24; // Cache animation.

            // Add animation listener.
            this._armatureDisplay.addEventListener(dragonBones.EventObject.START, this._animationHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationHandler, this);
            // Add frame event listener.
            this._armatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            // Add armature display.
            this._armatureDisplay.x = this.stage.stageWidth * 0.5;
            this._armatureDisplay.y = this.stage.stageHeight * 0.5 + 100;
            this.addChild(this._armatureDisplay);
        }
        /** 
         * Change armature animation.
         */
        private _changeAnimation(): void {
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

            // Infomation.
            this._text.text =
                "DragonBones: " + this._armatureDisplay.armature.armatureData.parent.name +
                "    Armature: " + this._armatureDisplay.armature.name +
                "    Animation: " + this._armatureDisplay.armature.animation.lastAnimationName +
                "\nTouch screen left/right to change prev/next armature.\nTouch center to play next animation.";
        }
        /** 
         * Animation listener.
         */
        private _animationHandler(event: dragonBones.EgretEvent): void {
            console.log(event.type, event.eventObject.animationState.name);
        }
        /** 
         * Frame event listener. (If animation has frame event)
         */
        private _frameEventHandler(event: dragonBones.EgretEvent): void {
            console.log(event.type, event.eventObject.animationState.name, event.eventObject.name);
        }
    }
}