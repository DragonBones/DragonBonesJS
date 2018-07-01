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
    // const _defaultItems = cc.Enum({ "None": -1 });
    // function _setItems(object: any, key: string, items: any) {
    //     (cc.Class as any).attr( // creator.d.ts error.
    //         object,
    //         key,
    //         {
    //             type: "Enum",
    //             enumList: (cc.Enum as any).getList(items), // creator.d.ts error.
    //         }
    //     );
    // }

    const {
        ccclass,
        property,
        executeInEditMode,
        disallowMultiple,
        playOnFocus,
        menu,
        help,
    } = cc._decorator;
    /**
     * @see dragonBones.IArmatureProxy
     */
    @ccclass("CocosArmatureComponent")
    @executeInEditMode
    @disallowMultiple
    @playOnFocus
    @menu("DragonBones/Armature")
    @executeInEditMode
    @help("https://github.com/DragonBones/")
    export class CocosArmatureComponent extends cc.Component implements IArmatureProxy {
        /**
         * @private
         */
        public debugDraw: boolean = false;
        private _debugDraw: boolean = false;
        /**
         * @internal
         */
        public _armature: Armature = null as any;

        public dbInit(armature: Armature): void {
            this._armature = armature;
        }

        public dbClear(): void {
            this._armature = null as any;

            super.destroy();
        }

        public dbUpdate(): void {
            const drawed = DragonBones.debugDraw || this.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
            }
        }

        public dispose(_isposeProxy: boolean = true): void {
            if (this._armature !== null) {
                this._armature.dispose();
                this._armature = null as any;
            }
        }

        public destroy(): true {
            this.dispose();

            if (false) { // `super.destroy()` will be called in `dbClear()`.
                super.destroy();
            }

            return true;
        }

        /**
         * @private
         */
        public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            const event = new cc.Event.EventCustom(type, false);
            event.setUserData(eventObject);
            this.node.dispatchEvent(event);
        }

        public hasDBEventListener(type: EventStringType): boolean {
            return (this.node as any).hasEventListener(type, false); // creator.d.ts error.
        }

        public addDBEventListener(type: EventStringType, listener: (event: cc.Event.EventCustom) => void, target: any): void {
            this.node.on(type, listener, target);
        }

        public removeDBEventListener(type: EventStringType, listener: (event: cc.Event.EventCustom) => void, target: any): void {
            this.node.off(type, listener, target);
        }

        public get armature(): Armature {
            return this._armature;
        }

        public get animation(): Animation {
            return this._armature.animation;
        }
        // Editor.
        /**
         * @internal
         */
        @property
        public _armatureName: string = "";
        /**
         * @internal
         */
        @property
        public _animationName: string = "";
        // Visibie.
        /**
         * @internal
         */
        @property({
            type: DragonBonesAsset,
            displayName: "DragonBones",
            tooltip: "DragonBones Asset",
            visible: true,
        })
        public _dragonBonesAsset: DragonBonesAsset | null = null;
        /**
         * @internal
         */
        @property({
            type: [cc.String],
            displayName: "Armature",
            tooltip: "The armature name.",
            visible: true,
            editorOnly: true,
            serializable: false,
        })
        public readonly _armatureNames: Array<string> = [];
        /**
         * @internal
         */
        @property({
            type: [cc.String],
            displayName: "Animation",
            tooltip: "The animation name.",
            visible: true,
            editorOnly: true,
            serializable: false,
        })
        public readonly _animationNames: Array<string> = [];
        /**
         * @internal
         */
        @property({
            type: cc.Integer,
            displayName: "Play times",
            tooltip: "The animation play times.",
            visible: true,
            slide: true,
            range: [-1, 99, 1],
        })
        public _playTimes: number = -1;
        /**
         * @internal
         */
        @property({
            type: cc.Float,
            displayName: "TimeScale",
            tooltip: "The animation play speed.",
            visible: true,
            slide: true,
            range: [-2, 2, 0.01],
        })
        public _timeScale: number = 1.0;

        start() {

        }
    }
}