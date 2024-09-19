"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var coreElement;
(function (coreElement) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, "CoreElement") || this;
            _this._left = false;
            _this._right = false;
            _this._bullets = [];
            return _this;
        }
        Game.prototype.preload = function () {
            _super.prototype.preload.call(this);
            this.load.dragonbone("mecha_1502b", "resource/mecha_1502b/mecha_1502b_tex.png", "resource/mecha_1502b/mecha_1502b_tex.json", "resource/mecha_1502b/mecha_1502b_ske.json");
            this.load.dragonbone("skin_1502b", "resource/skin_1502b/skin_1502b_tex.png", "resource/skin_1502b/skin_1502b_tex.json", "resource/skin_1502b/skin_1502b_ske.json");
            this.load.dragonbone("weapon_1000", "resource/weapon_1000/weapon_1000_tex.png", "resource/weapon_1000/weapon_1000_tex.json", "resource/weapon_1000/weapon_1000_ske.json");
        };
        Game.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            Game.GROUND = this.cameras.main.height - 150.0;
            Game.instance = this;
            this.input.on('pointerdown', function () { return _this._inputDown(); });
            this.input.on('pointerup', function () { return _this._inputUp(); });
            document.addEventListener("keydown", this._keyHandler);
            document.addEventListener("keyup", this._keyHandler);
            this.createText("Press W/A/S/D to move. Press Q/E/SPACE to switch weapons and skin. Touch to aim and fire.");
            this._player = new Mecha(this);
        };
        Game.prototype.update = function (time, delta) {
            if (this._player) {
                this._player.aim(this.input.x, this.input.y);
                this._player.update();
            }
            var i = this._bullets.length;
            while (i--) {
                var bullet = this._bullets[i];
                if (bullet.update()) {
                    this._bullets.splice(i, 1);
                }
            }
        };
        Game.prototype._inputDown = function () {
            this._player.attack(true);
        };
        Game.prototype._inputUp = function () {
            this._player.attack(false);
        };
        Game.prototype._keyHandler = function (event) {
            var isDown = event.type === "keydown";
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
                        Game.instance._player.switchSkin();
                    }
                    break;
            }
        };
        Game.prototype._updateMove = function (dir) {
            if (this._left && this._right) {
                this._player.move(dir);
            }
            else if (this._left) {
                this._player.move(-1);
            }
            else if (this._right) {
                this._player.move(1);
            }
            else {
                this._player.move(0);
            }
        };
        Game.prototype.addBullet = function (bullet) {
            this._bullets.push(bullet);
        };
        Game.G = 0.6;
        return Game;
    }(BaseDemo));
    coreElement.Game = Game;
    var Mecha = /** @class */ (function () {
        function Mecha(scene) {
            this._isJumpingA = false;
            this._isSquating = false;
            this._isAttackingA = false;
            this._isAttackingB = false;
            this._weaponRIndex = 0;
            this._weaponLIndex = 0;
            this._skinIndex = 0;
            this._faceDir = 1;
            this._aimDir = 0;
            this._moveDir = 0;
            this._aimRadian = 0.0;
            this._speedX = 0.0;
            this._speedY = 0.0;
            this._aimState = null;
            this._walkState = null;
            this._attackState = null;
            this._target = new Phaser.Math.Vector2();
            this._helpPoint = new Phaser.Math.Vector2();
            this._helperMatrix = new Phaser.GameObjects.Components.TransformMatrix();
            this.scene = scene;
            this.scene.add.dragonBones("skin_1502b");
            this.scene.add.dragonBones("weapon_1000");
            this._armatureDisplay = this.scene.add.armature("mecha_1502b", "mecha_1502b");
            this._armatureDisplay.x = this.scene.cameras.main.centerX;
            this._armatureDisplay.y = Game.GROUND;
            this._armature = this._armatureDisplay.armature;
            this._armature.eventDispatcher.addDBEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armature.eventDispatcher.addDBEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
            this._armature.eventDispatcher.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
            // Get weapon childArmature.
            this._weaponL = this._armature.getSlot("weapon_l").childArmature;
            this._weaponR = this._armature.getSlot("weapon_r").childArmature;
            this._weaponL.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponR.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._updateAnimation();
        }
        Mecha.prototype.move = function (dir) {
            if (this._moveDir === dir) {
                return;
            }
            this._moveDir = dir;
            this._updateAnimation();
        };
        Mecha.prototype.jump = function () {
            if (this._isJumpingA) {
                return;
            }
            this._isJumpingA = true;
            this._armature.animation.fadeIn("jump_1", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
            this._walkState = null;
        };
        Mecha.prototype.squat = function (isSquating) {
            if (this._isSquating === isSquating) {
                return;
            }
            this._isSquating = isSquating;
            this._updateAnimation();
        };
        Mecha.prototype.attack = function (isAttacking) {
            if (this._isAttackingA === isAttacking) {
                return;
            }
            this._isAttackingA = isAttacking;
        };
        Mecha.prototype.switchWeaponL = function () {
            this._weaponL.eventDispatcher.removeDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponLIndex++;
            this._weaponLIndex %= Mecha.WEAPON_L_LIST.length;
            var weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
            if (weaponName === "weapon_1502b_l" || weaponName === "weapon_1502b_r") {
                this._weaponL = this.scene.dragonbone.factory.buildArmature(weaponName, "mecha_1502b");
            }
            else {
                this._weaponL = this.scene.dragonbone.factory.buildArmature(weaponName, "weapon_1000");
            }
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
            this._weaponL.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        };
        Mecha.prototype.switchWeaponR = function () {
            this._weaponR.eventDispatcher.removeDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponRIndex++;
            this._weaponRIndex %= Mecha.WEAPON_R_LIST.length;
            var weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
            if (weaponName === "weapon_1502b_l" || weaponName === "weapon_1502b_r") {
                this._weaponR = this.scene.dragonbone.factory.buildArmature(weaponName, "mecha_1502b");
            }
            else {
                this._weaponR = this.scene.dragonbone.factory.buildArmature(weaponName, "weapon_1000");
            }
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
            this._weaponR.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        };
        Mecha.prototype.switchSkin = function () {
            this._skinIndex++;
            this._skinIndex %= Mecha.SKINS.length;
            var skinName = Mecha.SKINS[this._skinIndex];
            var skinData = this.scene.dragonbone.factory.getArmatureData(skinName).defaultSkin;
            this.scene.dragonbone.factory.replaceSkin(this._armature, skinData, false, ["weapon_l", "weapon_r"]);
        };
        Mecha.prototype.aim = function (x, y) {
            this._target.x = x;
            this._target.y = y;
        };
        Mecha.prototype.update = function () {
            this._updatePosition();
            this._updateAim();
            this._updateAttack();
        };
        Mecha.prototype._animationEventHandler = function (event) {
            switch (event.type) {
                case dragonBones.EventObject.FADE_IN_COMPLETE:
                    if (event.animationState.name === "jump_1") {
                        this._speedY = -Mecha.JUMP_SPEED;
                        if (this._moveDir !== 0) {
                            if (this._moveDir * this._faceDir > 0) {
                                this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                            }
                            else {
                                this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                            }
                        }
                        this._armature.animation.fadeIn("jump_2", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
                    }
                    break;
                case dragonBones.EventObject.FADE_OUT_COMPLETE:
                    if (event.animationState.name === "attack_01") {
                        this._isAttackingB = false;
                        this._attackState = null;
                    }
                    break;
                case dragonBones.EventObject.COMPLETE:
                    if (event.animationState.name === "jump_4") {
                        this._isJumpingA = false;
                        this._updateAnimation();
                    }
                    break;
            }
        };
        Mecha.prototype._frameEventHandler = function (event) {
            if (event.name === "fire") {
                event.armature.display.getWorldTransformMatrix(this._helperMatrix).transformPoint(event.bone.global.x, event.bone.global.y, this._helpPoint);
                this._fire(this._helpPoint);
            }
        };
        Mecha.prototype._fire = function (firePoint) {
            var radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
            var bullet = new Bullet(this.scene, "bullet_01", "fire_effect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);
            Game.instance.addBullet(bullet);
        };
        Mecha.prototype._updateAnimation = function () {
            if (this._isJumpingA) {
                return;
            }
            if (this._isSquating) {
                this._speedX = 0;
                this._armature.animation.fadeIn("squat", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
                this._walkState = null;
                return;
            }
            if (this._moveDir === 0) {
                this._speedX = 0;
                this._armature.animation.fadeIn("idle", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
                this._walkState = null;
            }
            else {
                if (this._walkState === null) {
                    this._walkState = this._armature.animation.fadeIn("walk", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    this._walkState.resetToPose = false;
                }
                if (this._moveDir * this._faceDir > 0) {
                    this._walkState.timeScale = Mecha.MAX_MOVE_SPEED_FRONT / Mecha.NORMALIZE_MOVE_SPEED;
                }
                else {
                    this._walkState.timeScale = -Mecha.MAX_MOVE_SPEED_BACK / Mecha.NORMALIZE_MOVE_SPEED;
                }
                if (this._moveDir * this._faceDir > 0) {
                    this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                }
                else {
                    this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                }
            }
        };
        Mecha.prototype._updatePosition = function () {
            if (this._speedX !== 0.0) {
                this._armatureDisplay.x += this._speedX;
                var sw = this.scene.cameras.main.width;
                var border = 20;
                if (this._armatureDisplay.x < border) {
                    this._armatureDisplay.x = border;
                }
                else if (this._armatureDisplay.x > sw - border) {
                    this._armatureDisplay.x = sw - border;
                }
            }
            if (this._speedY !== 0.0) {
                if (this._speedY < 5.0 && this._speedY + Game.G >= 5.0) {
                    this._armature.animation.fadeIn("jump_3", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
                }
                this._speedY += Game.G;
                this._armatureDisplay.y += this._speedY;
                if (this._armatureDisplay.y > Game.GROUND) {
                    this._armatureDisplay.y = Game.GROUND;
                    this._speedY = 0.0;
                    this._armature.animation.fadeIn("jump_4", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
                }
            }
        };
        Mecha.prototype._updateAim = function () {
            this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
            if (this._armatureDisplay.armature.flipX !== this._faceDir < 0) {
                this._armatureDisplay.armature.flipX = !this._armatureDisplay.armature.flipX;
                if (this._moveDir !== 0) {
                    this._updateAnimation();
                }
            }
            var aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scaleX;
            if (this._faceDir > 0) {
                this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
            }
            else {
                this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                if (this._aimRadian > Math.PI) {
                    this._aimRadian -= Math.PI * 2.0;
                }
            }
            var aimDir = 0;
            if (this._aimRadian > 0.0) {
                aimDir = -1;
            }
            else {
                aimDir = 1;
            }
            if (this._aimState === null || this._aimDir !== aimDir) {
                this._aimDir = aimDir;
                // Animation mixing.
                if (this._aimDir >= 0) {
                    this._aimState = this._armature.animation.fadeIn("aim_up", -1.0, -1, 0, Mecha.AIM_ANIMATION_GROUP);
                }
                else {
                    this._aimState = this._armature.animation.fadeIn("aim_down", -1.0, -1, 0, Mecha.AIM_ANIMATION_GROUP);
                }
                this._aimState.resetToPose = false;
            }
            this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);
            this._armature.invalidUpdate();
        };
        Mecha.prototype._updateAttack = function () {
            if (!this._isAttackingA || this._isAttackingB) {
                return;
            }
            this._isAttackingB = true;
            this._attackState = this._armature.animation.fadeIn("attack_01", -1.0, -1, 0, Mecha.ATTACK_ANIMATION_GROUP);
            this._attackState.resetToPose = false;
            this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
        };
        Mecha.JUMP_SPEED = 20;
        Mecha.NORMALIZE_MOVE_SPEED = 3.6;
        Mecha.MAX_MOVE_SPEED_FRONT = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
        Mecha.MAX_MOVE_SPEED_BACK = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
        Mecha.NORMAL_ANIMATION_GROUP = "normal";
        Mecha.AIM_ANIMATION_GROUP = "aim";
        Mecha.ATTACK_ANIMATION_GROUP = "attack";
        Mecha.WEAPON_L_LIST = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
        Mecha.WEAPON_R_LIST = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];
        Mecha.SKINS = ["mecha_1502b", "skin_a", "skin_b", "skin_c"];
        return Mecha;
    }());
    var Bullet = /** @class */ (function () {
        function Bullet(scene, armatureName, effectArmatureName, radian, speed, position) {
            this._speedX = 0.0;
            this._speedY = 0.0;
            this._effecDisplay = null;
            this._speedX = Math.cos(radian) * speed;
            this._speedY = Math.sin(radian) * speed;
            this.scene = scene;
            this._armatureDisplay = this.scene.add.armature(armatureName, "mecha_1502b");
            this._armatureDisplay.x = position.x + Math.random() * 2 - 1;
            this._armatureDisplay.y = position.y + Math.random() * 2 - 1;
            this._armatureDisplay.rotation = radian;
            if (effectArmatureName !== null) {
                this._effecDisplay = this.scene.add.armature(effectArmatureName, "mecha_1502b");
                this._effecDisplay.rotation = radian;
                this._effecDisplay.x = this._armatureDisplay.x;
                this._effecDisplay.y = this._armatureDisplay.y;
                this._effecDisplay.scaleX = 1.0 + Math.random() * 1.0;
                this._effecDisplay.scaleY = 1.0 + Math.random() * 0.5;
                if (Math.random() < 0.5) {
                    this._effecDisplay.scaleY *= -1.0;
                }
                this._effecDisplay.animation.play("idle");
            }
            this._armatureDisplay.animation.play("idle");
        }
        Bullet.prototype.update = function () {
            this._armatureDisplay.x += this._speedX;
            this._armatureDisplay.y += this._speedY;
            var cx = this.scene.cameras.main.width, cy = this.scene.cameras.main.height;
            if (this._armatureDisplay.x < -cx - 100.0 || this._armatureDisplay.x > cx + 100.0 ||
                this._armatureDisplay.y < -cy * 0.5 - 100.0 || this._armatureDisplay.y > cy + 100.0) {
                this._armatureDisplay.destroy();
                if (this._effecDisplay !== null)
                    this._effecDisplay.destroy();
                return true;
            }
            return false;
        };
        return Bullet;
    }());
})(coreElement || (coreElement = {}));
