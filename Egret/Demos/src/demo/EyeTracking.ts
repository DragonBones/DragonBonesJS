class EyeTracking extends BaseDemo {
    private _scale: number = 0.3;
    private readonly _target: egret.Point = new egret.Point();
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
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(
            "resource/shizuku/shizuku_ske.json",
            "resource/shizuku/shizuku.1024/texture_00.png",
            "resource/shizuku/shizuku.1024/texture_01.png",
            "resource/shizuku/shizuku.1024/texture_02.png",
            "resource/shizuku/shizuku.1024/texture_03.png",
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/shizuku/shizuku_ske.json"), "shizuku");
        factory.updateTextureAtlases(
            [
                RES.getRes("resource/shizuku/shizuku.1024/texture_00.png"),
                RES.getRes("resource/shizuku/shizuku.1024/texture_01.png"),
                RES.getRes("resource/shizuku/shizuku.1024/texture_02.png"),
                RES.getRes("resource/shizuku/shizuku.1024/texture_03.png"),
            ],
            "shizuku"
        );

        this._armatureDisplay = factory.buildArmatureDisplay("shizuku", "shizuku");
        this._armatureDisplay.animation.play("idle_00");

        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 200.0;
        this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = this._scale;
        this._armatureDisplay.disableBatch();
        this.addChild(this._armatureDisplay);

        const onTouchMove = egret.sys.TouchHandler.prototype.onTouchMove;
        const setTarget = this._setTarget.bind(this);
        egret.sys.TouchHandler.prototype.onTouchMove = function (this: any, x: number, y: number, touchPointID: number): void {
            onTouchMove.call(this, x, y, touchPointID);
            setTarget(x, y);
        };
        this.stage.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);
    }

    private _setTarget(x: number, y: number) {
        this._target.x += ((x - this.x - this._armatureDisplay.x) / this._scale - this._target.x) * 0.3;
        this._target.y += ((y - this.y - this._armatureDisplay.y) / this._scale - this._target.y) * 0.3;
    }

    protected _enterFrameHandler(_event: egret.Event): void {
        const armature = this._armatureDisplay.armature;
        const animation = this._armatureDisplay.animation;
        const canvas = armature.armatureData.canvas;

        let p = 0.0;
        const pX = Math.max(Math.min((this._target.x - canvas.x) / (canvas.width * 0.5), 1.0), -1.0);
        const pY = -Math.max(Math.min((this._target.y - canvas.y) / (canvas.height * 0.5), 1.0), -1.0);
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
}