namespace dragonBones {
    /**
     * @private
     */
    export type EventStringType =
        string | "start" | "loopComplete" | "complete" |
        "fadeIn" | "fadeInComplete" | "fadeOut" | "fadeOutComplete" |
        "frameEvent" | "soundEvent";
    /**
     * 事件接口。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export interface IEventDispatcher {
        /**
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        addEvent(type: EventStringType, listener: Function, target: any): void;
        /**
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        removeEvent(type: EventStringType, listener: Function, target: any): void;
    }
}