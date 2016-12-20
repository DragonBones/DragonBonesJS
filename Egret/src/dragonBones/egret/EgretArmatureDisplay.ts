namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 事件。
     * @version DragonBones 4.5
     */
    export class EgretEvent extends egret.Event {
        /**
         * @language zh_CN
         * 事件对象。
         * @version DragonBones 4.5
         */
        public get eventObject(): EventObject {
            return this.data;
        }
        /**
         * @private
         */
        public constructor(type: EventStringType, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super(type, bubbles, cancelable, data);
        }
        /**
         * @see dragonBones.EventObject#animationName
         */
        public get animationName(): string {
            return this.eventObject.animationState.name;
        }
        /**
         * @see dragonBones.EventObject#armature
         */
        public get armature(): Armature {
            return this.eventObject.armature;
        }
        /**
         * @see dragonBones.EventObject#bone
         */
        public get bone(): Bone {
            return this.eventObject.bone;
        }
        /**
         * @see dragonBones.EventObject#slot
         */
        public get slot(): Slot {
            return this.eventObject.slot;
        }
        /**
         * @see dragonBones.EventObject#animationState
         */
        public get animationState(): AnimationState {
            return this.eventObject.animationState;
        }

        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        public get frameLabel(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        public get sound(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * @see #animationName
         */
        public get movementID(): string {
            return this.animationName;
        }

        /**
         * @see dragonBones.EventObject.START
         */
        public static START: string = EventObject.START;
        /**
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        public static LOOP_COMPLETE: string = EventObject.LOOP_COMPLETE;
        /**
         * @see dragonBones.EventObject.COMPLETE
         */
        public static COMPLETE: string = EventObject.COMPLETE;
        /**
         * @see dragonBones.EventObject.FADE_IN
         */
        public static FADE_IN: string = EventObject.FADE_IN;
        /**
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        public static FADE_IN_COMPLETE: string = EventObject.FADE_IN_COMPLETE;
        /**
         * @see dragonBones.EventObject.FADE_OUT
         */
        public static FADE_OUT: string = EventObject.FADE_OUT;
        /**
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        public static FADE_OUT_COMPLETE: string = EventObject.FADE_OUT_COMPLETE;
        /**
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND_EVENT: string = EventObject.SOUND_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static ANIMATION_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static BONE_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static MOVEMENT_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND: string = EventObject.SOUND_EVENT;
    }

    /**
     * @inheritDoc
     */
    export class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureDisplay {
        /**
         * @internal
         * @private
         */
        public _armature: Armature;
        /**
         * @internal
         * @private
         */
        public _subTextures: Map<egret.Texture> = {};

        private _debugDrawer: egret.Sprite;

        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        public _onClear(): void {
            for (let i in this._subTextures) {
                //this._subTextures[i].dispose();
                delete this._subTextures[i];
            }

            if (this._armature) {
                this.advanceTimeBySelf(false);
            }

            this._armature = null;
            this._debugDrawer = null;
        }
        /**
         * @inheritDoc
         */
        public _dispatchEvent(eventObject: EventObject): void {
            const event = egret.Event.create(EgretEvent, eventObject.type);
            event.data = eventObject;
            this.dispatchEvent(event);
            egret.Event.release(event);
        }
        /**
         * @inheritDoc
         */
        public _debugDraw(isEnabled: Boolean): void {
            if (!this._debugDrawer) {
                this._debugDrawer = new egret.Sprite();
            }

            if (isEnabled) {
                this.addChild(this._debugDrawer);
                this._debugDrawer.graphics.clear();

                const bones = this._armature.getBones();
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const bone = bones[i];
                    const boneLength = bone.length;
                    const startX = bone.globalTransformMatrix.tx;
                    const startY = bone.globalTransformMatrix.ty;
                    const endX = startX + bone.globalTransformMatrix.a * boneLength;
                    const endY = startY + bone.globalTransformMatrix.b * boneLength;

                    this._debugDrawer.graphics.lineStyle(2, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
                    this._debugDrawer.graphics.moveTo(startX, startY);
                    this._debugDrawer.graphics.lineTo(endX, endY);
                    this._debugDrawer.graphics.lineStyle(0, 0, 0);
                    this._debugDrawer.graphics.beginFill(0x00FFFF, 0.7);
                    this._debugDrawer.graphics.drawCircle(startX, startY, 3);
                    this._debugDrawer.graphics.endFill();
                }

                const slots = this._armature.getSlots();
                for (let i = 0, l = slots.length; i < l; ++i) {
                    const slot = slots[i];
                    const displayData = slot.displayData;

                    if (displayData && displayData.boundingBox) {
                        const boundingBox = displayData.boundingBox;
                        let child = this._debugDrawer.getChildByName(slot.name) as egret.Shape;
                        if (!child) {
                            child = new egret.Shape();
                            child.name = slot.name;
                            this._debugDrawer.addChild(child);
                        }

                        child.graphics.clear();
                        child.graphics.beginFill(0xFF00FF, 0.3);

                        switch (boundingBox.type) {
                            case BoundingBoxType.Rectangle:
                                child.graphics.drawRect(-boundingBox.width * 0.5, -boundingBox.height * 0.5, boundingBox.width, boundingBox.height);
                                break;

                            case BoundingBoxType.Ellipse:
                                child.graphics.drawEllipse(-boundingBox.width * 0.5, -boundingBox.height * 0.5, boundingBox.width, boundingBox.height);
                                break;

                            case BoundingBoxType.Polygon:
                                const vertices = boundingBox.vertices;
                                for (let i = 0, l = boundingBox.vertices.length; i < l; i += 2) {
                                    if (i == 0) {
                                        child.graphics.moveTo(vertices[i], vertices[i + 1]);
                                    }
                                    else {
                                        child.graphics.lineTo(vertices[i], vertices[i + 1]);
                                    }
                                }
                                break;

                            default:
                                break;
                        }

                        child.graphics.endFill();

                        if (slot._blendIndex == 0) {
                            slot._blendIndex = 1;
                            slot["_updateLocalTransformMatrix"]();
                            slot["_updateGlobalTransformMatrix"]();
                        }

                        child.$setMatrix(slot.globalTransformMatrix as egret.Matrix, false);
                    }
                    else {
                        const child = this._debugDrawer.getChildByName(slot.name);
                        if (child) {
                            this._debugDrawer.removeChild(child);
                        }
                    }
                }
            }
            else if (this._debugDrawer && this.contains(this._debugDrawer)) {
                this.removeChild(this._debugDrawer);
            }

        }
        /**
         * @inheritDoc
         */
        public _onReplaceTexture(texture: any): void {
            for (let i in this._subTextures) {
                //this._subTextures[i].dispose();
                delete this._subTextures[i];
            }
        }
        /**
         * @inheritDoc
         */
        public hasEvent(type: EventStringType): boolean {
            return this.hasEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.addEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.removeEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public dispose(): void {
            if (this._armature) {
                this.advanceTimeBySelf(false);
                this._armature.dispose();
                this._armature = null;
            }
        }
        /**
         * @inheritDoc
         */
        public advanceTimeBySelf(on: boolean): void {
            if (on) {
                EgretFactory._clock.add(this._armature);
            }
            else {
                EgretFactory._clock.remove(this._armature);
            }
        }
        /**
         * @inheritDoc
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * @inheritDoc
         */
        public get animation(): Animation {
            return this._armature.animation;
        }
    }

    /**
     * @deprecated
     * @see dragonBones.Armature
     */
    export type FastArmature = Armature;
    /**
     * @deprecated
     * @see dragonBones.Bone
     */
    export type FastBone = Bone;
    /**
     * @deprecated
     * @see dragonBones.Slot
     */
    export type FastSlot = Slot;
    /**
     * @deprecated
     * @see dragonBones.Animation
     */
    export type FastAnimation = Animation;
    /**
     * @deprecated
     * @see dragonBones.AnimationState
     */
    export type FastAnimationState = AnimationState;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    export class Event extends EgretEvent { }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    export class ArmatureEvent extends EgretEvent { }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    export class AnimationEvent extends EgretEvent { }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    export class FrameEvent extends EgretEvent { }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    export class SoundEvent extends EgretEvent { }
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    export class EgretTextureAtlas extends EgretTextureAtlasData {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EgretTextureAtlas]";
        }

        public constructor(texture: egret.Texture, rawData: any, scale: number = 1) {
            super();

            this._onClear();

            this.texture = texture;
            ObjectDataParser.getInstance().parseTextureAtlasData(rawData, this, scale);
        }
    }
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    export class EgretSheetAtlas extends EgretTextureAtlas {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    export class SoundEventManager {
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        public static getInstance(): EgretArmatureDisplay {
            return EgretFactory._eventManager;
        }
    }
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    export class AnimationCacheManager {
    }
}