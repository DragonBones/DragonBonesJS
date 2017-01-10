namespace demosEgret {
    export class DragonBonesTest extends BaseTest {
        public constructor() {
            super();

            this._resourceGroup = "baseTest";
            this._resourceConfigURL = "resource/base_test.res.json";
        }

        private _isTouched: boolean = false;
        private _isTouchMoved: boolean = false;
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

        private _movie: dragonBones.Movie = null;

        private _boundingBoxTester: BoundingBoxTester = new BoundingBoxTester();

        protected _onStart(): void {
            const resourceGroup = RES.getGroupByName("search");
            if (resourceGroup && resourceGroup.length > 0) {
                for (let i = 0, l = resourceGroup.length; i < l; ++i) {
                    const groupName = resourceGroup[i].name;
                    // Armature
                    dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes(groupName));
                    const textureAtlasData = RES.getRes(groupName + "_textureData");
                    if (textureAtlasData) {
                        dragonBones.EgretFactory.factory.parseTextureAtlasData(textureAtlasData, RES.getRes(groupName + "_texture"));
                    }

                    // Egret movie.
                    const movieName = groupName + "_mov";
                    if (RES.hasRes(movieName)) {
                        dragonBones.addMovieGroup(RES.getRes(movieName), RES.getRes(groupName + "_texture"));
                    }
                }
            }

            //
            dragonBones.DragonBones.debugDraw = true;

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
                dragonBones.EgretFactory.factory.soundEventManater.addEventListener(dragonBones.EventObject.SOUND_EVENT, this._armatureEventHandler, this);

                // Add boundingBox tester.
                this._boundingBoxTester.x = 200;
                this._boundingBoxTester.y = 200;
                this.addChild(this._boundingBoxTester);

                // Add armature.
                this._changeArmature(1);
                this._changeAnimation();

                // Add infomation.
                this._text.size = 20;
                this._text.textAlign = egret.HorizontalAlign.CENTER;
                this._text.width = this.stage.stageWidth;
                this._text.x = 0;
                this._text.y = this.stage.stageHeight - 80;
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
                    if (event.target == this.stage) {
                        this._isTouched = true;
                        this._prevArmatureScale = this._armatureDisplay.scaleX;
                        this._prevAnimationScale = this._armatureDisplay.animation.timeScale;
                        this._startPoint.setTo(event.stageX, event.stageY);
                    }
                    break;

                case egret.TouchEvent.TOUCH_END:
                    if (this._isTouched) {
                        this._isTouched = false;

                        if (this._isTouchMoved) {
                            this._isTouchMoved = false;
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
                    }
                    break;

                case egret.TouchEvent.TOUCH_MOVE:
                    if (this._isTouched) {
                        const dX = this._startPoint.x - event.stageX;
                        const dY = this._startPoint.y - event.stageY;

                        if (!this._isTouchMoved) {
                            const dAX = Math.abs(dX);
                            const dAY = Math.abs(dY);

                            if (dAX > 5 || dAY > 5) {
                                this._isTouchMoved = true;
                                this._isHorizontalMoved = dAX > dAY;
                            }
                        }

                        if (this._isTouchMoved) {
                            if (this._isHorizontalMoved) {
                                const currentAnimationScale = Math.max(-dX / 200 + this._prevAnimationScale, 0.01);
                                this._armatureDisplay.animation.timeScale = currentAnimationScale;

                                if (this._movie) {
                                    this._movie.timeScale = currentAnimationScale;
                                }
                            }
                            else {
                                const currentArmatureScale = Math.max(dY / 200 + this._prevArmatureScale, 0.01);
                                this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = currentArmatureScale;

                                if (this._movie) {
                                    this._movie.scaleX = this._movie.scaleY = currentArmatureScale;
                                }
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
            let dragonBonesData = this._allDragonBonesData[this._dragonBonesIndex];
            let armatureNames = dragonBonesData.armatureNames;

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

                dragonBonesData = this._allDragonBonesData[this._dragonBonesIndex];
                armatureNames = dragonBonesData.armatureNames;
                this._armatureIndex = dir > 0 ? 0 : armatureNames.length - 1;
            }

            const armatureName = armatureNames[this._armatureIndex];

            // Remove prev armature.
            if (this._armatureDisplay) {
                disableDrag(this._armatureDisplay);
                this.removeChild(this._armatureDisplay);

                // Remove listeners.
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.START, this._armatureEventHandler, this);
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._armatureEventHandler, this);
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this._armatureEventHandler, this);
                this._armatureDisplay.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._armatureEventHandler, this);
                this._armatureDisplay.dispose();
            }

            // Build armature display.
            this._armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay(armatureName, dragonBonesData.name);
            this._armatureDisplay.armature.cacheFrameRate = 30; // Cache animation.

            // Add listener.
            this._armatureDisplay.addEventListener(dragonBones.EventObject.START, this._armatureEventHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._armatureEventHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._armatureEventHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._armatureEventHandler, this);

            // Add armature display.
            this._armatureDisplay.x = this.stage.stageWidth * 0.5;
            this._armatureDisplay.y = this.stage.stageHeight * 0.5 + 100;
            this.addChild(this._armatureDisplay);
            enableDrag(this._armatureDisplay);

            // Egret movie.
            if (this._movie) {
                disableDrag(this._movie);
                this.removeChild(this._movie);
                this._movie.removeEventListener(dragonBones.MovieEvent.START, this._movieEventHandler, this);
                this._movie.removeEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this._movieEventHandler, this);
                this._movie.removeEventListener(dragonBones.MovieEvent.COMPLETE, this._movieEventHandler, this);
                this._movie.removeEventListener(dragonBones.MovieEvent.FRAME_EVENT, this._movieEventHandler, this);
                this._movie.dispose();
                this._movie = null;
            }
            this._movie = dragonBones.buildMovie(armatureName, dragonBonesData.name);
            if (this._movie) {
                this._movie.addEventListener(dragonBones.MovieEvent.START, this._movieEventHandler, this);
                this._movie.addEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this._movieEventHandler, this);
                this._movie.addEventListener(dragonBones.MovieEvent.COMPLETE, this._movieEventHandler, this);
                this._movie.addEventListener(dragonBones.MovieEvent.FRAME_EVENT, this._movieEventHandler, this);
                this._movie.x = this.stage.stageWidth * 0.5 + 200;
                this._movie.y = this.stage.stageHeight * 0.5 + 100;
                this.addChild(this._movie);
                enableDrag(this._movie);

                //
                this._armatureDisplay.x -= 200;
            }

            // Update boundingBox tester.
            this._boundingBoxTester.armatureDisplay = this._armatureDisplay;
            this.addChild(this._boundingBoxTester);
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

            // Egret movie.
            if (this._movie) {
                this._movie.play(animationName);
            }
        }
        /** 
         * Armature listener.
         */
        private _armatureEventHandler(event: dragonBones.EgretEvent): void {
            console.log("Armature.", event.type, event.eventObject.animationState.name, event.eventObject.name || "");
        }
        /** 
         * Movie listener.
         */
        private _movieEventHandler(event: dragonBones.MovieEvent): void {
            console.log("Movie.", event.type, event.clipName, event.name || "");
        }
    }
}