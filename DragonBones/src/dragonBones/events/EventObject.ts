namespace dragonBones {
    /**
     *
     */
    export interface IEventDispatcher {
		/**
		 * @private
		 */
        _onClear(): void;
		/**
		 * @private
		 */
        _dispatchEvent(eventObject: EventObject): void;
        hasEvent(type: string): boolean;
        addEvent(type: string, listener: Function, target:any): void;
        removeEvent(type: string, listener: Function, target:any): void;
    }
    /**
     *
     */
    export class EventObject extends BaseObject {
        public static START: string = "start";
        public static LOOP_COMPLETE: string = "loopComplete";
        public static COMPLETE: string = "complete";

        public static FADE_IN: string = "fadeIn";
        public static FADE_IN_COMPLETE: string = "fadeInComplete";
        public static FADE_OUT: string = "fadeOut";
        public static FADE_OUT_COMPLETE: string = "fadeOutComplete";

        public static FRAME_EVENT: string = "frameEvent";
        public static SOUND_EVENT: string = "soundEvent";

        public type: string;
        public name: string;
        public data: any;
        public armature: Armature;
        public bone: Bone;
        public slot: Slot;
        public animationState: AnimationState;
        public userData: any;
		/**
		 * @private
		 */
        public constructor() {
            super();
        }
		/**
		 * @inheritDoc
		 */
        protected _onClear(): void {
            this.type = null;
            this.name = null;
            this.data = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
            this.userData = null;
        }
    }
}