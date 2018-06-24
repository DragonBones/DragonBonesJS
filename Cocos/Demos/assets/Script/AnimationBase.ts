@cc._decorator.ccclass
export default class AnimationBase extends cc.Component {
    private _armatureComponent: dragonBones.CocosArmatureComponent;

    start() {
        const resources = [
            cc.url.raw("resources/progress_bar/progress_bar_ske.json"),
            cc.url.raw("resources/progress_bar/progress_bar_tex.json"),
            cc.url.raw("resources/progress_bar/progress_bar_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            //
            this._armatureComponent = factory.buildArmatureComponent("progress_bar");
            this._armatureComponent.node.x = 0.0;
            this._armatureComponent.node.y = 0.0;
            this.node.addChild(this._armatureComponent.node);
            // Add animation event listener.
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.START, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.FADE_IN, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.FADE_OUT, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
            this._armatureComponent.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._animationEventHandler, this);
            this._armatureComponent.animation.play("idle");
            // 
            this.node.on(cc.Node.EventType.TOUCH_START, this._touchHandler, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._touchHandler, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchHandler, this);
        });
    }

    private _touchHandler(event: cc.Event.EventTouch): void {
        const progress = Math.min(Math.max((event.touch.getLocationX() - this.node.x + 300.0) / 600.0, 0.0), 1.0);

        switch (event.type) {
            case cc.Node.EventType.TOUCH_START:
                this._armatureComponent.animation.gotoAndStopByProgress("idle", progress);
                break;

            case cc.Node.EventType.TOUCH_END:
                this._armatureComponent.animation.play();
                break;

            case cc.Node.EventType.TOUCH_MOVE:
                const animationState = this._armatureComponent.animation.getState("idle");
                if (animationState) {
                    animationState.currentTime = animationState.totalTime * progress;
                }
                break;
        }
    }

    private _animationEventHandler(event: cc.Event.EventCustom): void {
        const eventObject = event.getUserData() as dragonBones.EventObject;
        console.log(eventObject.animationState.name, event.type, eventObject.name);
    }
}
