/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

namespace dragonBones {
    /**
     * @inheritDoc
     */
    export class PhaserArmatureDisplay extends Phaser.GameObjects.Container implements IArmatureProxy {
        /**
         * @private
         */
        public debugDraw: boolean = false;
        private _debugDraw: boolean = false;
        private _armature: Armature = null as any;
        private readonly _eventDispatcher: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

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
            this._eventDispatcher.destroy();

            // this._armature = null as any;
            // this._debugDrawer = null;

            super.destroy();
        }
        /**
         * @inheritDoc
         */
        public dbUpdate(): void {
        }

        public dispose(_disposeProxy: boolean = true): void {
            if (this._armature !== null) {
                this._armature.dispose();
                this._armature = null as any;
            }
        }

        public destroy(): void {
            this.dispose();
        }
        /**
         * @private
         */
        public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            this._eventDispatcher.emit(type, eventObject);
        }

        public hasDBEventListener(type: EventStringType): boolean {
            return type in this._eventDispatcher.eventNames;
        }

        public addDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this._eventDispatcher.addListener(type, listener, target);
        }

        public removeDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this._eventDispatcher.removeListener(type, listener, target, false);
        }

        public get armature(): Armature {
            return this._armature;
        }

        public get animation(): Animation {
            return this._armature.animation;
        }
    }
}
