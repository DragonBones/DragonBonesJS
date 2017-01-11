namespace demosPixi {
    export namespace coreElement {
        type PointType = PIXI.Point;
        type ArmatureDisplayType = dragonBones.PixiArmatureDisplay;
        type EventType = dragonBones.EventObject;

        export class Game extends BaseTest {
            public static STAGE_WIDTH: number = 0;
            public static STAGE_HEIGHT: number = 0;
            public static GROUND: number = 300;
            public static G: number = 0.6;
            public static instance: Game = null;

            private _left: boolean = false;
            private _right: boolean = false;
            private _player: Mecha = null;
            private _bullets: Array<Bullet> = [];

            public get stage(): PIXI.Container {
                return this._stage;
            }

            protected _onStart(): void {
                Game.STAGE_WIDTH = this._renderer.width;
                Game.STAGE_HEIGHT = this._renderer.height;
                Game.GROUND = Game.STAGE_HEIGHT - 100;
                Game.instance = this;

                PIXI.loader
                    .add("dragonBonesData", "./resource/assets/CoreElement/CoreElement.json")
                    .add("textureDataA", "./resource/assets/CoreElement/CoreElement_texture_1.json")
                    .add("textureA", "./resource/assets/CoreElement/CoreElement_texture_1.png");
                PIXI.loader.once("complete", this._loadComplateHandler, this);
                PIXI.loader.load();
            }

            private _loadComplateHandler(loader: PIXI.loaders.Loader, object: dragonBones.Map<PIXI.loaders.Resource>): void {
                dragonBones.PixiFactory.factory.parseDragonBonesData(object["dragonBonesData"].data);
                dragonBones.PixiFactory.factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);

                this._stage.interactive = true;
                this._stage.on('touchstart', this._touchHandler, this);
                this._stage.on('touchend', this._touchHandler, this);
                this._stage.on('touchmove', this._touchHandler, this);
                this._stage.on('mousedown', this._touchHandler, this);
                this._stage.on('mouseup', this._touchHandler, this);
                this._stage.on('mousemove', this._touchHandler, this);
                this._stage.addChild(this._backgroud);
                this._backgroud.width = Game.STAGE_WIDTH;
                this._backgroud.height = Game.STAGE_HEIGHT;

                document.addEventListener("keydown", this._keyHandler);
                document.addEventListener("keyup", this._keyHandler);

                this._player = new Mecha();

                const text = new PIXI.Text("", { align: "center" });
                text.x = 0;
                text.y = Game.STAGE_HEIGHT - 60;
                text.scale.x = 0.8;
                text.scale.y = 0.8;
                text.text = "Press W/A/S/D to move. Press Q/E/SPACE to switch weapons.\nMouse Move to aim. Click to fire.";
                this._stage.addChild(text);
            }

            public addBullet(bullet: Bullet): void {
                this._bullets.push(bullet);
            }

            private _touchHandler(event: PIXI.interaction.InteractionEvent): void {
                this._player.aim(event.data.global.x, event.data.global.y);

                if (event.type == 'touchstart' || event.type == 'mousedown') {
                    this._player.attack(true);
                } else if (event.type == 'touchend' || event.type == 'mouseup') {
                    this._player.attack(false);
                }
            }

            private _keyHandler(event: KeyboardEvent): void {
                const isDown: boolean = event.type == "keydown";
                switch (event.keyCode) {
                    case 37:
                    case 65:
                        Game.instance._left = isDown;
                        Game.instance._updateMove(-1);
                        break;

                    case 39:
                    case 68:
                        Game.instance._right = isDown;
                        Game.instance._updateMove(1);
                        break;

                    case 38:
                    case 87:
                        if (isDown) {
                            Game.instance._player.jump();
                        }
                        break;

                    case 83:
                    case 40:
                        Game.instance._player.squat(isDown);
                        break;

                    case 81:
                        if (isDown) {
                            Game.instance._player.switchWeaponR();
                        }
                        break;

                    case 69:
                        if (isDown) {
                            Game.instance._player.switchWeaponL();
                        }
                        break;

                    case 32:
                        if (isDown) {
                            Game.instance._player.switchWeaponR();
                            Game.instance._player.switchWeaponL();
                        }
                        break;
                }
            }

            protected _renderHandler(deltaTime: number): void {
                if (this._player) {
                    this._player.update();
                }

                let i = this._bullets.length;
                while (i--) {
                    const bullet = this._bullets[i];
                    if (bullet.update()) {
                        this._bullets.splice(i, 1);
                    }
                }

                dragonBones.WorldClock.clock.advanceTime(-1);

                super._renderHandler(deltaTime);
            }

            private _updateMove(dir: number): void {
                if (this._left && this._right) {
                    this._player.move(dir);
                } else if (this._left) {
                    this._player.move(-1);
                } else if (this._right) {
                    this._player.move(1);
                } else {
                    this._player.move(0);
                }
            }
        }

        class Mecha {
            private static NORMAL_ANIMATION_GROUP: string = "normal";
            private static AIM_ANIMATION_GROUP: string = "aim";
            private static ATTACK_ANIMATION_GROUP: string = "attack";
            private static JUMP_SPEED: number = 20;
            private static NORMALIZE_MOVE_SPEED: number = 3.6;
            private static MAX_MOVE_SPEED_FRONT: number = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
            private static MAX_MOVE_SPEED_BACK: number = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
            private static WEAPON_R_LIST: Array<string> = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
            private static WEAPON_L_LIST: Array<string> = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];

            private _isJumpingA: boolean = false;
            private _isJumpingB: boolean = false;
            private _isSquating: boolean = false;
            private _isAttackingA: boolean = false;
            private _isAttackingB: boolean = false;
            private _weaponRIndex: number = 0;
            private _weaponLIndex: number = 0;
            private _faceDir: number = 1;
            private _aimDir: number = 0;
            private _moveDir: number = 0;
            private _aimRadian: number = 0;
            private _speedX: number = 0;
            private _speedY: number = 0;
            private _armature: dragonBones.Armature = null;
            private _armatureDisplay: ArmatureDisplayType = null;
            private _weaponR: dragonBones.Armature = null;
            private _weaponL: dragonBones.Armature = null;
            private _aimState: dragonBones.AnimationState = null;
            private _walkState: dragonBones.AnimationState = null;
            private _attackState: dragonBones.AnimationState = null;
            private _target: PointType = new PIXI.Point();

            public constructor() {
                this._armature = dragonBones.PixiFactory.factory.buildArmature("mecha_1502b");
                this._armatureDisplay = <ArmatureDisplayType>this._armature.display;
                this._armatureDisplay.x = Game.STAGE_WIDTH * 0.5;
                this._armatureDisplay.y = Game.GROUND;
                this._armatureDisplay.scale.set(1, 1);
                this._armature.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
                this._armature.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);

                // Mecha effects only controled by normalAnimation.
                this._armature.getSlot("effects_1").displayController = Mecha.NORMAL_ANIMATION_GROUP;
                this._armature.getSlot("effects_2").displayController = Mecha.NORMAL_ANIMATION_GROUP;

                // Get weapon childArmature.
                this._weaponR = this._armature.getSlot("weapon_r").childArmature;
                this._weaponL = this._armature.getSlot("weapon_l").childArmature;
                this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
                this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

                this._updateAnimation();

                Game.instance.stage.addChild(this._armatureDisplay);
                dragonBones.WorldClock.clock.add(this._armature);
            }

            public move(dir: number): void {
                if (this._moveDir == dir) {
                    return;
                }

                this._moveDir = dir;
                this._updateAnimation();
            }

            public jump(): void {
                if (this._isJumpingA) {
                    return;
                }

                this._isJumpingA = true;
                this._armature.animation.fadeIn("jump_1", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                this._walkState = null;
            }

            public squat(isSquating: boolean): void {
                if (this._isSquating == isSquating) {
                    return;
                }

                this._isSquating = isSquating;
                this._updateAnimation();
            }

            public attack(isAttacking: boolean): void {
                if (this._isAttackingA == isAttacking) {
                    return;
                }

                this._isAttackingA = isAttacking;
            }

            public switchWeaponR(): void {
                this._weaponRIndex++;
                if (this._weaponRIndex >= Mecha.WEAPON_R_LIST.length) {
                    this._weaponRIndex = 0;
                }

                this._weaponR.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

                const weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
                this._weaponR = dragonBones.PixiFactory.factory.buildArmature(weaponName);
                this._armature.getSlot("weapon_r").childArmature = this._weaponR;
                this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            }

            public switchWeaponL(): void {
                this._weaponLIndex++;
                if (this._weaponLIndex >= Mecha.WEAPON_L_LIST.length) {
                    this._weaponLIndex = 0;
                }

                this._weaponL.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

                const weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
                this._weaponL = dragonBones.PixiFactory.factory.buildArmature(weaponName);
                this._armature.getSlot("weapon_l").childArmature = this._weaponL;
                this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
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
                this._updateAttack();
            }

            private _animationEventHandler(event: EventType): void {
                switch (event.type) {
                    case dragonBones.EventObject.FADE_IN_COMPLETE:
                        if (event.animationState.name == "jump_1") {
                            this._isJumpingB = true;
                            this._speedY = -Mecha.JUMP_SPEED;
                            this._armature.animation.fadeIn("jump_2", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                        } else if (event.animationState.name == "jump_4") {
                            this._updateAnimation();
                        }
                        break;

                    case dragonBones.EventObject.FADE_OUT_COMPLETE:
                        if (event.animationState.name == "attack_01") {
                            this._isAttackingB = false;
                            this._attackState = null;
                        }
                        break;
                }
            }

            private static _globalPoint: PointType = new PIXI.Point();
            private _frameEventHandler(event: EventType): void {
                if (event.name == "onFire") {
                    const firePointBone = event.armature.getBone("firePoint");
                    Mecha._globalPoint.x = firePointBone.global.x;
                    Mecha._globalPoint.y = firePointBone.global.y;
                    Mecha._globalPoint = (<ArmatureDisplayType>event.armature.display).toGlobal(Mecha._globalPoint);

                    this._fire(Mecha._globalPoint);
                }
            }

            private _fire(firePoint: PointType): void {
                firePoint.x += Math.random() * 2 - 1;
                firePoint.y += Math.random() * 2 - 1;

                const radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
                const bullet = new Bullet("bullet_01", "fireEffect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);

                Game.instance.addBullet(bullet);
            }

            private _updateAnimation(): void {
                if (this._isJumpingA) {
                    return;
                }

                if (this._isSquating) {
                    this._speedX = 0;
                    this._armature.animation.fadeIn("squat", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    this._walkState = null;
                    return;
                }

                if (this._moveDir == 0) {
                    this._speedX = 0;
                    this._armature.animation.fadeIn("idle", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    this._walkState = null;
                } else {
                    if (!this._walkState) {
                        this._walkState = this._armature.animation.fadeIn("walk", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    }

                    if (this._moveDir * this._faceDir > 0) {
                        this._walkState.timeScale = Mecha.MAX_MOVE_SPEED_FRONT / Mecha.NORMALIZE_MOVE_SPEED;
                    } else {
                        this._walkState.timeScale = -Mecha.MAX_MOVE_SPEED_BACK / Mecha.NORMALIZE_MOVE_SPEED;
                    }

                    if (this._moveDir * this._faceDir > 0) {
                        this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                    } else {
                        this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                    }
                }
            }

            private _updatePosition(): void {
                if (this._speedX != 0) {
                    this._armatureDisplay.x += this._speedX;
                    if (this._armatureDisplay.x < 0) {
                        this._armatureDisplay.x = 0;
                    } else if (this._armatureDisplay.x > Game.STAGE_WIDTH) {
                        this._armatureDisplay.x = Game.STAGE_WIDTH;
                    }
                }

                if (this._speedY != 0) {
                    if (this._speedY < 5 && this._speedY + Game.G >= 5) {
                        this._armature.animation.fadeIn("jump_3", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    }

                    this._speedY += Game.G;

                    this._armatureDisplay.y += this._speedY;
                    if (this._armatureDisplay.y > Game.GROUND) {
                        this._armatureDisplay.y = Game.GROUND;
                        this._isJumpingA = false;
                        this._isJumpingB = false;
                        this._speedY = 0;
                        this._speedX = 0;
                        this._armature.animation.fadeIn("jump_4", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                        if (this._isSquating || this._moveDir) {
                            this._updateAnimation();
                        }
                    }
                }
            }

            private _updateAim(): void {
                if (this._aimDir == 0) {
                    return;
                }

                this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
                if (this._armatureDisplay.scale.x * this._faceDir < 0) {
                    this._armatureDisplay.scale.x *= -1;
                    if (this._moveDir) {
                        this._updateAnimation();
                    }
                }

                const aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scale.y;

                if (this._faceDir > 0) {
                    this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                } else {
                    this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                    if (this._aimRadian > Math.PI) {
                        this._aimRadian -= Math.PI * 2;
                    }
                }

                let aimDir = 0;
                if (this._aimRadian > 0) {
                    aimDir = -1;
                } else {
                    aimDir = 1;
                }

                if (this._aimDir != aimDir) {
                    this._aimDir = aimDir;

                    // Animation mixing.
                    if (this._aimDir >= 0) {
                        this._aimState = this._armature.animation.fadeIn(
                            "aimUp", 0, 1,
                            0, Mecha.AIM_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                        );
                    } else {
                        this._aimState = this._armature.animation.fadeIn(
                            "aimDown", 0, 1,
                            0, Mecha.AIM_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                        );
                    }

                    // Add bone mask.
                    //_aimState.addBoneMask("pelvis");
                }

                this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);

                //_armature.invalidUpdate("pelvis"); // Only update bone mask.
                this._armature.invalidUpdate();
            }

            private _updateAttack(): void {
                if (!this._isAttackingA || this._isAttackingB) {
                    return;
                }

                this._isAttackingB = true;

                // Animation mixing.
                this._attackState = this._armature.animation.fadeIn(
                    "attack_01", -1, -1,
                    0, Mecha.ATTACK_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                );

                this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
                this._attackState.addBoneMask("pelvis");
            }
        }

        class Bullet {
            private _speedX: number = 0;
            private _speedY: number = 0;

            private _armature: dragonBones.Armature = null;
            private _armatureDisplay: ArmatureDisplayType = null;
            private _effect: dragonBones.Armature = null;

            public constructor(armatureName: string, effectArmatureName: string, radian: number, speed: number, position: PointType) {
                this._speedX = Math.cos(radian) * speed;
                this._speedY = Math.sin(radian) * speed;

                this._armature = dragonBones.PixiFactory.factory.buildArmature(armatureName);
                this._armatureDisplay = <ArmatureDisplayType>this._armature.display;
                this._armatureDisplay.x = position.x;
                this._armatureDisplay.y = position.y;
                this._armatureDisplay.rotation = radian;
                this._armature.animation.play("idle");

                if (effectArmatureName) {
                    this._effect = dragonBones.PixiFactory.factory.buildArmature(effectArmatureName);
                    const effectDisplay = <ArmatureDisplayType>this._effect.display;
                    effectDisplay.rotation = radian;
                    effectDisplay.x = position.x;
                    effectDisplay.y = position.y;
                    effectDisplay.scale.set(
                        1 + Math.random() * 1,
                        1 + Math.random() * 0.5
                    );

                    if (Math.random() < 0.5) {
                        effectDisplay.scale.y *= -1;
                    }

                    this._effect.animation.play("idle");

                    dragonBones.WorldClock.clock.add(this._effect);
                    Game.instance.stage.addChild(effectDisplay);
                }

                dragonBones.WorldClock.clock.add(this._armature);
                Game.instance.stage.addChild(this._armatureDisplay);
            }

            public update(): Boolean {
                this._armatureDisplay.x += this._speedX;
                this._armatureDisplay.y += this._speedY;

                if (
                    this._armatureDisplay.x < -100 || this._armatureDisplay.x >= Game.STAGE_WIDTH + 100 ||
                    this._armatureDisplay.y < -100 || this._armatureDisplay.y >= Game.STAGE_HEIGHT + 100
                ) {
                    dragonBones.WorldClock.clock.remove(this._armature);
                    Game.instance.stage.removeChild(this._armatureDisplay);
                    this._armature.dispose();

                    if (this._effect) {
                        dragonBones.WorldClock.clock.remove(this._effect);
                        Game.instance.stage.removeChild(<ArmatureDisplayType>this._effect.display);
                        this._effect.dispose();
                    }

                    return true;
                }

                return false;
            }
        }
    }
}
