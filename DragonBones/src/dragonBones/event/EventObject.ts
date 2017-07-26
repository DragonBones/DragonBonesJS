namespace dragonBones {
    /**
     * 事件数据。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export class EventObject extends BaseObject {
        /**
         * 动画开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly START: string = "start";
        /**
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly LOOP_COMPLETE: string = "loopComplete";
        /**
         * 动画播放完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly COMPLETE: string = "complete";
        /**
         * 动画淡入开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly FADE_IN: string = "fadeIn";
        /**
         * 动画淡入完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly FADE_IN_COMPLETE: string = "fadeInComplete";
        /**
         * 动画淡出开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly FADE_OUT: string = "fadeOut";
        /**
         * 动画淡出完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly FADE_OUT_COMPLETE: string = "fadeOutComplete";
        /**
         * 动画帧事件。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly FRAME_EVENT: string = "frameEvent";
        /**
         * 动画声音事件。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public static readonly SOUND_EVENT: string = "soundEvent";
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EventObject]";
        }
        /**
         * @private
         */
        public time: number;
        /**
         * 事件类型。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public type: EventStringType;
        /**
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public name: string;
        /**
         * 发出事件的骨架。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public armature: Armature;
        /**
         * 发出事件的骨骼。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public bone: Bone | null;
        /**
         * 发出事件的插槽。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public slot: Slot | null;
        /**
         * 发出事件的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public animationState: AnimationState;
        /**
         * 自定义数据
         * @see dragonBones.CustomData
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public data: UserData | null;
        /**
         * @private
         */
        protected _onClear(): void {
            this.time = 0.0;
            this.type = "";
            this.name = "";
            this.armature = null as any;
            this.bone = null;
            this.slot = null;
            this.animationState = null as any;
            this.data = null;
        }
    }
}