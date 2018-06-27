import DragHelper from "./DragHelper";

type PointType = cc.Vec2;
type ArmatureComponentType = dragonBones.CocosArmatureComponent;
type EventType = cc.Event.EventCustom;

@cc._decorator.ccclass
export default class Game extends cc.Component {
    public static GROUND: number;
    public static G: number = -0.6;
    public static instance: Game;

    private _left: boolean = false;
    private _right: boolean = false;
    private _player: Mecha;
    private readonly _bullets: Array<Bullet> = [];

    start() {
        const resources = [
            cc.url.raw("resources/mecha_1502b/mecha_1502b_ske.json"),
            cc.url.raw("resources/mecha_1502b/mecha_1502b_tex.json"),
            cc.url.raw("resources/mecha_1502b/mecha_1502b_tex.png"),
            cc.url.raw("resources/skin_1502b/skin_1502b_ske.json"),
            cc.url.raw("resources/skin_1502b/skin_1502b_tex.json"),
            cc.url.raw("resources/skin_1502b/skin_1502b_tex.png"),
            cc.url.raw("resources/weapon_1000/weapon_1000_ske.json"),
            cc.url.raw("resources/weapon_1000/weapon_1000_tex.json"),
            cc.url.raw("resources/weapon_1000/weapon_1000_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const canvas = this.getComponent(cc.Canvas);
            const size = canvas.designResolution;
            Game.GROUND = -(size.height * 0.5 - 150.0);
            Game.instance = this;
            //
            this.node.on(cc.Node.EventType.TOUCH_START, this._touchHandler, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._touchHandler, this);
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this._touchHandler, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._keyHandler, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._keyHandler, this);
            //
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            factory.parseDragonBonesData(cc.loader.getRes(resources[3]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[4]), cc.loader.getRes(resources[5]));
            factory.parseDragonBonesData(cc.loader.getRes(resources[6]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[7]), cc.loader.getRes(resources[8]));
            //
            this._player = new Mecha();
        });
    }

    update() {
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

    private _touchHandler(event: cc.Event.EventTouch): void {
        this._player.aim(event.getLocationX() - this.node.x, event.getLocationY() - this.node.y);

        if (event.type === cc.Node.EventType.TOUCH_START) {
            this._player.attack(true);
        }
        else if (event.type === cc.Node.EventType.TOUCH_END) {
            this._player.attack(false);
        }
    }

    private _keyHandler(event: KeyboardEvent): void {
        const isDown = event.type === "keydown";
        switch (event.keyCode) {
            case 37:
            case 65:
                this._left = isDown;
                this._updateMove(-1);
                break;

            case 39:
            case 68:
                this._right = isDown;
                this._updateMove(1);
                break;

            case 38:
            case 87:
                if (isDown) {
                    this._player.jump();
                }
                break;

            case 83:
            case 40:
                this._player.squat(isDown);
                break;

            case 81:
                if (isDown) {
                    this._player.switchWeaponR();
                }
                break;

            case 69:
                if (isDown) {
                    this._player.switchWeaponL();
                }
                break;

            case 32:
                if (isDown) {
                    this._player.switchSkin();
                }
                break;
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
    private static readonly WEAPON_L_LIST: Array<string> = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e", ""];
    private static readonly WEAPON_R_LIST: Array<string> = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", ""];
    private static readonly SKINS: Array<string> = ["mecha_1502b", "skin_a", "skin_b", "skin_c"];

    private _isJumpingA: boolean = false;
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
    private _armatureComponent: ArmatureComponentType;
    private _weaponL: dragonBones.Armature | null = null;
    private _weaponR: dragonBones.Armature | null = null;
    private _aimState: dragonBones.AnimationState | null = null;
    private _walkState: dragonBones.AnimationState | null = null;
    private _attackState: dragonBones.AnimationState | null = null;
    private readonly _target: PointType = cc.v2();
    private readonly _helpPoint: PointType = cc.v2();

    public constructor() {
        this._armatureComponent = dragonBones.CocosFactory.factory.buildArmatureComponent("mecha_1502b");
        this._armatureComponent.node.x = 0.0;
        this._armatureComponent.node.y = Game.GROUND;
        this._armatureComponent.node.on(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._armatureComponent.node.on(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._armatureComponent.node.on(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        this._armature = this._armatureComponent.armature;

        // Get weapon childArmature.
        this._weaponL = this._armature.getSlot("weapon_l").childArmature;
        this._weaponR = this._armature.getSlot("weapon_r").childArmature;
        if (this._weaponL) {
            this._weaponL.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        if (this._weaponR) {
            this._weaponR.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        Game.instance.node.addChild(this._armatureComponent.node);
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
        if (this._weaponL) {
            this._weaponL.eventDispatcher.removeDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        this._weaponLIndex++;
        this._weaponLIndex %= Mecha.WEAPON_L_LIST.length;
        const weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];

        if (weaponName) {
            this._weaponL = dragonBones.CocosFactory.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
            this._weaponL.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }
        else {
            this._weaponL = null;
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
        }
    }

    public switchWeaponR(): void {
        if (this._weaponR) {
            this._weaponR.eventDispatcher.removeDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        this._weaponRIndex++;
        this._weaponRIndex %= Mecha.WEAPON_R_LIST.length;
        const weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];

        if (weaponName) {
            this._weaponR = dragonBones.CocosFactory.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
            this._weaponR.eventDispatcher.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }
        else {
            this._weaponR = null;
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
        }
    }

    public switchSkin(): void {
        this._skinIndex++;
        this._skinIndex %= Mecha.SKINS.length;
        const skinName = Mecha.SKINS[this._skinIndex];
        const skinData = dragonBones.CocosFactory.factory.getArmatureData(skinName).defaultSkin;
        dragonBones.CocosFactory.factory.replaceSkin(this._armature, skinData, false, ["weapon_l", "weapon_r"]);
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
        const eventObject = event.getUserData() as dragonBones.EventObject;

        switch (event.type) {
            case dragonBones.EventObject.FADE_IN_COMPLETE:
                if (eventObject.animationState.name === "jump_1") {
                    this._speedY = Mecha.JUMP_SPEED;

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
                if (eventObject.animationState.name === "attack_01") {
                    this._isAttackingB = false;
                    this._attackState = null;
                }
                break;

            case dragonBones.EventObject.COMPLETE:
                if (eventObject.animationState.name === "jump_4") {
                    this._isJumpingA = false;
                    this._updateAnimation();
                }
                break;
        }
    }

    private _frameEventHandler(event: EventType): void {
        const eventObject = event.getUserData() as dragonBones.EventObject;

        if (eventObject.name === "fire") {
            const localToGlobal = (eventObject.armature.proxy as ArmatureComponentType).node.getNodeToWorldTransform();
            const globalToLocal = Game.instance.node.getWorldToNodeTransform();
            const global = (cc as any).pointApplyAffineTransform(cc.v2(eventObject.bone.global.x, eventObject.bone.global.y), localToGlobal); // creator.d.ts error.
            const local = (cc as any).pointApplyAffineTransform(global, globalToLocal); // creator.d.ts error.
            this._fire(local);
        }
    }

    private _fire(firePoint: PointType): void {
        const radian = (this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian);
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
            const canvas = Game.instance.getComponent(cc.Canvas);
            const size = canvas.designResolution;

            this._armatureComponent.node.x += this._speedX;
            if (this._armatureComponent.node.x < -size.width * 0.5) {
                this._armatureComponent.node.x = -size.width * 0.5;
            }
            else if (this._armatureComponent.node.x > size.width * 0.5) {
                this._armatureComponent.node.x = size.width * 0.5;
            }
        }

        if (this._speedY !== 0.0) {
            if (this._speedY < -5.0 && this._speedY + Game.G >= -5.0) {
                this._armature.animation.fadeIn(
                    "jump_3", -1.0, -1, 0
                    , Mecha.NORMAL_ANIMATION_GROUP
                ).resetToPose = false;
            }

            this._speedY += Game.G;
            this._armatureComponent.node.y += this._speedY;

            if (this._armatureComponent.node.y < Game.GROUND) {
                this._armatureComponent.node.y = Game.GROUND;
                this._speedY = 0.0;
                this._armature.animation.fadeIn(
                    "jump_4", -1.0, -1,
                    0, Mecha.NORMAL_ANIMATION_GROUP
                ).resetToPose = false;
            }
        }
    }

    private _updateAim(): void {
        this._faceDir = this._target.x > this._armatureComponent.node.x ? 1 : -1;
        if (this._armatureComponent.armature.flipX !== this._faceDir < 0) {
            this._armatureComponent.armature.flipX = !this._armatureComponent.armature.flipX;

            if (this._moveDir !== 0) {
                this._updateAnimation();
            }
        }

        const aimOffsetY = this._armature.getBone("chest").global.y * this._armatureComponent.node.scaleY;
        if (this._faceDir > 0) {
            this._aimRadian = Math.atan2(this._target.y - this._armatureComponent.node.y - aimOffsetY, this._target.x - this._armatureComponent.node.x);
        }
        else {
            this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureComponent.node.y - aimOffsetY, this._target.x - this._armatureComponent.node.x);
            if (this._aimRadian > Math.PI) {
                this._aimRadian -= Math.PI * 2.0;
            }
        }

        let aimDir = 0;
        if (this._aimRadian > 0.0) {
            aimDir = 1;
        }
        else {
            aimDir = -1;
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
        this._attackState.autoFadeOutTime = 0.1;
    }
}

class Bullet {
    private _speedX: number = 0.0;
    private _speedY: number = 0.0;

    private _armatureComponent: ArmatureComponentType;
    private _effecComponent: ArmatureComponentType | null = null;

    public constructor(armatureName: string, effectArmatureName: string | null, radian: number, speed: number, position: PointType) {
        this._speedX = Math.cos(radian) * speed;
        this._speedY = Math.sin(radian) * speed;

        this._armatureComponent = dragonBones.CocosFactory.factory.buildArmatureComponent(armatureName);
        this._armatureComponent.node.x = position.x + Math.random() * 2 - 1;
        this._armatureComponent.node.y = position.y + Math.random() * 2 - 1;
        this._armatureComponent.node.rotation = -radian * dragonBones.Transform.RAD_DEG;

        if (effectArmatureName !== null) {
            this._effecComponent = dragonBones.CocosFactory.factory.buildArmatureComponent(effectArmatureName);
            this._effecComponent.node.rotation = -radian * dragonBones.Transform.RAD_DEG;
            this._effecComponent.node.x = this._armatureComponent.node.x;
            this._effecComponent.node.y = this._armatureComponent.node.y;
            this._effecComponent.node.scaleX = 1.0 + Math.random() * 1.0;
            this._effecComponent.node.scaleY = 1.0 + Math.random() * 0.5;

            if (Math.random() < 0.5) {
                this._effecComponent.node.scaleY *= -1.0;
            }

            Game.instance.node.addChild(this._effecComponent.node);
            this._effecComponent.animation.play("idle");
        }

        Game.instance.node.addChild(this._armatureComponent.node);
        this._armatureComponent.animation.play("idle");
    }

    public update(): boolean {
        const canvas = Game.instance.getComponent(cc.Canvas);
        const size = canvas.designResolution;

        this._armatureComponent.node.x += this._speedX;
        this._armatureComponent.node.y += this._speedY;

        if (
            this._armatureComponent.node.x < -size.width * 0.5 - 100.0 || this._armatureComponent.node.x > size.width * 0.5 + 100.0 ||
            this._armatureComponent.node.y < -size.height * 0.5 - 100.0 || this._armatureComponent.node.y > size.height * 0.5 + 100.0
        ) {
            Game.instance.node.removeChild(this._armatureComponent.node);
            this._armatureComponent.dispose();

            if (this._effecComponent !== null) {
                Game.instance.node.removeChild(this._effecComponent.node);
                this._effecComponent.dispose();
            }

            return true;
        }

        return false;
    }
}
