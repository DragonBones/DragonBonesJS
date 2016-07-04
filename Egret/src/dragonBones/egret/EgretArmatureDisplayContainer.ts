namespace dragonBones {
    export class EgretEvent extends egret.Event {
        public get eventObject(): EventObject {
            return this.data;
        }
        /**
         * @private
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super(type, bubbles, cancelable, data);
        }
        /**
         * @see this.eventObject.name
         */
        public get frameLabel(): string {
            return this.eventObject.name;
        }
        /**
         * @see this.eventObject.name
         */
        public get sound(): string {
            return this.eventObject.name;
        }
        /**
         * @see this.eventObject.animationState.name
         */
        public get animationName(): string {
            return this.eventObject.animationState.name;
        }
        /**
         * @see this.eventObject.armature
         */
        public get armature(): Armature {
            return this.eventObject.armature;
        }
        /**
         * @see this.eventObject.bone
         */
        public get bone(): Bone {
            return this.eventObject.bone;
        }
        /**
         * @see this.eventObject.slot
         */
        public get slot(): Slot {
            return this.eventObject.slot;
        }
        /**
         * @see this.eventObject.animationState
         */
        public get animationState(): AnimationState {
            return this.eventObject.animationState;
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
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static ANIMATION_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static BONE_FRAME_EVENT: string = EventObject.FRAME_EVENT;
    }

    export class EgretArmatureDisplayContainer extends egret.DisplayObjectContainer implements IArmatureDisplayContainer {
        /**
         * @private
         */
        public _armature: Armature;
        /**
         * @private
         */
        protected _passedTime: number;

        private _time: number;
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        private _advanceTimeHandler(time: number): boolean {
            this._passedTime = time - this._time;
            this._armature.advanceTime(this._passedTime * 0.001);
            this._time = time;

            return false;
        }
        /**
         * @inheritDoc
         */
        public _onClear(): void {
            this.advanceTimeBySelf(false);

            this._armature = null;

            this._passedTime = 0;

            this._time = 0;
        }
        /**
         * @inheritDoc
         */
        public _init(): void {
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
        public hasEvent(type: string): boolean {
            return this.hasEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: string, listener: Function, target: any): void {
            this.addEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: string, listener: Function, target: any): void {
            this.removeEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public advanceTimeBySelf(on: Boolean): void {
            if (on) {
                this._time = egret.getTimer();
                egret.startTick(this._advanceTimeHandler, this);
            } else {
                egret.stopTick(this._advanceTimeHandler, this);
            }
        }
        /**
         * @inheritDoc
         */
        public dispose(): void {
            if (this._armature) {
                this._armature.dispose();
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
     * 不推荐使用
     */
    export type FastArmature = Armature;
    /**
     * 不推荐使用
     */
    export type FastBone = Bone;
    /**
     * 不推荐使用
     */
    export type FastSlot = Slot;
    /**
     * 不推荐使用
     */
    export type FastAnimation = Animation;
    /**
     * 不推荐使用
     */
    export type FastAnimationState = AnimationState;
    /**
     * 不推荐使用
     * @see #dragonBones.EgretEvent
     */
    export class AnimationEvent extends EgretEvent { }
    /**
     * 不推荐使用
     * @see #dragonBones.EgretEvent
     */
    export class FrameEvent extends EgretEvent { }
    /**
     * 不推荐使用
     * @see #dragonBones.EgretEvent
     */
    export class SoundEvent extends EgretEvent { }
    /**
     * 不推荐使用
     * @see #dragonBones.EgretTextureAtlasData
     */
    export class EgretTextureAtlas extends EgretTextureAtlasData {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.EgretTextureAtlas]";
        }

        public constructor(texture: egret.Texture, rawData: any, scale: number = 1) {
            super();

            this._onClear();

            this.texture = texture;
            ObjectDataParser.getInstance().parseTextureAtlasData(rawData, this, scale);
        }

        public dispose(): void {
            this.returnToPool();
        }
    }
    /**
     * 不推荐使用
     * @see #dragonBones.EgretFactory.soundEventManater
     */
    export class SoundEventManager {
        /**
         * 不推荐使用
         * @see #dragonBones.EgretFactory.soundEventManater
         */
        public static getInstance(): EgretArmatureDisplayContainer {
            return <EgretArmatureDisplayContainer>Armature._soundEventManager;
        }
    }
}
