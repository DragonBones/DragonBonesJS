namespace coreElement {
    type PointType = PIXI.Point;
    type ArmatureDisplayType = dragonBones.PixiArmatureDisplay;
    type EventType = dragonBones.EventObject;

    export class Game extends BaseTest {
        public static STAGE_WIDTH: number;
        public static STAGE_HEIGHT: number;
        public static GROUND: number;
        public static G: number = 0.6;
        public static instance: Game;

        private _left: boolean = false;
        private _right: boolean = false;
        private _player: Mecha;
        private readonly _bullets: Array<Bullet> = [];

        protected _onStart(): void {
            PIXI.loader
                .add("dataA", "./resource/assets/core_element/mecha_1502b_ske.json")
                .add("textureDataA", "./resource/assets/core_element/mecha_1502b_tex.json")
                .add("textureA", "./resource/assets/core_element/mecha_1502b_tex.png")
                .add("dataB", "./resource/assets/core_element/skin_1502b_ske.json")
                .add("textureDataB", "./resource/assets/core_element/skin_1502b_tex.json")
                .add("textureB", "./resource/assets/core_element/skin_1502b_tex.png")
                .add("dataC", "./resource/assets/core_element/weapon_1000_ske.json")
                .add("textureDataC", "./resource/assets/core_element/weapon_1000_tex.json")
                .add("textureC", "./resource/assets/core_element/weapon_1000_tex.png");

            PIXI.loader.once("complete", (loader: PIXI.loaders.Loader, resources: dragonBones.Map<PIXI.loaders.Resource>) => {
                Game.STAGE_WIDTH = this._stage.width;
                Game.STAGE_HEIGHT = this._stage.height;
                Game.GROUND = Game.STAGE_HEIGHT - 150;
                Game.instance = this;
                PIXI.ticker.shared.add(this._enterFrameHandler, this);

                const factory = dragonBones.PixiFactory.factory;
                factory.parseDragonBonesData(resources["dataA"].data);
                factory.parseTextureAtlasData(resources["textureDataA"].data, resources["textureA"].texture);
                factory.parseDragonBonesData(resources["dataB"].data);
                factory.parseTextureAtlasData(resources["textureDataB"].data, resources["textureB"].texture);
                factory.parseDragonBonesData(resources["dataC"].data);
                factory.parseTextureAtlasData(resources["textureDataC"].data, resources["textureC"].texture);

                this._player = new Mecha();

                // Listener.
                this._stage.interactive = true;
                this._stage.addListener('touchstart', this._touchHandler, this);
                this._stage.addListener('touchend', this._touchHandler, this);
                this._stage.addListener('touchmove', this._touchHandler, this);
                this._stage.addListener('mousedown', this._touchHandler, this);
                this._stage.addListener('mouseup', this._touchHandler, this);
                this._stage.addListener('mousemove', this._touchHandler, this);
                this._stage.addChild(this._backgroud);
                document.addEventListener("keydown", this._keyHandler);
                document.addEventListener("keyup", this._keyHandler);

                // Info.
                const text = new PIXI.Text("", { align: "center" });
                text.text = "Press W/A/S/D to move. Press Q/E to switch weapons. Press SPACE to switch skin.\nMouse Move to aim. Click to fire.";
                text.scale.x = 0.7;
                text.scale.y = 0.7;
                text.x = (Game.STAGE_WIDTH - text.width) * 0.5;
                text.y = Game.STAGE_HEIGHT - 60;
                this._stage.addChild(text);

                //
                this._startRenderTick();
            });

            PIXI.loader.load();
        }

        private _touchHandler(event: PIXI.interaction.InteractionEvent): void {
            this._player.aim(event.data.global.x, event.data.global.y);

            if (event.type === 'touchstart' || event.type === 'mousedown') {
                this._player.attack(true);
            }
            else if (event.type === 'touchend' || event.type === 'mouseup') {
                this._player.attack(false);
            }
        }

        private _keyHandler(event: KeyboardEvent): void {
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

        private _enterFrameHandler(deltaTime: number): void { // Make sure game update before dragonBones update.
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

        private _updateMove(dir: number): void {
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

        public addBullet(bullet: Bullet): void {
            this._bullets.push(bullet);
        }
    }

    class Mecha {
        private static readonly JUMP_SPEED: number = 20;
        private static readonly NORMALIZE_MOVE_SPEED: number = 3.6;
        private static readonly MAX_MOVE_SPEED_FRONT: number = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
        private static readonly MAX_MOVE_SPEED_BACK: number = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
        private static readonly NORMAL_ANIMATION_GROUP: string = "normal";
        private static readonly AIM_ANIMATION_GROUP: string = "aim";
        private static readonly ATTACK_ANIMATION_GROUP: string = "attack";
        private static readonly WEAPON_L_LIST: Array<string> = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
        private static readonly WEAPON_R_LIST: Array<string> = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];
        private static readonly SKINS: Array<string> = ["mecha_1502b", "skin_a", "skin_b", "skin_c"];

        private _isJumpingA: boolean = false;
        private _isJumpingB: boolean = false;
        private _isSquating: boolean = false;
        private _isAttackingA: boolean = false;
        private _isAttackingB: boolean = false;
        private _weaponRIndex: number = 0;
        private _weaponLIndex: number = 0;
        private _skinIndex: number = 0;
        private _faceDir: number = 1;
        private _aimDir: number = 0;
        private _moveDir: number = 0;
        private _aimRadian: number = 0.0;
        private _speedX: number = 0.0;
        private _speedY: number = 0.0;
        private _armature: dragonBones.Armature;
        private _armatureDisplay: ArmatureDisplayType;
        private _weaponL: dragonBones.Armature;
        private _weaponR: dragonBones.Armature;
        private _aimState: dragonBones.AnimationState | null = null;
        private _walkState: dragonBones.AnimationState | null = null;
        private _attackState: dragonBones.AnimationState | null = null;
        private readonly _target: PointType = new PIXI.Point();
        private readonly _helpPoint: PointType = new PIXI.Point();

        public constructor() {
            this._armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("mecha_1502b");
            this._armatureDisplay.x = Game.STAGE_WIDTH * 0.5;
            this._armatureDisplay.y = Game.GROUND;
            this._armature = this._armatureDisplay.armature;
            this._armature.eventDispatcher.addEvent(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armature.eventDispatcher.addEvent(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
            this._armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);

            // Get weapon childArmature.
            this._weaponL = this._armature.getSlot("weapon_l").childArmature;
            this._weaponR = this._armature.getSlot("weapon_r").childArmature;
            this._weaponL.eventDispatcher.addEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponR.eventDispatcher.addEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            Game.instance.stage.addChild(this._armatureDisplay);
            this._updateAnimation();
        }

        public move(dir: number): void {
            if (this._moveDir === dir) {
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
            this._armature.animation.fadeIn(
                "jump_1", -1.0, -1,
                0, Mecha.NORMAL_ANIMATION_GROUP
            ).resetToPose = false;

            this._walkState = null;
        }

        public squat(isSquating: boolean): void {
            if (this._isSquating === isSquating) {
                return;
            }

            this._isSquating = isSquating;
            this._updateAnimation();
        }

        public attack(isAttacking: boolean): void {
            if (this._isAttackingA === isAttacking) {
                return;
            }

            this._isAttackingA = isAttacking;
        }

        public switchWeaponL(): void {
            this._weaponL.eventDispatcher.removeEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            this._weaponLIndex++;
            this._weaponLIndex %= Mecha.WEAPON_L_LIST.length;
            const weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
            this._weaponL = dragonBones.PixiFactory.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
            this._weaponL.eventDispatcher.addEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        public switchWeaponR(): void {
            this._weaponR.eventDispatcher.removeEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            this._weaponRIndex++;
            this._weaponRIndex %= Mecha.WEAPON_R_LIST.length;
            const weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
            this._weaponR = dragonBones.PixiFactory.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
            this._weaponR.eventDispatcher.addEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        public switchSkin(): void {
            this._skinIndex++;
            this._skinIndex %= Mecha.SKINS.length;
            const skinName = Mecha.SKINS[this._skinIndex];
            const skinData = dragonBones.PixiFactory.factory.getArmatureData(skinName).defaultSkin;
            dragonBones.PixiFactory.factory.changeSkin(this._armature, skinData, ["weapon_l", "weapon_r"]);
        }

        public aim(x: number, y: number): void {
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
                    if (event.animationState.name === "jump_1") {
                        this._isJumpingB = true;
                        this._speedY = -Mecha.JUMP_SPEED;

                        if (this._moveDir !== 0) {
                            if (this._moveDir * this._faceDir > 0) {
                                this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                            }
                            else {
                                this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                            }
                        }

                        this._armature.animation.fadeIn(
                            "jump_2", -1.0, -1,
                            0, Mecha.NORMAL_ANIMATION_GROUP
                        ).resetToPose = false;
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
                        this._isJumpingB = false;
                        this._updateAnimation();
                    }
                    break;
            }
        }

        private _frameEventHandler(event: EventType): void {
            if (event.name === "fire") {
                this._helpPoint.x = event.bone.global.x;
                this._helpPoint.y = event.bone.global.y;
                this._helpPoint.copy((<ArmatureDisplayType>event.armature.display).toGlobal(this._helpPoint));

                this._fire(this._helpPoint);
            }
        }

        private _fire(firePoint: PointType): void {
            const radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
            const bullet = new Bullet("bullet_01", "fire_effect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);
            Game.instance.addBullet(bullet);
        }

        private _updateAnimation(): void {
            if (this._isJumpingA) {
                return;
            }

            if (this._isSquating) {
                this._speedX = 0;
                this._armature.animation.fadeIn(
                    "squat", -1.0, -1,
                    0, Mecha.NORMAL_ANIMATION_GROUP
                ).resetToPose = false;

                this._walkState = null;
                return;
            }

            if (this._moveDir === 0) {
                this._speedX = 0;
                this._armature.animation.fadeIn(
                    "idle", -1.0, -1, 0,
                    Mecha.NORMAL_ANIMATION_GROUP
                ).resetToPose = false;

                this._walkState = null;
            }
            else {
                if (this._walkState === null) {
                    this._walkState = this._armature.animation.fadeIn(
                        "walk", -1.0, -1,
                        0, Mecha.NORMAL_ANIMATION_GROUP
                    );

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

        private _updatePosition(): void {
            if (this._speedX !== 0.0) {
                this._armatureDisplay.x += this._speedX;
                if (this._armatureDisplay.x < 0) {
                    this._armatureDisplay.x = 0;
                }
                else if (this._armatureDisplay.x > Game.STAGE_WIDTH) {
                    this._armatureDisplay.x = Game.STAGE_WIDTH;
                }
            }

            if (this._speedY !== 0.0) {
                if (this._speedY < 5.0 && this._speedY + Game.G >= 5.0) {
                    this._armature.animation.fadeIn(
                        "jump_3", -1.0, -1, 0
                        , Mecha.NORMAL_ANIMATION_GROUP
                    ).resetToPose = false;
                }

                this._speedY += Game.G;
                this._armatureDisplay.y += this._speedY;

                if (this._armatureDisplay.y > Game.GROUND) {
                    this._armatureDisplay.y = Game.GROUND;
                    this._speedY = 0.0;
                    this._armature.animation.fadeIn(
                        "jump_4", -1.0, -1,
                        0, Mecha.NORMAL_ANIMATION_GROUP
                    ).resetToPose = false;
                }
            }
        }

        private _updateAim(): void {
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
                    this._aimState = this._armature.animation.fadeIn(
                        "aim_up", -1.0, -1,
                        0, Mecha.AIM_ANIMATION_GROUP
                    );
                }
                else {
                    this._aimState = this._armature.animation.fadeIn(
                        "aim_down", -1.0, -1,
                        0, Mecha.AIM_ANIMATION_GROUP
                    );
                }

                this._aimState.resetToPose = false;
            }

            this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);
            this._armature.invalidUpdate();
        }

        private _updateAttack(): void {
            if (!this._isAttackingA || this._isAttackingB) {
                return;
            }

            this._isAttackingB = true;
            this._attackState = this._armature.animation.fadeIn(
                "attack_01", -1.0, -1,
                0, Mecha.ATTACK_ANIMATION_GROUP
            );

            this._attackState.resetToPose = false;
            this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
        }
    }

    class Bullet {
        private _speedX: number = 0.0;
        private _speedY: number = 0.0;

        private _armatureDisplay: ArmatureDisplayType;
        private _effecDisplay: ArmatureDisplayType | null = null;

        public constructor(armatureName: string, effectArmatureName: string | null, radian: number, speed: number, position: PointType) {
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
                this._effecDisplay.scale.set(
                    1 + Math.random() * 1,
                    1 + Math.random() * 0.5
                );
                if (Math.random() < 0.5) {
                    this._effecDisplay.scale.y *= -1;
                }

                Game.instance.stage.addChild(this._effecDisplay);
                this._effecDisplay.animation.play("idle");
            }

            Game.instance.stage.addChild(this._armatureDisplay);
            this._armatureDisplay.animation.play("idle");
        }

        public update(): boolean {
            this._armatureDisplay.x += this._speedX;
            this._armatureDisplay.y += this._speedY;

            if (
                this._armatureDisplay.x < -100.0 || this._armatureDisplay.x >= Game.STAGE_WIDTH + 100.0 ||
                this._armatureDisplay.y < -100.0 || this._armatureDisplay.y >= Game.STAGE_HEIGHT + 100.0
            ) {
                Game.instance.stage.removeChild(this._armatureDisplay);
                this._armatureDisplay.dispose();

                if (this._effecDisplay !== null) {
                    Game.instance.stage.removeChild(this._effecDisplay);
                    this._effecDisplay.dispose();
                }

                return true;
            }

            return false;
        }
    }
}