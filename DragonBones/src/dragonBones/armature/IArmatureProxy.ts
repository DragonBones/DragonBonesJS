namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架代理接口。
     * @version DragonBones 5.0
     */
    export interface IArmatureProxy extends IEventDispatcher {
        /**
         * @private
         */
        init(armature: Armature): void;
        /**
         * @private
         */
        clear(): void;
        /**
         * @language zh_CN
         * 释放代理和骨架。 (骨架会回收到对象池)
         * @version DragonBones 4.5
         */
        dispose(disposeProxy: boolean): void;
        /**
         * @private
         */
        debugUpdate(isEnabled: boolean): void;
        /**
         * @language zh_CN
         * 获取骨架。
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        readonly armature: Armature;
        /**
         * @language zh_CN
         * 获取动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 4.5
         */
        readonly animation: Animation;
    }
}