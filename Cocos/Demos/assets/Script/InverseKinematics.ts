import DragHelper from "./DragHelper";

@cc._decorator.ccclass
export default class InverseKinematics extends cc.Component {
    private _faceDir: number = 0;
    private _aimRadian: number = 0.0;
    private _offsetRotation: number = 0.0;
    private readonly _target: cc.Vec2 = cc.v2();
    private _armatureComponent: dragonBones.CocosArmatureComponent;
    private _floorBoard: dragonBones.CocosArmatureComponent;
    private _chestBone: dragonBones.Bone;
    private _leftFootBone: dragonBones.Bone;
    private _rightFootBone: dragonBones.Bone;
    private _circleBone: dragonBones.Bone;
    private _floorBoardBone: dragonBones.Bone;
    private _aimState: dragonBones.AnimationState;

    start() {
        const resources = [
            cc.url.raw("resources/mecha_1406/mecha_1406_ske.json"),
            cc.url.raw("resources/mecha_1406/mecha_1406_tex.json"),
            cc.url.raw("resources/mecha_1406/mecha_1406_tex.png"),
            cc.url.raw("resources/floor_board/floor_board_ske.json"),
            cc.url.raw("resources/floor_board/floor_board_tex.json"),
            cc.url.raw("resources/floor_board/floor_board_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            factory.parseDragonBonesData(cc.loader.getRes(resources[3]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[4]), cc.loader.getRes(resources[5]));
            //
            this._armatureComponent = factory.buildArmatureComponent("mecha_1406");
            this._floorBoard = factory.buildArmatureComponent("floor_board");
            //
            this._chestBone = this._armatureComponent.armature.getBone("chest");
            this._leftFootBone = this._armatureComponent.armature.getBone("foot_l");
            this._rightFootBone = this._armatureComponent.armature.getBone("foot_r");
            this._circleBone = this._floorBoard.armature.getBone("circle");
            this._floorBoardBone = this._floorBoard.armature.getBone("floor_board");
            //
            this._armatureComponent.animation.play("idle");
            this._aimState = this._armatureComponent.animation.fadeIn("aim", 0.1, 1, 0, "aim_group");
            this._aimState.resetToPose = false;
            this._aimState.stop();
            //
            this._floorBoard.animation.play("idle");
            this._floorBoard.armature.getSlot("player").display = this._armatureComponent.node;
            this._floorBoard.node.x = 0.0;
            this._floorBoard.node.y = -50.0;
            this.node.addChild(this._floorBoard.node);
            //
            this.node.on(cc.Node.EventType.MOUSE_MOVE, (event: cc.Event.EventMouse) => {
                this._target.x = event.getLocationX() - this.node.x;
                this._target.y = event.getLocationY() - this.node.y;
            }, this);
            //
            DragHelper.getInstance().enableDrag(this._floorBoard.armature.getSlot("circle").display);
        });
    }

    update() {
        if (!this._armatureComponent) {
            return;
        }

        this._updateAim();
        this._updateFoot();
    }

    private _updateAim(): void {
        const positionX = this._floorBoard.node.x;
        const positionY = this._floorBoard.node.y;
        const aimOffsetY = this._chestBone.global.y * this._floorBoard.node.scaleY;

        this._faceDir = this._target.x > 0.0 ? 1 : -1;
        this._armatureComponent.armature.flipX = this._faceDir < 0;

        if (this._faceDir > 0) {
            this._aimRadian = -Math.atan2(this._target.y - positionY - aimOffsetY, this._target.x - positionX);
        }
        else {
            this._aimRadian = Math.PI + Math.atan2(this._target.y - positionY - aimOffsetY, this._target.x - positionX);
            if (this._aimRadian > Math.PI) {
                this._aimRadian -= Math.PI * 2.0;
            }
        }

        // Calculate progress.
        const progress = Math.abs((this._aimRadian + Math.PI / 2.0) / Math.PI);
        // Set currentTime.
        this._aimState.currentTime = progress * this._aimState.totalTime;
    }

    private _updateFoot(): void {
        // Set floor board bone offset.
        const minRadian = -25.0 * dragonBones.Transform.DEG_RAD;
        const maxRadian = 25.0 * dragonBones.Transform.DEG_RAD;
        let circleRadian = Math.atan2(this._circleBone.global.y, this._circleBone.global.x);

        if (this._circleBone.global.x < 0.0) {
            circleRadian = dragonBones.Transform.normalizeRadian(circleRadian + Math.PI);
        }

        this._offsetRotation = Math.min(Math.max(circleRadian, minRadian), maxRadian);
        this._floorBoardBone.offset.rotation = this._offsetRotation;
        this._floorBoardBone.invalidUpdate();
        // Set foot bone offset.
        const tan = Math.tan(this._offsetRotation);
        const sinR = 1.0 / Math.sin(Math.PI * 0.5 - this._offsetRotation) - 1.0;

        this._leftFootBone.offset.y = tan * this._leftFootBone.global.x + this._leftFootBone.origin.y * sinR;
        this._leftFootBone.offset.rotation = this._offsetRotation * this._faceDir;
        this._leftFootBone.invalidUpdate();

        this._rightFootBone.offset.y = tan * this._rightFootBone.global.x + this._rightFootBone.origin.y * sinR;
        this._rightFootBone.offset.rotation = this._offsetRotation * this._faceDir;
        this._rightFootBone.invalidUpdate();
    }
}
