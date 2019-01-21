namespace dragonBones.phaser.display {
    export class ArmatureDisplay extends DisplayContainer implements IArmatureProxy {
        debugDraw = false;
        private _armature: Armature;

        constructor(scene: Phaser.Scene) {
            super(scene);
        }

        dbInit(armature: Armature): void {
            this._armature = armature;
        }

        dbClear(): void {
            this.removeAllListeners();
            if (this._armature)
                this._armature.dispose();
            this._armature = null;
        }

        dbUpdate(): void {
            // TODO: draw debug graphics
            if (this.debugDraw) {
            }
        }

        dispose(disposeProxy: boolean): void {
            this.dbClear();
            if (disposeProxy === true)
                super.destroy();
        }

        destroy(): void {
            this.dispose(true);
        }

        dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            this.emit(type, eventObject);
        }

        hasDBEventListener(type: EventStringType): boolean {
            return this.listenerCount(type) > 0;
        }

        addDBEventListener(type: EventStringType, listener: (event: EventObject) => void, scope?: any): void {
            this.on(type, listener, scope);
        }

        removeDBEventListener(type: EventStringType, listener: (event: EventObject) => void, scope?: any): void {
            this.off(type, listener, scope);
        }

        get armature(): Armature {
            return this._armature;
        }

        get animation(): Animation {
            return this._armature.animation;
        }
    }
}
