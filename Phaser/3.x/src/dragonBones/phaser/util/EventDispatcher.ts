namespace dragonBones.phaser.util {
    export class EventDispatcher extends Phaser.Events.EventEmitter implements IEventDispatcher {
        hasDBEventListener(type: EventStringType): boolean {
            return this.listenerCount(type) > 0;
        }

        dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            this.emit(type, eventObject);
        }

        addDBEventListener(type: EventStringType, listener: (e: EventObject) => void, thisObject?: any): void {
            this.on(type, listener, thisObject);
        }

        removeDBEventListener(type: EventStringType, listener: (e: EventObject) => void, thisObject?: any): void {
            this.off(type, listener, thisObject);
        }
    }
}
