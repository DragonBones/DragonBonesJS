namespace dragonBones {
    /**
     * @inheritDoc
     */
    export class PixiArmatureDisplay extends PIXI.Container implements IArmatureDisplay {
        private static _clock: WorldClock = null;
        private static _clockHandler(passedTime: number): void {
            PixiArmatureDisplay._clock.advanceTime(-1); // passedTime !?
        }
        /**
         * @private
         */
        public _armature: Armature;
        /**
         * @private
         */
        public constructor() {
            super();

            if (!PixiArmatureDisplay._clock) {
                PixiArmatureDisplay._clock = new WorldClock();
                PIXI.ticker.shared.add(PixiArmatureDisplay._clockHandler, PixiArmatureDisplay);
            }
        }
        /**
         * @inheritDoc
         */
        public _onClear(): void {
            this.advanceTimeBySelf(false);

            this._armature = null;
        }
        /**
         * @inheritDoc
         */
        public _dispatchEvent(eventObject: EventObject): void {
            this.emit(eventObject.type, eventObject);
        }
        /**
         * @inheritDoc
         */
        public hasEvent(type: EventStringType): boolean {
            return <boolean>this.listeners(type, true);
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.addListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.removeListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public advanceTimeBySelf(on: Boolean): void {
            if (on) {
                PixiArmatureDisplay._clock.add(this._armature);
            } else {
                PixiArmatureDisplay._clock.remove(this._armature);
            }
        }
        /**
         * @inheritDoc
         */
        public dispose(): void {
            if (this._armature) {
                this._armature.dispose();
            }
        }
        /**
         * @inheritDoc
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * @inheritDoc
         */
        public get animation(): Animation {
            return this._armature.animation;
        }
    }
}
