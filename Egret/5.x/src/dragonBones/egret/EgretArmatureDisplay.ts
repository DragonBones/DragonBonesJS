namespace dragonBones {
    /**
     * Egret 事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export class EgretEvent extends egret.Event {
        /**
         * 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get eventObject(): EventObject {
            return this.data;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        public get animationName(): string {
            const animationState = this.eventObject.animationState;
            return animationState !== null ? animationState.name : "";
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#armature
         */
        public get armature(): Armature {
            return this.eventObject.armature;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#bone
         */
        public get bone(): Bone | null {
            return this.eventObject.bone;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#slot
         */
        public get slot(): Slot | null {
            return this.eventObject.slot;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        public get animationState(): AnimationState | null {
            return this.eventObject.animationState;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject#name
         */
        public get frameLabel(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject#name
         */
        public get sound(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #animationName
         */
        public get movementID(): string {
            return this.animationName;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.START
         */
        public static START: string = EventObject.START;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        public static LOOP_COMPLETE: string = EventObject.LOOP_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.COMPLETE
         */
        public static COMPLETE: string = EventObject.COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_IN
         */
        public static FADE_IN: string = EventObject.FADE_IN;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        public static FADE_IN_COMPLETE: string = EventObject.FADE_IN_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_OUT
         */
        public static FADE_OUT: string = EventObject.FADE_OUT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        public static FADE_OUT_COMPLETE: string = EventObject.FADE_OUT_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND_EVENT: string = EventObject.SOUND_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static ANIMATION_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static BONE_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static MOVEMENT_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND: string = EventObject.SOUND_EVENT;
    }
    /**
     * @inheritDoc
     */
    export class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureProxy, IEventDispatcher {
        private _debugDraw: boolean = false;
        private _disposeProxy: boolean = false;
        private _armature: Armature = null as any; //
        private _debugDrawer: egret.Sprite | null = null;
        /**
         * @inheritDoc
         */
        public dbInit(armature: Armature): void {
            this._armature = armature;
        }
        /**
         * @inheritDoc
         */
        public dbClear(): void {
            this._disposeProxy = false;
            this._armature = null as any;
            this._debugDrawer = null;
        }
        /**
         * @inheritDoc
         */
        public dbUpdate(): void {
            const drawed = DragonBones.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                if (this._debugDraw) {
                    if (this._debugDrawer === null) {
                        this._debugDrawer = new egret.Sprite();
                    }

                    this.addChild(this._debugDrawer);
                    this._debugDrawer.graphics.clear();

                    for (const bone of this._armature.getBones()) {
                        const boneLength = bone.boneData.length;
                        const startX = bone.globalTransformMatrix.tx;
                        const startY = bone.globalTransformMatrix.ty;
                        const endX = startX + bone.globalTransformMatrix.a * boneLength;
                        const endY = startY + bone.globalTransformMatrix.b * boneLength;

                        this._debugDrawer.graphics.lineStyle(2.0, 0x00FFFF, 0.7);
                        this._debugDrawer.graphics.moveTo(startX, startY);
                        this._debugDrawer.graphics.lineTo(endX, endY);
                        this._debugDrawer.graphics.lineStyle(0.0, 0, 0);
                        this._debugDrawer.graphics.beginFill(0x00FFFF, 0.7);
                        this._debugDrawer.graphics.drawCircle(startX, startY, 3.0);
                        this._debugDrawer.graphics.endFill();
                    }

                    for (const slot of this._armature.getSlots()) {
                        const boundingBoxData = slot.boundingBoxData;

                        if (boundingBoxData !== null) {
                            let child = this._debugDrawer.getChildByName(slot.name) as egret.Shape;
                            if (child === null) {
                                child = new egret.Shape();
                                child.name = slot.name;
                                this._debugDrawer.addChild(child);
                            }

                            child.graphics.clear();
                            child.graphics.beginFill(boundingBoxData.color ? boundingBoxData.color : 0xFF00FF, 0.3);

                            switch (boundingBoxData.type) {
                                case BoundingBoxType.Rectangle:
                                    child.graphics.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Ellipse:
                                    child.graphics.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Polygon:
                                    const vertices = (boundingBoxData as PolygonBoundingBoxData).vertices;
                                    for (let i = 0; i < vertices.length; i += 2) {
                                        if (i === 0) {
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
                            slot.updateTransformAndMatrix();
                            slot.updateGlobalTransform();
                            child.$setMatrix((slot.globalTransformMatrix as any) as egret.Matrix, true);
                        }
                        else {
                            const child = this._debugDrawer.getChildByName(slot.name);
                            if (child !== null) {
                                this._debugDrawer.removeChild(child);
                            }
                        }
                    }
                }
                else if (this._debugDrawer !== null && this._debugDrawer.parent === this) {
                    this.removeChild(this._debugDrawer);
                }
            }
        }
        /**
         * @inheritDoc
         */
        public dispose(disposeProxy: boolean = true): void {
            this._disposeProxy = disposeProxy;

            if (this._armature !== null) {
                const displays = new Array<egret.DisplayObject>();

                for (const slot of this._armature.getSlots()) {
                    for (const display of slot.displayList) {
                        if (display instanceof egret.DisplayObject && displays.indexOf(display) < 0) {
                            displays.push(display);
                        }
                    }
                }

                this._armature.dispose();
                this._armature = null as any;

                for (const display of displays) {
                    display.dispose();
                }

                super.dispose();
            }
        }
        /**
         * @inheritDoc
         */
        public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            const event = egret.Event.create(EgretEvent, type);
            event.data = eventObject;
            super.dispatchEvent(event);
            egret.Event.release(event);
        }
        /**
         * @inheritDoc
         */
        public hasDBEventListener(type: EventStringType): boolean {
            return this.hasEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addDBEventListener(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.addEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeDBEventListener(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.removeEventListener(type, listener, target);
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

        /**
         * @see #hasDBEventListener()
         * @deprecated
         */
        public hasEvent(type: EventStringType): boolean {
            return this.hasDBEventListener(type);
        }
        /**
         * @see #addDBEventListener()
         * @deprecated
         */
        public addEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.addDBEventListener(type, listener, target);
        }
        /**
         * @see #removeDBEventListener()
         * @deprecated
         */
        public removeEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.removeDBEventListener(type, listener, target);
        }
        /**
         * @see dragonBones.Armature#clock
         * @see dragonBones.BaseFactory#clock
         * @deprecated
         */
        public advanceTimeBySelf(on: boolean): void {
            if (on) {
                this._armature.clock = EgretFactory.factory.clock;
            }
            else {
                this._armature.clock = null;
            }
        }
    }

    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Armature
     */
    export type FastArmature = Armature;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Bone
     */
    export type FastBone = Bone;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Slot
     */
    export type FastSlot = Slot;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Animation
     */
    export type FastAnimation = Animation;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.AnimationState
     */
    export type FastAnimationState = AnimationState;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class Event extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class ArmatureEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class AnimationEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class FrameEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class SoundEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
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
            console.warn("已废弃，请参考 @see");

            this._onClear();

            ObjectDataParser.getInstance().parseTextureAtlasData(rawData, this, scale);
            this.renderTexture = texture;
        }
    }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretTextureAtlasData
     */
    export class EgretSheetAtlas extends EgretTextureAtlas {
    }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretFactory#soundEventManager
     */
    export class SoundEventManager {
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EgretFactory#soundEventManager
         */
        public static getInstance(): EgretArmatureDisplay {
            console.warn("已废弃，请参考 @see");
            return EgretFactory.factory.soundEventManager;
        }
    }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    export class AnimationCacheManager {
    }
}