"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InverseKinematics = /** @class */ (function (_super) {
    __extends(InverseKinematics, _super);
    function InverseKinematics() {
        var _this = _super.call(this) || this;
        _this._faceDir = 0;
        _this._aimRadian = 0.0;
        _this._offsetRotation = 0.0;
        _this._target = new PIXI.Point();
        _this._resources.push("resource/mecha_1406/mecha_1406_ske.json", "resource/mecha_1406/mecha_1406_tex.json", "resource/mecha_1406/mecha_1406_tex.png", "resource/floor_board/floor_board_ske.json", "resource/floor_board/floor_board_tex.json", "resource/floor_board/floor_board_tex.png");
        return _this;
    }
    InverseKinematics.prototype._onStart = function () {
        var _this = this;
        //
        this.interactive = true;
        var touchHandler = function (event) {
            _this._target.x = event.data.global.x - _this.x;
            _this._target.y = event.data.global.y - _this.y;
        };
        this.addListener("touchmove", touchHandler, this);
        this.addListener("mousemove", touchHandler, this);
        PIXI.ticker.shared.add(this._enterFrameHandler, this);
        //
        var factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/mecha_1406/mecha_1406_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1406/mecha_1406_tex.json"].data, this._pixiResources["resource/mecha_1406/mecha_1406_tex.png"].texture);
        factory.parseDragonBonesData(this._pixiResources["resource/floor_board/floor_board_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/floor_board/floor_board_tex.json"].data, this._pixiResources["resource/floor_board/floor_board_tex.png"].texture);
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
        DragHelper.getInstance().stage = this;
        DragHelper.getInstance().enableDrag(this._floorBoard.armature.getSlot("circle").display);
        //
        this.createText("Touch to drag circle to modify IK bones.");
    };
    InverseKinematics.prototype._enterFrameHandler = function (deltaTime) {
        this._updateAim();
        this._updateFoot();
    };
    InverseKinematics.prototype._updateAim = function () {
        var positionX = this._floorBoard.x;
        var positionY = this._floorBoard.y;
        var aimOffsetY = this._chestBone.global.y * this._floorBoard.scale.y;
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
        var progress = Math.abs((this._aimRadian + Math.PI / 2) / Math.PI);
        // Set currentTime.
        this._aimState.currentTime = progress * (this._aimState.totalTime);
    };
    InverseKinematics.prototype._updateFoot = function () {
        // Set floor board bone offset.
        var minRadian = -25 * dragonBones.Transform.DEG_RAD;
        var maxRadian = 25.0 * dragonBones.Transform.DEG_RAD;
        var circleRadian = Math.atan2(this._circleBone.global.y, this._circleBone.global.x);
        if (this._circleBone.global.x < 0.0) {
            circleRadian = dragonBones.Transform.normalizeRadian(circleRadian + Math.PI);
        }
        this._offsetRotation = Math.min(Math.max(circleRadian, minRadian), maxRadian);
        this._floorBoardBone.offset.rotation = this._offsetRotation;
        this._floorBoardBone.invalidUpdate();
        // Set foot bone offset.
        var tan = Math.tan(this._offsetRotation);
        var sinR = 1.0 / Math.sin(Math.PI * 0.5 - this._offsetRotation) - 1.0;
        this._leftFootBone.offset.y = tan * this._leftFootBone.global.x + this._leftFootBone.origin.y * sinR;
        this._leftFootBone.offset.rotation = this._offsetRotation * this._faceDir;
        this._leftFootBone.invalidUpdate();
        this._rightFootBone.offset.y = tan * this._rightFootBone.global.x + this._rightFootBone.origin.y * sinR;
        this._rightFootBone.offset.rotation = this._offsetRotation * this._faceDir;
        this._rightFootBone.invalidUpdate();
    };
    return InverseKinematics;
}(BaseDemo));
