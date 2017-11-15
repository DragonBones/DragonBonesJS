namespace dragonBones {
    /**
     * Play animation interface. (Both Armature and Wordclock implement the interface)
     * Any instance that implements the interface can be added to the Worldclock instance and advance time by Worldclock instance uniformly.
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * 播放动画接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以添加到 WorldClock 实例中，由 WorldClock 实例统一更新时间。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export interface IAnimatable {
        /**
         * Advance time.
         * @param passedTime Passed time (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 更新时间。
         * @param passedTime 前进的时间 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime: number): void;
        /**
         * The Wordclock instance to which the current belongs.
         * @version DragonBones 5.0
         * @example
         * <pre>
         *     armature.clock = factory.clock; // Add armature to clock.
         *     armature.clock = null; // Remove armature from clock.
         * </pre>
         * @language en_US
         */
        /**
         * 当前所属的 WordClock 实例。
         * @version DragonBones 5.0
         * @example
         * <pre>
         *     armature.clock = factory.clock; // 将骨架添加到时钟。
         *     armature.clock = null; // 将骨架从时钟移除。
         * </pre>
         * @language zh_CN
         */
        clock: WorldClock | null;
    }
}