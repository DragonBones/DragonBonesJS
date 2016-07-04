namespace dragonBones {
    /**
     *
     */
    export interface IArmatureDisplayContainer extends IEventDispatcher {
		/**
		 * @private
		 */
        _init(): void;

        advanceTimeBySelf(on: boolean): void;
        dispose(): void;
		/**
		 * readonly
		 */
        armature: Armature;
		/**
		 * readonly
		 */
        animation: Animation;
    }
}