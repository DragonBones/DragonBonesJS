@cc._decorator.ccclass
export default class EyeTracking extends cc.Component {
    private _scale: number = 0.3;
    private readonly _target: cc.Vec2 = cc.v2();
    private readonly _animationNames: string[] = [
        "PARAM_ANGLE_X",
        "PARAM_ANGLE_Y",
        "PARAM_ANGLE_Z",
        "PARAM_EYE_BALL_X",
        "PARAM_EYE_BALL_Y",
        "PARAM_BODY_X",
        "PARAM_BODY_Y",
        "PARAM_BODY_Z",
        "PARAM_BODY_ANGLE_X",
        "PARAM_BODY_ANGLE_Y",
        "PARAM_BODY_ANGLE_Z",
        "PARAM_BREATH",
    ];
    private _armatureComponent: dragonBones.CocosArmatureComponent;

    start() {
        const resources = [
            cc.url.raw("resources/shizuku/shizuku_ske.json"),
            cc.url.raw("resources/shizuku/shizuku.1024/texture_00.png"),
            cc.url.raw("resources/shizuku/shizuku.1024/texture_01.png"),
            cc.url.raw("resources/shizuku/shizuku.1024/texture_02.png"),
            cc.url.raw("resources/shizuku/shizuku.1024/texture_03.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]), "shizuku");
            factory.updateTextureAtlases(
                [
                    cc.loader.getRes(resources[1]),
                    cc.loader.getRes(resources[2]),
                    cc.loader.getRes(resources[3]),
                    cc.loader.getRes(resources[4]),
                ],
                "shizuku"
            );

            this._armatureComponent = factory.buildArmatureComponent("shizuku", "shizuku");
            this._armatureComponent.animation.play("idle_00");

            this._armatureComponent.node.x = 0.0;
            this._armatureComponent.node.y = -200.0;
            this._armatureComponent.node.scaleX = this._armatureComponent.node.scaleY = this._scale;
            this.node.addChild(this._armatureComponent.node);

            this.node.on(cc.Node.EventType.MOUSE_MOVE, (event: cc.Event.EventMouse) => {
                this._setTarget(event.getLocationX(), event.getLocationY());
            }, this);
        });
    }

    update(): void {
        if (!this._armatureComponent) {
            return;
        }

        const armature = this._armatureComponent.armature;
        const animation = this._armatureComponent.animation;
        const canvas = armature.armatureData.canvas;

        let p = 0.0;
        const pX = Math.max(Math.min((this._target.x - canvas.x) / (canvas.width * 0.5), 1.0), -1.0);
        const pY = Math.max(Math.min((this._target.y + canvas.y) / (canvas.height * 0.5), 1.0), -1.0);
        for (const animationName of this._animationNames) {
            if (!animation.hasAnimation(animationName)) {
                continue;
            }

            let animationState = animation.getState(animationName, 1);
            if (!animationState) {
                animationState = animation.fadeIn(animationName, 0.1, 1, 1, animationName);
                if (animationState) {
                    animationState.resetToPose = false;
                    animationState.stop();
                }
            }

            if (!animationState) {
                continue;
            }

            switch (animationName) {
                case "PARAM_ANGLE_X":
                case "PARAM_EYE_BALL_X":
                    p = (pX + 1.0) * 0.5;
                    break;

                case "PARAM_ANGLE_Y":
                case "PARAM_EYE_BALL_Y":
                    p = (pY + 1.0) * 0.5;
                    break;

                case "PARAM_ANGLE_Z":
                    p = (-pX * pY + 1.0) * 0.5;
                    break;

                case "PARAM_BODY_X":
                case "PARAM_BODY_ANGLE_X":
                    p = (pX + 1.0) * 0.5;
                    break;

                case "PARAM_BODY_Y":
                case "PARAM_BODY_ANGLE_Y":
                    p = (-pX * pY + 1.0) * 0.5;
                    break;

                case "PARAM_BODY_Z":
                case "PARAM_BODY_ANGLE_Z":
                    p = (-pX * pY + 1.0) * 0.5;
                    break;

                case "PARAM_BREATH":
                    p = (Math.sin(armature.clock.time) + 1.0) * 0.5;
                    break;
            }

            animationState.currentTime = p * animationState.totalTime;
        }
    }

    private _setTarget(x: number, y: number) {
        this._target.x += ((x - this.node.x - this._armatureComponent.node.x) / this._scale - this._target.x) * 0.3;
        this._target.y += ((y - this.node.y - this._armatureComponent.node.y) / this._scale - this._target.y) * 0.3;
    }
}
