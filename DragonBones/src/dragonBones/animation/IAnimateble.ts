namespace dragonBones {
    /**
     * @language zh_CN
     * 播放动画接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以加到 WorldClock 实例中，由 WorldClock 统一更新时间。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export interface IAnimateble {
        /**
        * @language zh_CN
        * 更新时间。
        * @param passedTime 前进的时间。 (以秒为单位)
        * @version DragonBones 3.0
        */
        advanceTime(passedTime: number): void;
        /**
         * @private
         */
        clock: WorldClock;
    }
}