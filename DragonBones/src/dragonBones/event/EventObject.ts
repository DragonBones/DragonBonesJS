namespace dragonBones {
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    export class EventObject extends BaseObject {
        /**
         * @language zh_CN
         * 动画开始。
         * @version DragonBones 4.5
         */
        public static START: string = "start";
        /**
         * @language zh_CN
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         */
        public static LOOP_COMPLETE: string = "loopComplete";
        /**
         * @language zh_CN
         * 动画播放完成。
         * @version DragonBones 4.5
         */
        public static COMPLETE: string = "complete";
        /**
         * @language zh_CN
         * 动画淡入开始。
         * @version DragonBones 4.5
         */
        public static FADE_IN: string = "fadeIn";
        /**
         * @language zh_CN
         * 动画淡入完成。
         * @version DragonBones 4.5
         */
        public static FADE_IN_COMPLETE: string = "fadeInComplete";
        /**
         * @language zh_CN
         * 动画淡出开始。
         * @version DragonBones 4.5
         */
        public static FADE_OUT: string = "fadeOut";
        /**
         * @language zh_CN
         * 动画淡出完成。
         * @version DragonBones 4.5
         */
        public static FADE_OUT_COMPLETE: string = "fadeOutComplete";
        /**
         * @language zh_CN
         * 动画帧事件。
         * @version DragonBones 4.5
         */
        public static FRAME_EVENT: string = "frameEvent";
        /**
         * @language zh_CN
         * 动画声音事件。
         * @version DragonBones 4.5
         */
        public static SOUND_EVENT: string = "soundEvent";
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EventObject]";
        }

        /**
         * @language zh_CN
         * 事件类型。
         * @version DragonBones 4.5
         */
        public type: EventStringType;
        /**
         * @language zh_CN
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.5
         */
        public name: string;
        /**
         * @private
         */
        public frame: AnimationFrameData;
        /**
         * @language zh_CN
         * 自定义数据
         * @see dragonBones.CustomData
         * @version DragonBones 5.0
         */
        public data: CustomData;
        /**
         * @language zh_CN
         * 发出事件的骨架。
         * @version DragonBones 4.5
         */
        public armature: Armature;
        /**
         * @language zh_CN
         * 发出事件的骨骼。
         * @version DragonBones 4.5
         */
        public bone: Bone;
        /**
         * @language zh_CN
         * 发出事件的插槽。
         * @version DragonBones 4.5
         */
        public slot: Slot;
        /**
         * @language zh_CN
         * 发出事件的动画状态。
         * @version DragonBones 4.5
         */
        public animationState: AnimationState;
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _onClear(): void {
            this.type = null;
            this.name = null;
            this.frame = null;
            this.data = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
        }
    }
}