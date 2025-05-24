"use strict";
var coreElement;
(function (coreElement) {
    class Game extends BaseDemo {
        constructor() {
            super();
            this._left = false;
            this._right = false;
            this._bullets = [];
            this._resources.push("resource/mecha_1502b/mecha_1502b_ske.json", "resource/mecha_1502b/mecha_1502b_tex.json", "resource/mecha_1502b/mecha_1502b_tex.png", "resource/skin_1502b/skin_1502b_ske.json", "resource/skin_1502b/skin_1502b_tex.json", "resource/skin_1502b/skin_1502b_tex.png", "resource/weapon_1000/weapon_1000_ske.json", "resource/weapon_1000/weapon_1000_tex.json", "resource/weapon_1000/weapon_1000_tex.png");
        }
        _onStart() {
            Game.GROUND = this.stageHeight * 0.5 - 150.0;
            Game.instance = this;
            //
            this.interactive = true;
            this.addListener('touchstart', this._touchHandler, this);
            this.addListener('touchend', this._touchHandler, this);
            this.addListener('touchmove', this._touchHandler, this);
            this.addListener('mousedown', this._touchHandler, this);
            this.addListener('mouseup', this._touchHandler, this);
            this.addListener('mousemove', this._touchHandler, this);
            PIXI.Ticker.shared.add(this._enterFrameHandler, this);
            document.addEventListener("keydown", this._keyHandler);
            document.addEventListener("keyup", this._keyHandler);
            //
            this.createText("Press W/A/S/D to move. Press Q/E/SPACE to switch weapons and skin. Touch to aim and fire.");
            //
            const factory = dragonBones.PixiFactory.factory;
            factory.parseDragonBonesData(this._pixiResources["resource/mecha_1502b/mecha_1502b_ske.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1502b/mecha_1502b_tex.json"], this._pixiResources["resource/mecha_1502b/mecha_1502b_tex.png"]);
            factory.parseDragonBonesData(this._pixiResources["resource/skin_1502b/skin_1502b_ske.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/skin_1502b/skin_1502b_tex.json"], this._pixiResources["resource/skin_1502b/skin_1502b_tex.png"]);
            factory.parseDragonBonesData(this._pixiResources["resource/weapon_1000/weapon_1000_ske.json"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/weapon_1000/weapon_1000_tex.json"], this._pixiResources["resource/weapon_1000/weapon_1000_tex.png"]);
            //
            this._player = new Mecha();
        }
        _touchHandler(event) {
            this._player.aim(event.global.x - this.x, event.global.y - this.y);
            if (event.type === 'touchstart' || event.type === 'mousedown' || event.type === 'pointerdown') {
                this._player.attack(true);
            }
            else if (event.type === 'touchend' || event.type === 'mouseup' || event.type === 'pointerup') {
                this._player.attack(false);
            }
        }
        _keyHandler(event) {
            const isDown = event.type === "keydown";
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
        }
        _enterFrameHandler(deltaTime) {
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
        }
        _updateMove(dir) {
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
        }
        addBullet(bullet) {
            this._bullets.push(bullet);
        }
    }
    Game.G = 0.6;
    coreElement.Game = Game;
    class Mecha {
        constructor() {
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
            this._target = new PIXI.Point();
            this._helpPoint = new PIXI.Point();
            this._armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("mecha_1502b");
            this._armatureDisplay.x = 0.0;
            this._armatureDisplay.y = Game.GROUND;
            this._armature = this._armatureDisplay.armature;
            this._armatureDisplay.on(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.on(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.on(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
            // Get weapon childArmature.
            this._weaponL = this._armature.getSlot("weapon_l").childArmature;
            this._weaponR = this._armature.getSlot("weapon_r").childArmature;
            this._weaponL.display.on(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponR.display.on(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            Game.instance.addChild(this._armatureDisplay);
            this._updateAnimation();
        }
        move(dir) {
            if (this._moveDir === dir) {
                return;
            }
            this._moveDir = dir;
            this._updateAnimation();
        }
        jump() {
            if (this._isJumpingA) {
                return;
            }
            this._isJumpingA = true;
            this._armature.animation.fadeIn("jump_1", -1.0, -1, 0, Mecha.NORMAL_ANIMATION_GROUP).resetToPose = false;
            this._walkState = null;
        }
        squat(isSquating) {
            if (this._isSquating === isSquating) {
                return;
            }
            this._isSquating = isSquating;
            this._updateAnimation();
        }
        attack(isAttacking) {
            if (this._isAttackingA === isAttacking) {
                return;
            }
            this._isAttackingA = isAttacking;
        }
        switchWeaponL() {
            this._weaponL.display.off(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponLIndex++;
            this._weaponLIndex %= Mecha.WEAPON_L_LIST.length;
            const weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
            this._weaponL = dragonBones.PixiFactory.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
            this._weaponL.display.off(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }
        switchWeaponR() {
            this._weaponR.display.off(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponRIndex++;
            this._weaponRIndex %= Mecha.WEAPON_R_LIST.length;
            const weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
            this._weaponR = dragonBones.PixiFactory.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
            this._weaponR.display.on(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }
        switchSkin() {
            this._skinIndex++;
            this._skinIndex %= Mecha.SKINS.length;
            const skinName = Mecha.SKINS[this._skinIndex];
            const skinData = dragonBones.PixiFactory.factory.getArmatureData(skinName).defaultSkin;
            dragonBones.PixiFactory.factory.replaceSkin(this._armature, skinData, false, ["weapon_l", "weapon_r"]);
        }
        aim(x, y) {
            this._target.x = x;
            this._target.y = y;
        }
        update() {
            this._updatePosition();
            this._updateAim();
            this._updateAttack();
        }
        _animationEventHandler(event) {
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
        }
        _frameEventHandler(event) {
            if (event.name === "fire") {
                this._helpPoint.x = event.bone.global.x;
                this._helpPoint.y = event.bone.global.y;
                event.armature.display.toGlobal(this._helpPoint, this._helpPoint);
                this._helpPoint.x -= Game.instance.x;
                this._helpPoint.y -= Game.instance.y;
                this._fire(this._helpPoint);
            }
        }
        _fire(firePoint) {
            const radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
            const bullet = new Bullet("bullet_01", "fire_effect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);
            Game.instance.addBullet(bullet);
        }
        _updateAnimation() {
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
        }
        _updatePosition() {
            if (this._speedX !== 0.0) {
                this._armatureDisplay.x += this._speedX;
                if (this._armatureDisplay.x < -Game.instance.stageWidth * 0.5) {
                    this._armatureDisplay.x = -Game.instance.stageWidth * 0.5;
                }
                else if (this._armatureDisplay.x > Game.instance.stageWidth * 0.5) {
                    this._armatureDisplay.x = Game.instance.stageWidth * 0.5;
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
        }
        _updateAim() {
            this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
            if (this._armatureDisplay.armature.flipX !== this._faceDir < 0) {
                this._armatureDisplay.armature.flipX = !this._armatureDisplay.armature.flipX;
                if (this._moveDir !== 0) {
                    this._updateAnimation();
                }
            }
            const aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scale.y;
            if (this._faceDir > 0) {
                this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
            }
            else {
                this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                if (this._aimRadian > Math.PI) {
                    this._aimRadian -= Math.PI * 2.0;
                }
            }
            let aimDir = 0;
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
        }
        _updateAttack() {
            if (!this._isAttackingA || this._isAttackingB) {
                return;
            }
            this._isAttackingB = true;
            this._attackState = this._armature.animation.fadeIn("attack_01", -1.0, -1, 0, Mecha.ATTACK_ANIMATION_GROUP);
            this._attackState.resetToPose = false;
            this._attackState.autoFadeOutTime = 0.1;
        }
    }
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
    class Bullet {
        constructor(armatureName, effectArmatureName, radian, speed, position) {
            this._speedX = 0.0;
            this._speedY = 0.0;
            this._effecDisplay = null;
            this._speedX = Math.cos(radian) * speed;
            this._speedY = Math.sin(radian) * speed;
            this._armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay(armatureName);
            this._armatureDisplay.x = position.x + Math.random() * 2 - 1;
            this._armatureDisplay.y = position.y + Math.random() * 2 - 1;
            this._armatureDisplay.rotation = radian;
            if (effectArmatureName !== null) {
                this._effecDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay(effectArmatureName);
                this._effecDisplay.rotation = radian;
                this._effecDisplay.x = this._armatureDisplay.x;
                this._effecDisplay.y = this._armatureDisplay.y;
                this._effecDisplay.scale.x = 1.0 + Math.random() * 1.0;
                this._effecDisplay.scale.y = 1.0 + Math.random() * 0.5;
                if (Math.random() < 0.5) {
                    this._effecDisplay.scale.y *= -1.0;
                }
                Game.instance.addChild(this._effecDisplay);
                this._effecDisplay.animation.play("idle");
            }
            Game.instance.addChild(this._armatureDisplay);
            this._armatureDisplay.animation.play("idle");
        }
        update() {
            this._armatureDisplay.x += this._speedX;
            this._armatureDisplay.y += this._speedY;
            if (this._armatureDisplay.x < -Game.instance.stageWidth * 0.5 - 100.0 || this._armatureDisplay.x > Game.instance.stageWidth * 0.5 + 100.0 ||
                this._armatureDisplay.y < -Game.instance.stageHeight * 0.5 - 100.0 || this._armatureDisplay.y > Game.instance.stageHeight * 0.5 + 100.0) {
                Game.instance.removeChild(this._armatureDisplay);
                this._armatureDisplay.dispose();
                if (this._effecDisplay !== null) {
                    Game.instance.removeChild(this._effecDisplay);
                    this._effecDisplay.dispose();
                }
                return true;
            }
            return false;
        }
    }
})(coreElement || (coreElement = {}));
