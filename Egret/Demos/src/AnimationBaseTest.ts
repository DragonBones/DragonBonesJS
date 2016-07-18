namespace demosEgret {
    export class AnimationBaseTest extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/AnimationBaseTest.json";
        }

        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;
        private _factory: dragonBones.EgretFactory = new dragonBones.EgretFactory();

        protected createGameScene(): void {
            const dragonBonesData = this._factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
            this._factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

            if (dragonBonesData) {
                this._armatureDisplay = this._factory.buildArmatureDisplay(dragonBonesData.armatureNames[0]);
                this._armatureDisplay.x = this.stage.stageWidth * 0.5;
                this._armatureDisplay.y = this.stage.stageHeight * 0.5;
                this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = 0.5;
                this.addChild(this._armatureDisplay);

                // Test animation event
                this._armatureDisplay.addEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
                this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
                this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
                this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
                this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
                this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
                this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);

                // Test frame event
                this._armatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);

                //this.addEventListener(Event.ENTER_FRAME, _enterFrameHandler);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._touchHandler, this);
            } else {
                throw new Error();
            }
        }

        private _touchHandler(event: egret.TouchEvent): void {
            const progress = Math.min(Math.max((event.stageX - this._armatureDisplay.x + 150) / 300, 0), 1);
            switch (event.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    //this._armatureDisplay.animation.gotoAndPlayByTime("idle", 0.5, 1);
                    //this._armatureDisplay.animation.gotoAndStopByTime("idle", 1);

                    //this._armatureDisplay.animation.gotoAndPlayByFrame("idle", 25, 2);
                    //this._armatureDisplay.animation.gotoAndStopByFrame("idle", 50);

                    this._armatureDisplay.animation.gotoAndPlayByProgress("idle", progress, 3);
                    //this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
                    break;

                case egret.TouchEvent.TOUCH_END:
                    break;

                case egret.TouchEvent.TOUCH_MOVE:
                    if (event.touchDown && this._armatureDisplay.animation.getState("idle") && !this._armatureDisplay.animation.getState("idle").isPlaying) {
                        this._armatureDisplay.animation.gotoAndStopByProgress("idle", progress);
                    }
                    break;
            }
        }

        private _animationEventHandler(event: dragonBones.EgretEvent): void {
            console.log(event.eventObject.animationState.name, event.type, event.eventObject.name ? event.eventObject.name : "");
        }
    }
}