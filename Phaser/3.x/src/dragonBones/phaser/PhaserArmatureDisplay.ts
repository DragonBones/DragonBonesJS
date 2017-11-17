namespace dragonBones {
    /**
     * @inheritDoc
     */
    export class PhaserArmatureDisplay implements IArmatureProxy {
        private _debugDraw: boolean = false;
        private _disposeProxy: boolean = false;
        private _armature: Armature = null as any;
        /**
         * @inheritDoc
         */
        public dbInit(armature: Armature): void {
            this._armature = armature;
        }
        /**
         * @inheritDoc
         */
        public dbClear(): void {
            this._disposeProxy = false;
            this._armature = null as any;
            // super.destroy(false);
        }
        /**
         * @private
         */
        public dbUpdate(): void {
            const drawed = DragonBones.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
            }
        }
        /**
         * @inheritDoc
         */
        public dispose(disposeProxy: boolean = true): void {
            this._disposeProxy = disposeProxy;
            if (this._armature !== null) {
                this._armature.dispose();
                this._armature = null as any;
            }
        }
        // /**
        //  * @inheritDoc
        //  */
        // public destroy(): void {
        //     this.dispose();
        // }
        /**
         * @private
         */
        public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
        }
        /**
         * @inheritDoc
         */
        public hasDBEventListener(type: EventStringType): boolean {
            return false;
        }
        /**
         * @inheritDoc
         */
        public addDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
        }
        /**
         * @inheritDoc
         */
        public removeDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
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

        /**
         * @inheritDoc
         */
        public hasEvent(type: EventStringType): boolean {
            return this.hasDBEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.addDBEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.removeDBEventListener(type, listener, target);
        }
    }
}