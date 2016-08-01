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

        private _debugDrawer: PIXI.Graphics;
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

            if (this._debugDrawer) {
                this._debugDrawer.destroy(true);
                this._debugDrawer = null;
            }

            this.destroy(true);
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
        public _debugDraw(): void {
            if (!this._debugDrawer) {
                this._debugDrawer = new PIXI.Graphics();
            }

            this.addChild(this._debugDrawer);
            this._debugDrawer.clear();

            const bones = this._armature.getBones();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];
                const boneLength = Math.max(bone.length, 5);
                const startX = bone.globalTransformMatrix.tx;
                const startY = bone.globalTransformMatrix.ty;
                const endX = startX + bone.globalTransformMatrix.a * boneLength;
                const endY = startY + bone.globalTransformMatrix.b * boneLength;

                this._debugDrawer.lineStyle(1, bone.ik ? 0xFF0000 : 0x00FF00, 0.5);
                this._debugDrawer.moveTo(startX, startY);
                this._debugDrawer.lineTo(endX, endY);
            }
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
