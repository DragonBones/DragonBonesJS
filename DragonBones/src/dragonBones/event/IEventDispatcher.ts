namespace dragonBones {
    /**
     * @private
     */
    export type EventStringType =
        string | "start" | "loopComplete" | "complete" |
        "fadeIn" | "fadeInComplete" | "fadeOut" | "fadeOutComplete" |
        "frameEvent" | "soundEvent";

    /**
     * @language zh_CN
     * 事件接口。
     * @version DragonBones 4.5
     */
    export interface IEventDispatcher {
        /**
         * @internal
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @version DragonBones 4.5
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        addEvent(type: EventStringType, listener: Function, target: any): void;
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        removeEvent(type: EventStringType, listener: Function, target: any): void;
    }
}