class InverseKinematics extends BaseDemo {
    private _faceDir: number = 0;
    private _aimRadian: number = 0.0;
    private _offsetRotation: number = 0.0;
    private readonly _target: Phaser.Point = new Phaser.Point();
    private _armatureDisplay: dragonBones.PhaserArmatureDisplay;
    private _floorBoard: dragonBones.PhaserArmatureDisplay;
    private _chestBone: dragonBones.Bone;
    private _leftFootBone: dragonBones.Bone;
    private _rightFootBone: dragonBones.Bone;
    private _circleBone: dragonBones.Bone;
    private _floorBoardBone: dragonBones.Bone;
    private _aimState: dragonBones.AnimationState;

    public constructor(game: Phaser.Game) {
        super(game);

        this._resources.push(
            "resource/mecha_1406/mecha_1406_ske.json",
            "resource/mecha_1406/mecha_1406_tex.json",
            "resource/mecha_1406/mecha_1406_tex.png",
            "resource/floor_board/floor_board_ske.json",
            "resource/floor_board/floor_board_tex.json",
            "resource/floor_board/floor_board_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.PhaserFactory.factory;
        factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_1406/mecha_1406_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/mecha_1406/mecha_1406_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/mecha_1406/mecha_1406_tex.png", true) as any).base
        );
        factory.parseDragonBonesData(this.game.cache.getItem("resource/floor_board/floor_board_ske.json", Phaser.Cache.JSON).data);
        factory.parseTextureAtlasData(
            this.game.cache.getItem("resource/floor_board/floor_board_tex.json", Phaser.Cache.JSON).data,
            (this.game.cache.getImage("resource/floor_board/floor_board_tex.png", true) as any).base
        );
        //
        this._armatureDisplay = factory.buildArmatureDisplay("mecha_1406");
        this._floorBoard = factory.buildArmatureDisplay("floor_board");
        //
        this._chestBone = this._armatureDisplay.armature.getBone("chest");
        this._leftFootBone = this._armatureDisplay.armature.getBone("foot_l");
        this._rightFootBone = this._armatureDisplay.armature.getBone("foot_r");
        this._circleBone = this._floorBoard.armature.getBone("circle");
        this._floorBoardBone = this._floorBoard.armature.getBone("floor_board");
        //
        this._armatureDisplay.animation.play("idle");
        this._aimState = this._armatureDisplay.animation.fadeIn("aim", 0.1, 1, 0, "aim_group");
        this._aimState.resetToPose = false;
        this._aimState.stop();
        //
        this._floorBoard.animation.play("idle");
        this._floorBoard.armature.getSlot("player").display = this._armatureDisplay;
        this._floorBoard.x = 0.0;
        this._floorBoard.y = 50.0;
        this.addChild(this._floorBoard);
        //
        this.inputEnabled = true;
        DragHelper.getInstance().enableDrag(this._floorBoard.armature.getSlot("circle").display);
        //
        this.createText("Touch to drag circle to modify IK bones.");
    }

    public update(): void {
        if (!this._floorBoard) {
            return;
        }

        this._target.x = this.game.input.x - this.x;
        this._target.y = this.game.input.y - this.y;

        this._updateAim();
        this._updateFoot();
    }

    private _updateAim(): void {
        const positionX = this._floorBoard.x;
        const positionY = this._floorBoard.y;
        const aimOffsetY = this._chestBone.global.y * this._floorBoard.scale.y;

        this._faceDir = this._target.x > 0.0 ? 1 : -1;
        this._armatureDisplay.armature.flipX = this._faceDir < 0;

        if (this._faceDir > 0) {
            this._aimRadian = Math.atan2(this._target.y - positionY - aimOffsetY, this._target.x - positionX);
        }
        else {
            this._aimRadian = Math.PI - Math.atan2(this._target.y - positionY - aimOffsetY, this._target.x - positionX);
            if (this._aimRadian > Math.PI) {
                this._aimRadian -= Math.PI * 2.0;
            }
        }

        // Calculate progress.
        const progress = Math.abs((this._aimRadian + Math.PI / 2) / Math.PI);
        // Set currentTime.
        this._aimState.currentTime = progress * (this._aimState.totalTime);
    }

    private _updateFoot(): void {
        // Set floor board bone offset.
        const minRadian = -25 * dragonBones.Transform.DEG_RAD;
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