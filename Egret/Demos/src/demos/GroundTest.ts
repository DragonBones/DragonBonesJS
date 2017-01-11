namespace demosEgret {
    export class GroundTest extends BaseTest {
        private _left: boolean = false;
        private _right: boolean = false;
        private _tester: BoundingBoxTester = new BoundingBoxTester();
        private _mecha: Mecha = null;
        private _groudDisplay: dragonBones.EgretArmatureDisplay = null;

        public constructor() {
            super();

            this._resourceGroup = "groundTest";
            this._resourceConfigURL = "resource/groundTest.res.json";
        }

        protected _onStart(): void {
            dragonBones.DragonBones.debugDraw = true;

            //
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("ground"));

            //
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("mecha_1008d"));
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("mecha_1008d_texture_config"), RES.getRes("mecha_1008d_texture"));

            //
            this._groudDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("ground_1");
            this.addChild(this._groudDisplay);

            this._groudDisplay.x = this.stage.stageWidth * 0.5;
            this._groudDisplay.y = this.stage.stageHeight * 0.5 + 100;

            //
            this._mecha = new Mecha(this._groudDisplay);
            this.addChild(this._mecha.display);

            this._mecha.display.x = this.stage.stageWidth * 0.5;
            this._mecha.display.y = this.stage.stageHeight * 0.5 - 100;

            //
            enableDrag(this._groudDisplay);

            //
            this._tester.armatureDisplay = this._groudDisplay;
            this._tester.x = 200;
            this._tester.y = 200;
            this.addChild(this._tester);

            //
            this.stage.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);

            const keyHandler = (event: KeyboardEvent): void => {
                const isDown: boolean = event.type == "keydown";
                switch (event.keyCode) {
                    case 37:
                    case 65:
                        this._left = isDown;
                        this._updateMove(-1);
                        break;

                    case 39:
                    case 68:
                        this._left = this._right = isDown;
                        this._updateMove(1);
                        break;

                    case 38:
                    case 87:
                        if (isDown) {
                            this._mecha.jump();
                        }
                        break;

                    case 83:
                    case 40:
                        this._mecha.squat(isDown);
                        break;
                }
            }

            document.addEventListener("keydown", keyHandler);
            document.addEventListener("keyup", keyHandler);

            // Mouse move
            const mecha = this._mecha;
            const onTouchMove = egret.sys.TouchHandler.prototype.onTouchMove;
            egret.sys.TouchHandler.prototype.onTouchMove = function (x: number, y: number, touchPointID: number): void {
                onTouchMove.call(this, x, y, touchPointID);
                mecha.aim(x, y);
            }
        }

        private _updateMove(dir: number): void {
            if (this._left && this._right) {
                this._mecha.move(dir);
            }
            else if (this._left) {
                this._mecha.move(-1);
            }
            else if (this._right) {
                this._mecha.move(1);
            }
            else {
                this._mecha.move(0);
            }
        }

        private _enterFrameHandler(event: egret.Event): void {
            this._mecha.update();
        }
    }

    class Mecha {
        private static G: number = 1;
        private static JUMP_SPEED: number = 30;
        private static NORMALIZE_MOVE_SPEED: number = 2;
        private static MAX_MOVE_SPEED_FRONT: number = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
        private static MAX_MOVE_SPEED_BACK: number = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
        private static NORMAL_ANIMATION_GROUP: string = "normal";
        private static AIM_ANIMATION_GROUP: string = "aim";

        private _isSquating: boolean = false;
        private _faceDir: number = 1;
        private _aimDir: number = 0;
        private _moveState: number = 0;
        private _jumpState: number = 0;
        private _aimRadian: number = 0;
        private _speedX: number = 0;
        private _speedY: number = 0;
        private _hitHeight: number = 100;
        private _bodyRadian: number = 0;
        private _footRadian: number = 0;
        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;
        private _footL: dragonBones.Bone = null;
        private _footR: dragonBones.Bone = null;
        private _groundDisplay: dragonBones.EgretArmatureDisplay = null;

        private _aimState: dragonBones.AnimationState = null;
        private _walkState: dragonBones.AnimationState = null;
        private _target: egret.Point = new egret.Point();

        private _helpPointA: egret.Point = new egret.Point();
        private _helpPointC: egret.Point = new egret.Point();
        private _helpPointE: egret.Point = new egret.Point();

        private _helpPointB: egret.Point = new egret.Point();
        private _helpPointD: egret.Point = new egret.Point();
        private _helpPointF: egret.Point = new egret.Point();

        public get display(): dragonBones.EgretArmatureDisplay {
            return this._armatureDisplay;
        }

        public constructor(ground: dragonBones.EgretArmatureDisplay) {
            this._armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("mecha_1008d");
            this._footL = this._armatureDisplay.armature.getBone("foot_l");
            this._footR = this._armatureDisplay.armature.getBone("foot_r");
            this._groundDisplay = ground;

            this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);

            this.jump();
        }

        public move(dir: number): void {
            if (this._moveState == dir) {
                return;
            }

            this._moveState = dir;
            this._updateAnimation();
        }

        public jump(): void {
            if (this._jumpState != 0) {
                return;
            }

            this._jumpState = 1;
            this._armatureDisplay.animation.fadeIn("jump_1", 0.1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
            this._walkState = null;
        }

        public squat(isSquating: boolean): void {
            if (this._isSquating == isSquating) {
                return;
            }

            this._isSquating = isSquating;
            this._updateAnimation();
        }

        public aim(x: number, y: number): void {
            if (this._aimDir == 0) {
                this._aimDir = 10;
            }

            this._target.x = x;
            this._target.y = y;
        }

        public update(): void {
            this._updatePosition();
            this._updateAim();
        }

        private _animationEventHandler(event: dragonBones.EgretEvent): void {
            switch (event.type) {
                case dragonBones.EventObject.FADE_IN_COMPLETE:
                    if (this._jumpState != 0 && event.eventObject.animationState.name == "jump_1") {
                        if (this._jumpState == 4) {
                            this._jumpState = 0;
                            this._updateAnimation();
                        }
                        else {
                            this._jumpState = 2;
                            this._speedY = -Mecha.JUMP_SPEED;

                            if (this._moveState != 0) {
                                if (this._moveState * this._faceDir > 0) {
                                    this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                                }
                                else {
                                    this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                                }
                            }

                            this._armatureDisplay.animation.fadeIn("jump_2", 0.1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                        }
                    }
                    break;
            }
        }

        private _hitTestGround(): void {
            let isOnGround = this._jumpState != 2 && this._jumpState != 3;
            let hitGroundInJump = false;
            let hitGround = 0;
            let offsetR = 0;
            let offsetL = 0;

            if (!isOnGround) {
                if (this._speedY > 0) {
                    // 骨架轴点碰撞
                    this._groundDisplay.globalToLocal(this._armatureDisplay.x, this._armatureDisplay.y, this._helpPointA);
                    if (this._groundDisplay.armature.containsPoint(this._helpPointA.x, this._helpPointA.y)) {
                        if (!this._groundDisplay.armature.containsPoint(this._helpPointA.x - this._speedX, this._helpPointA.y - this._speedY)) {
                            hitGroundInJump = true;
                        }
                    }
                }

                if (this._armatureDisplay.y >= this._armatureDisplay.stage.stageHeight - 50) {
                    hitGroundInJump = true;
                    isOnGround = true;
                }
            }

            if (isOnGround || hitGroundInJump) {
                // 轴心线碰撞
                this._groundDisplay.globalToLocal(this._armatureDisplay.x, this._armatureDisplay.y, this._helpPointA);
                if (
                    this._groundDisplay.armature.intersectsSegment(
                        this._helpPointA.x, this._helpPointA.y - this._hitHeight,
                        this._helpPointA.x, this._helpPointB.y + this._hitHeight,
                        this._helpPointA, this._helpPointB, this._helpPointD
                    )
                ) {
                    // 轴心线碰撞点
                    const xC = this._helpPointA.x;
                    const yC = this._helpPointA.y;

                    // 轴心线碰撞平面法线
                    const pivotRadian = this._helpPointD.x;

                    // 双脚线 a-c b-d
                    this._armatureDisplay.localToGlobal(this._footR.global.x, 0, this._helpPointA);
                    this._armatureDisplay.localToGlobal(this._footL.global.x, 0, this._helpPointB);
                    this._groundDisplay.globalToLocal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
                    this._groundDisplay.globalToLocal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

                    // 双脚点
                    const xR = this._helpPointA.x;
                    const yR = this._helpPointA.y;
                    const xL = this._helpPointB.x;
                    const yL = this._helpPointB.y;

                    // 右脚碰撞点 a
                    if (
                        this._groundDisplay.armature.intersectsSegment(
                            this._helpPointA.x, this._helpPointA.y - this._hitHeight, this._helpPointA.x, this._helpPointA.y + this._hitHeight,
                            this._helpPointA, this._helpPointC, this._helpPointE
                        )
                    ) {
                        hitGround |= 1;
                    }

                    // 左脚碰撞点 b
                    if (
                        this._groundDisplay.armature.intersectsSegment(
                            this._helpPointB.x, this._helpPointB.y - this._hitHeight, this._helpPointB.x, this._helpPointB.y + this._hitHeight, 
                            this._helpPointB, this._helpPointC, this._helpPointF
                        )
                    ) {
                        hitGround |= 2;
                    }

                    if (hitGround) {
                        if (hitGround == 2) { // 右脚没有碰撞
                            this._helpPointA.x = xC + (this._footR.global.x / this._footL.global.x) * (this._helpPointB.x - xC);
                            this._helpPointA.y = yC + (this._helpPointA.x - xC) / (this._helpPointB.x - xC) * (this._helpPointB.y - yC);
                            this._helpPointE.x = pivotRadian;
                        }
                        else if (hitGround == 1) { // 左脚没有碰撞
                            this._helpPointB.x = xC + (this._footR.global.x / this._footL.global.x) * (this._helpPointA.x - xC);
                            this._helpPointB.y = yC + (this._helpPointB.x - xC) / (this._helpPointA.x - xC) * (this._helpPointA.y - yC);
                            this._helpPointF.x = pivotRadian;
                        }

                        // 双脚偏移
                        offsetR = this._helpPointA.y - yR;
                        offsetL = this._helpPointB.y - yL;

                        const k = -this._footR.global.x / (this._footL.global.x - this._footR.global.x);
                        const dX = this._helpPointB.x - this._helpPointA.x;
                        const dY = this._helpPointB.y - this._helpPointA.y;
                        const mX = this._helpPointA.x + dX * k;
                        const mY = this._helpPointA.y + dY * k;

                        this._groundDisplay.localToGlobal(mX, mY, this._helpPointC);
                        //this._armatureDisplay.x = this._helpPointC.x;
                        this._armatureDisplay.y = this._helpPointC.y;

                        const minRadian = -20 * dragonBones.DragonBones.ANGLE_TO_RADIAN;
                        const maxRadian = 20 * dragonBones.DragonBones.ANGLE_TO_RADIAN;
                        let bodyRadian = this._bodyRadian;
                        this._footRadian = xR < xL ? Math.atan2(dY, dX) : Math.atan2(-dY, -dX); // 轴心碰撞平面角度
                        if (this._faceDir > 0) {
                            if (this._footRadian < minRadian) {
                                bodyRadian = this._footRadian - minRadian;
                            }
                            else if (this._footRadian > maxRadian) {
                                bodyRadian = this._footRadian - maxRadian;
                            }
                            else {
                                bodyRadian = 0;
                            }

                        }
                        else {
                            if (this._footRadian < -maxRadian) {
                                bodyRadian = this._footRadian + maxRadian;
                            }
                            else if (this._footRadian > -minRadian) {
                                bodyRadian = this._footRadian + minRadian;
                            }
                            else {
                                bodyRadian = 0;
                            }
                        }

                        this._bodyRadian += (bodyRadian - this._bodyRadian) * 0.2;
                    }
                }
            }
            else {
                this._footRadian = 0;
                this._bodyRadian *= 0.2;
            }

            if (hitGround) {
                if (hitGroundInJump) {
                    this._jumpState = 4;
                    this._armatureDisplay.animation.fadeIn("jump_1", 0.1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }

                const offsetRRadian = this._faceDir * (this._helpPointE.x - this._bodyRadian + Math.PI * 0.5);
                const offsetLRadian = this._faceDir * (this._helpPointF.x - this._bodyRadian + Math.PI * 0.5);

                // 双脚偏移
                this._footR.offset.x = offsetR;
                this._footL.offset.x = offsetL;
                this._footR.offset.rotation = offsetRRadian;
                this._footL.offset.rotation = offsetLRadian;
            }
            else {
                if (hitGroundInJump) {
                    this._jumpState = 4;
                    this._armatureDisplay.animation.fadeIn("jump_1", 0.1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }
                else if (this._armatureDisplay.y < this._armatureDisplay.stage.stageHeight - 50) {
                    this._jumpState = 2;
                }

                this._footR.offset.x *= 0.8;
                this._footL.offset.x *= 0.8;
                this._footR.offset.rotation *= 0.8;
                this._footL.offset.rotation *= 0.8;
            }

            this._armatureDisplay.rotation = this._bodyRadian * dragonBones.DragonBones.RADIAN_TO_ANGLE;
        }

        private _updateAnimation(): void {
            if (this._jumpState != 0) {
                return;
            }

            if (this._isSquating) {
                this._speedX = 0;
                this._armatureDisplay.animation.fadeIn("jump_1", 0.3, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                this._walkState = null;
                return;
            }

            if (this._moveState == 0) {
                this._speedX = 0;
                this._armatureDisplay.animation.fadeIn("idle", 0.3, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                this._walkState = null;
            }
            else {
                if (!this._walkState) {
                    this._walkState = this._armatureDisplay.animation.fadeIn("walk", 0.3, -1, 0, Mecha.NORMAL_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup);
                    this._walkState.play();
                }

                if (this._moveState * this._faceDir > 0) {
                    this._walkState.timeScale = Mecha.MAX_MOVE_SPEED_FRONT / Mecha.NORMALIZE_MOVE_SPEED;
                }
                else {
                    this._walkState.timeScale = -Mecha.MAX_MOVE_SPEED_BACK / Mecha.NORMALIZE_MOVE_SPEED;
                }

                if (this._moveState * this._faceDir > 0) {
                    this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                }
                else {
                    this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                }
            }
        }

        private _updatePosition(): void {
            const prevX = this._armatureDisplay.x;
            const prevY = this._armatureDisplay.y;

            if (this._moveState || this._speedX != 0) {
                this._armatureDisplay.x += this._speedX * Math.cos(this._footRadian);
                if (this._armatureDisplay.x < 0) {
                    this._armatureDisplay.x = 0;
                }
                else if (this._armatureDisplay.x > this._armatureDisplay.stage.stageWidth) {
                    this._armatureDisplay.x = this._armatureDisplay.stage.stageWidth;
                }
            }

            if (this._jumpState == 2 || this._jumpState == 3) {
                if (this._speedY < 5 && this._speedY + Mecha.G >= 5) {
                    this._jumpState = 3;
                    this._armatureDisplay.animation.fadeIn("jump_3", 0.3, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }

                this._speedY += Mecha.G;
                this._armatureDisplay.y += this._speedY;
            }

            this._hitTestGround();
        }

        private _updateAim(): void {
            if (this._aimDir == 0) {
                return;
            }

            this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
            if (this._armatureDisplay.scaleX * this._faceDir < 0) {
                this._armatureDisplay.scaleX *= -1;
                if (this._moveState) {
                    this._updateAnimation();
                }
            }

            const aimOffsetY = this._armatureDisplay.armature.getBone("chest").global.y * this._armatureDisplay.scaleY;

            if (this._faceDir > 0) {
                this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                this._aimRadian -= this._bodyRadian;
            }
            else {
                this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                this._aimRadian += this._bodyRadian;
                if (this._aimRadian > Math.PI) {
                    this._aimRadian -= Math.PI * 2;
                }
            }

            let aimDir = 0;
            if (this._aimRadian > 0) {
                aimDir = -1;
            }
            else {
                aimDir = 1;
            }

            if (this._aimDir != aimDir) {
                this._aimDir = aimDir;

                // Animation mixing.
                if (this._aimDir >= 0) {
                    this._aimState = this._armatureDisplay.animation.fadeIn(
                        "aimUp", 0.001, 1,
                        0, Mecha.AIM_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                    );
                }
                else {
                    this._aimState = this._armatureDisplay.animation.fadeIn(
                        "aimDown", 0.001, 1,
                        0, Mecha.AIM_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                    );
                }

                // Add bone mask.
                //_aimState.addBoneMask("pelvis");
            }

            this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);

            //_armature.invalidUpdate("pelvis"); // Only update bone mask.
            this._armatureDisplay.armature.invalidUpdate();
        }
    }
}