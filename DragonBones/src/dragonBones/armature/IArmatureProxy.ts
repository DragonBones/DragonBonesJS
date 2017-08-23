namespace dragonBones {
    /**
     * 骨架代理接口。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    export interface IArmatureProxy extends IEventDispatcher {
        /**
         * @private
         */
        dbInit(armature: Armature): void;
        /**
         * @private
         */
        dbClear(): void;
        /**
         * @private
         */
        dbUpdate(): void;
        /**
         * 释放代理和骨架。 (骨架会回收到对象池)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        dispose(disposeProxy: boolean): void;
        /**
         * 获取骨架。
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly armature: Armature;
        /**
         * 获取动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly animation: Animation;
    }
}