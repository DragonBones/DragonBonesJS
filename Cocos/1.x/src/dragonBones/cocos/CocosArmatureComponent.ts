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
        _armatureName: string = "";

        dragonBonesName = '';
        /**
         * @internal
         */
        @property
        _animationName: string = "";
        // Visibie.
        /**
         * @internal
         */
        @property(DragonBonesAsset)
        public _dragonBonesAsset: DragonBonesAsset | null = null;
        @property({
            type: DragonBonesAsset,
            displayName: "DragonBones",
            tooltip: "DragonBones Asset",
        })
        get dragonBonesAsset() {
            return this._dragonBonesAsset || null;
        }
        set dragonBonesAsset(value: DragonBonesAsset | null) {
            this._dragonBonesAsset = value;
            this._loadAndDisplayDragonBones();
        }
        /**
         * @internal
         */
        @property({
            type: [cc.String],
            displayName: "Armature",
            tooltip: "The armature name.",
            visible: true,
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

        _dragonBonesNode: cc.Node;

        _loadAndDisplayDragonBones() {
            console.warn(`开始创建 DragonBones Armature`);
            let notExistAsset = !this.dragonBonesAsset
                || !this.dragonBonesAsset.dragonBonesData
                || !this.dragonBonesAsset.textureAtlases
                || !this.dragonBonesAsset.textures;
            if (notExistAsset) {
                console.error(`dragonBonesAsset 为空`);
                return;
            }
            console.warn(`创建 DragonBones Armature`);
            this._parseDragonAsset();
            this._parseDragonAtlasAsset();
            this.display();
        }
        _parseDragonAsset() {
            let dragonBonesData;
            if (typeof this.dragonBonesAsset.dragonBonesData === 'string') {
                console.log(`JSON.parse(this.dragonBonesAsset.dragonBonesData)`);
                dragonBonesData = JSON.parse(this.dragonBonesAsset.dragonBonesData);
            } else {
                dragonBonesData = this.dragonBonesAsset.dragonBonesData;
            }
            let data = dragonBones.CocosFactory.factory.parseDragonBonesData(dragonBonesData);
            if (!data) {
                console.warn(`DragonBones Armature not exist`);
                return;
            }
            this._armatureName = data.armatureNames[0];
            console.log(`parseDragonBonesData`, data);
        }

        _parseDragonAtlasAsset() {
            let textureAtlases = this.dragonBonesAsset.textureAtlases;
            if (typeof textureAtlases[0] === 'string') {
                console.log('JSON.parse(this.dragonBonesAsset.textureAtlases)');
                textureAtlases = JSON.parse(textureAtlases);
            } else {
                textureAtlases = this.dragonBonesAsset.textureAtlases;
            }

            let texture = Array.isArray(this.dragonBonesAsset.textures) ? this.dragonBonesAsset.textures[0] : this.dragonBonesAsset.textures;
            if (typeof texture === 'string') {
                cc.textureCache.addImage(texture, (tex, error) => {
                    if (error) {
                        console.error(`error:${error.message}`, error);
                        return;
                    }
                    let data = dragonBones.CocosFactory.factory.parseTextureAtlasData(textureAtlases, tex);
                    console.log(`parseTextureAtlasData`, data);
                    console.log(`dragonBonesAsset`, this.dragonBonesAsset);
                    console.log(`textureAtlases`, textureAtlases);
                    console.log(`texture`, tex);
                }, this);
            } else {
                let data = dragonBones.CocosFactory.factory.parseTextureAtlasData(this.dragonBonesAsset.textureAtlases, texture);
                console.log(`string  parseTextureAtlasData`, data);
                console.log(`string  dragonBonesAsset`, this.dragonBonesAsset);
            }
        }

        display() {
            console.warn(`Armature name:${this._armatureName},dragonBonesName:${this.dragonBonesName}`);
            const armatureComponent = dragonBones.CocosFactory.factory.buildArmatureComponent(this._armatureName, this.dragonBonesName);
            if (!armatureComponent) {
                console.log(`armatureComponent is null`);
                return;
            }
            armatureComponent.animation.play(armatureComponent.animation.animationNames[0], 0);

            armatureComponent.node.x = 0.0;
            armatureComponent.node.y = 0;
            this.node.addChild(armatureComponent.node);
            this._dragonBonesNode = armatureComponent.node;
            console.log(`play animation default animation`);
        }

        onLoad() {
            // this.display();
            if (this._dragonBonesNode) {
                let component = this._dragonBonesNode.getComponent(CocosArmatureComponent);
                let state = component.animation.play(component.animation.animationNames[0], 0);
                if (!state) {
                    return;
                }
                console.warn(`播放动画：${state.name}`, state);
            } else {
                this._loadAndDisplayDragonBones();
                // this.onLoad();
                // dragonBones.CocosFactory.factory.parseDragonBonesData(this.dragonBonesAsset.dragonBonesData);
                // dragonBones.CocosFactory.factory.parseTextureAtlasData(this.dragonBonesAsset.textureAtlases, this.dragonBonesAsset.textures);
            }
        }
    }
}