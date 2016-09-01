namespace demosEgret {
    export namespace knight {
        type PointType = egret.Point;
        type ArmatureDisplayType = dragonBones.EgretArmatureDisplay;
        type EventType = dragonBones.EgretEvent;

        export class Game extends BaseTest {
            public static STAGE_WIDTH: number = 0;
            public static STAGE_HEIGHT: number = 0;
            public static GROUND: number = 300;
            public static G: number = 0.6;
            public static instance: Game = null;

            private _left: boolean = false;
            private _right: boolean = false;
            private _player: Hero = null;
            private _bullets: Array<Bullet> = [];

            public constructor() {
                super();

                Game.instance = this;

                this._resourceConfigURL = "resource/Knight.res.json";
            }

            protected createGameScene(): void {
                Game.STAGE_WIDTH = this.stage.stageWidth;
                Game.STAGE_HEIGHT = this.stage.stageHeight;
                Game.GROUND = Game.STAGE_HEIGHT - 100;

                dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("dragonBonesData"));
                dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("textureDataA"), RES.getRes("textureA"));

                this.stage.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);

                document.addEventListener("keydown", this._keyHandler);
                document.addEventListener("keyup", this._keyHandler);

                this._player = new Hero();

                const text = new egret.TextField();
                text.x = 0;
                text.y = Game.STAGE_HEIGHT - 60;
                text.width = Game.STAGE_WIDTH;
                text.textAlign = egret.HorizontalAlign.CENTER;
                text.size = 20;
                text.text = "Press W/A/S/D to move. Press SPACE to switch weapons. Press Q/E to upgrade weapon. \nClick to attack.";
                this.addChild(text);
            }

            public addBullet(bullet: Bullet): void {
                this._bullets.push(bullet);
            }

            private _touchHandler(event: egret.TouchEvent): void {
                this._player.attack();
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
                        break;

                    case 81:
                        if (isDown) {
                            Game.instance._player.upgradeWeapon(-1);
                        }
                        break;

                    case 69:
                        if (isDown) {
                            Game.instance._player.upgradeWeapon(1);
                        }
                        break;

                    case 32:
                        if (isDown) {
                            Game.instance._player.switchWeapon();
                        }
                        break;
                }
            }

            private _enterFrameHandler(event: EventType): void {
                this._player.update();

                let i = this._bullets.length;
                while (i--) {
                    const bullet = this._bullets[i];
                    if (bullet.update()) {
                        this._bullets.splice(i, 1);
                    }
                }

                dragonBones.WorldClock.clock.advanceTime(-1);
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

        class Hero {
            private static MAX_WEAPON_LEVEL: number = 3;
            private static JUMP_SPEED: number = -20;
            private static MOVE_SPEED: number = 4;
            private static WEAPON_LIST: Array<string> = ["sword", "pike", "axe", "bow"];

            private _isJumping: boolean = false;
            private _isAttacking: boolean = false;
            private _hitCount: number = 0;
            private _weaponIndex: number = 0;
            private _weaponName: string = Hero.WEAPON_LIST[0];
            private _weaponsLevel: Array<number> = [0, 0, 0, 0];
            private _faceDir: number = 1;
            private _moveDir: number = 0;
            private _speedX: number = 0;
            private _speedY: number = 0;
            private _armature: dragonBones.Armature = null;
            private _armatureDisplay: ArmatureDisplayType = null;
            private _armArmature: dragonBones.Armature = null;

            public constructor() {
                this._armature = dragonBones.EgretFactory.factory.buildArmature("knight");
                this._armatureDisplay = <ArmatureDisplayType>this._armature.display;
                this._armatureDisplay.x = Game.STAGE_WIDTH * 0.5;
                this._armatureDisplay.y = Game.GROUND;
                this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = 1;

                this._armArmature = this._armature.getSlot("armOutside").childArmature;
                this._armArmature.addEventListener(dragonBones.EventObject.COMPLETE, this._armEventHandler, this);
                this._armArmature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._armEventHandler, this);

                this._updateAnimation();

                Game.instance.addChild(this._armatureDisplay);
                dragonBones.WorldClock.clock.add(this._armature);
            }

            public move(dir: number): void {
                if (this._moveDir == dir) {
                    return;
                }

                this._moveDir = dir;

                if (this._moveDir) {
                    if (this._faceDir != this._moveDir) {
                        this._faceDir = this._moveDir;
                        this._armatureDisplay.scaleX *= -1;
                    }
                }

                this._updateAnimation();
            }

            public jump(): void {
                if (this._isJumping) {
                    return;
                }

                this._isJumping = true;
                this._speedY = Hero.JUMP_SPEED;
                this._armature.animation.fadeIn("jump");
            }

            public attack(): void {
                if (this._isAttacking) {
                    return;
                }

                this._isAttacking = true;
                const animationName = "attack_" + this._weaponName + "_" + (this._hitCount + 1);
                this._armArmature.animation.fadeIn(animationName);
            }

            public switchWeapon(): void {
                this._isAttacking = false;
                this._hitCount = 0;

                this._weaponIndex++;
                if (this._weaponIndex >= Hero.WEAPON_LIST.length) {
                    this._weaponIndex = 0;
                }

                this._weaponName = Hero.WEAPON_LIST[this._weaponIndex];

                this._armArmature.animation.fadeIn("ready_" + this._weaponName);
            }

            public upgradeWeapon(dir: number): void {
                let weaponLevel = this._weaponsLevel[this._weaponIndex] + dir;
                weaponLevel %= Hero.MAX_WEAPON_LEVEL;
                if (weaponLevel < 0) {
                    weaponLevel = Hero.MAX_WEAPON_LEVEL + weaponLevel;
                }

                this._weaponsLevel[this._weaponIndex] = weaponLevel;

                // Replace display.
                if (this._weaponName == "bow") {
                    this._armArmature.getSlot("bow").childArmature = dragonBones.EgretFactory.factory.buildArmature("knightFolder/" + this._weaponName + "_" + (weaponLevel + 1));
                } else {
                    dragonBones.EgretFactory.factory.replaceSlotDisplay(
                        null, "weapons", "weapon",
                        "knightFolder/" + this._weaponName + "_" + (weaponLevel + 1),
                        this._armArmature.getSlot("weapon")
                    );
                }
            }

            public update(): void {
                this._updatePosition();
            }

            private static _globalPoint: PointType = new egret.Point();
            private _armEventHandler(event: EventType): void {
                switch (event.type) {
                    case dragonBones.EventObject.COMPLETE:
                        this._isAttacking = false;
                        this._hitCount = 0;
                        const animationName = "ready_" + this._weaponName;
                        this._armArmature.animation.fadeIn(animationName);
                        break;

                    case dragonBones.EventObject.FRAME_EVENT:
                        if (event.eventObject.name == "ready") {
                            this._isAttacking = false;
                            this._hitCount++;
                        } else if (event.eventObject.name == "fire") {
                            const firePointBone = event.eventObject.armature.getBone("bow");

                            (<ArmatureDisplayType>event.eventObject.armature.display).localToGlobal(firePointBone.global.x, firePointBone.global.y, Hero._globalPoint);

                            let radian = 0;
                            if (this._faceDir > 0) {
                                radian = firePointBone.global.rotation + (<ArmatureDisplayType>event.eventObject.armature.display).rotation * dragonBones.DragonBones.ANGLE_TO_RADIAN;
                            } else {
                                radian = Math.PI - (firePointBone.global.rotation + (<ArmatureDisplayType>event.eventObject.armature.display).rotation) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
                            }

                            switch (this._weaponsLevel[this._weaponIndex]) {
                                case 0:
                                    this._fire(Hero._globalPoint, radian);
                                    break;

                                case 1:
                                    this._fire(Hero._globalPoint, radian + 3 / 180 * Math.PI);
                                    this._fire(Hero._globalPoint, radian - 3 / 180 * Math.PI);
                                    break;

                                case 2:
                                    this._fire(Hero._globalPoint, radian + 6 / 180 * Math.PI);
                                    this._fire(Hero._globalPoint, radian);
                                    this._fire(Hero._globalPoint, radian - 6 / 180 * Math.PI);
                                    break;
                            }
                        }
                        break;
                }
            }

            private _fire(firePoint: PointType, radian: number): void {
                const bullet = new Bullet("arrow", radian, 20, firePoint);
                Game.instance.addBullet(bullet);
            }

            private _updateAnimation(): void {
                if (this._isJumping) {
                    return;
                }

                if (this._moveDir == 0) {
                    this._speedX = 0;
                    this._armature.animation.fadeIn("stand");
                } else {
                    this._speedX = Hero.MOVE_SPEED * this._moveDir;
                    this._armature.animation.fadeIn("run");
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
                    if (this._speedY < 0 && this._speedY + Game.G >= 0) {
                        this._armature.animation.fadeIn("fall");
                    }

                    this._speedY += Game.G;

                    this._armatureDisplay.y += this._speedY;
                    if (this._armatureDisplay.y > Game.GROUND) {
                        this._armatureDisplay.y = Game.GROUND;
                        this._isJumping = false;
                        this._speedY = 0;
                        this._speedX = 0;
                        this._updateAnimation();
                    }
                }
            }
        }

        class Bullet {
            private _speedX: number = 0;
            private _speedY: number = 0;

            private _armature: dragonBones.Armature = null;
            private _armatureDisplay: ArmatureDisplayType = null;

            public constructor(armatureName: string, radian: number, speed: number, position: PointType) {
                this._speedX = Math.cos(radian) * speed;
                this._speedY = Math.sin(radian) * speed;

                this._armature = dragonBones.EgretFactory.factory.buildArmature(armatureName);
                this._armatureDisplay = <ArmatureDisplayType>this._armature.display;
                this._armatureDisplay.x = position.x;
                this._armatureDisplay.y = position.y;
                this._armatureDisplay.rotation = radian * dragonBones.DragonBones.RADIAN_TO_ANGLE;
                this._armature.animation.play("idle");

                dragonBones.WorldClock.clock.add(this._armature);
                Game.instance.addChild(this._armatureDisplay);
            }

            public update(): Boolean {
                this._speedY += Game.G;

                this._armatureDisplay.x += this._speedX;
                this._armatureDisplay.y += this._speedY;
                this._armatureDisplay.rotation = Math.atan2(this._speedY, this._speedX) * dragonBones.DragonBones.RADIAN_TO_ANGLE;

                if (
                    this._armatureDisplay.x < -100 || this._armatureDisplay.x >= Game.STAGE_WIDTH + 100 ||
                    this._armatureDisplay.y < -100 || this._armatureDisplay.y >= Game.STAGE_HEIGHT + 100
                ) {
                    dragonBones.WorldClock.clock.remove(this._armature);
                    Game.instance.removeChild(this._armatureDisplay);
                    this._armature.dispose();

                    return true;
                }

                return false;
            }
        }
    }
}