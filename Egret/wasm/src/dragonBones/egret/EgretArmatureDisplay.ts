namespace dragonBones {
    /**
     * Egret 事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export class EgretEvent extends egret.Event {
        /**
         * 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get eventObject(): EventObject {
            return this.data;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#armature
         */
        public get armature(): Armature {
            return this.eventObject.armature;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#bone
         */
        public get bone(): Bone | null {
            return this.eventObject.bone;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#slot
         */
        public get slot(): Slot | null {
            return this.eventObject.slot;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        public get animationState(): AnimationState | null {
            return this.eventObject.animationState;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        public get animationName(): string {
            const animationState = this.eventObject.animationState;
            return animationState !== null ? animationState.name : "";
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#name
         */
        public get frameLabel(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#name
         */
        public get sound(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.START
         */
        public static START: string = EventObject.START;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        public static LOOP_COMPLETE: string = EventObject.LOOP_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.COMPLETE
         */
        public static COMPLETE: string = EventObject.COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_IN
         */
        public static FADE_IN: string = EventObject.FADE_IN;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        public static FADE_IN_COMPLETE: string = EventObject.FADE_IN_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_OUT
         */
        public static FADE_OUT: string = EventObject.FADE_OUT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        public static FADE_OUT_COMPLETE: string = EventObject.FADE_OUT_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND_EVENT: string = EventObject.SOUND_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static ANIMATION_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static BONE_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static MOVEMENT_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND: string = EventObject.SOUND_EVENT;
    }
    /**
     * @inheritDoc
     */
    export class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureProxy {
        private _disposeProxy: boolean = false;
        private _armature: Armature = null as any; //
        private _debugDrawer: egret.Sprite | null = null;
        /**
         * @inheritDoc
         */
        public init(armature: Armature): void {
            this._armature = armature;
        }
        /**
         * @inheritDoc
         */
        public clear(): void {
            this._disposeProxy = false;
            this._armature = null as any;
            this._debugDrawer = null;
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
        /**
         * @inheritDoc
         */
        public debugUpdate(isEnabled: boolean): void { // TODO
            isEnabled;
        }
        /**
         * @inheritDoc
         */
        public _dispatchEvent(type: EventStringType, eventObject: EventObject): void {
            const event = egret.Event.create(EgretEvent, type);
            event.data = eventObject;
            super.dispatchEvent(event);
            egret.Event.release(event);
        }
        /**
         * @inheritDoc
         */
        public hasEvent(type: EventStringType): boolean {
            return this.hasEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.addEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.removeEventListener(type, listener, target);
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

    interface PEgretArmatureProxy extends IArmatureProxy {
        __parent: any;
        _display: EgretArmatureDisplay;
    }

    interface PEgretSlot {
        __parent: any;
        _rawDisplay: egret.Bitmap;
        _meshDisplay: egret.Mesh;
        _rawDisplayWASM: any;
        _meshDisplayWASM: any;
    }

    interface PEgretDisplayWrapper {
        _display: egret.DisplayObject | Armature | null;
        setDisplayInfo(displayID: number, type: DisplayType): void;
        setArmature(value: Armature): void;
    }

    export interface PEgretTextureAtlasData extends TextureAtlasData {
        renderTexture: egret.Texture | null;
        textures: any;
        __parent: any;
        _textureNames: Array<string>;
        _texture: egret.Texture | null;
    }

    export interface PEgretTextureData extends TextureData {
        renderTexture: egret.Texture | null;
        __parent: any;
        _renderTexture: egret.Texture | null;
    }

    export let EgretArmatureProxy: any;
    export let EgretSlot: any;
    export let EgretTextureAtlasData: any;
    export let EgretTextureData: any;

    export function createEgretDisplay(display: egret.DisplayObject | Armature | null, type: DisplayType): any {
        const egretDisplayWrapper = new Module["EgretDisplayWASM"]() as PEgretDisplayWrapper; // TODO 是否可以将 EgretDisplayWASM 改为 EgretDisplayWrapper
        let wasmId;
        if (display === null) {
            wasmId = -1;
            egretDisplayWrapper.setDisplayInfo(wasmId, type);
        }
        else if (type === DisplayType.Armature) {
            wasmId = (display as any).getEgretArmatureId();
            egretDisplayWrapper.setDisplayInfo(wasmId, type);
            egretDisplayWrapper.setArmature(display as Armature);
        }
        else {
            wasmId = (display as any).$waNode.id;
            egretDisplayWrapper.setDisplayInfo(wasmId, type);
        }
        egretDisplayWrapper._display = display;

        return egretDisplayWrapper;
    }

    export function egretWASMInit(): void {
        /**
         * @private
         * 扩展 c++ EgretArmatureProxy。(在 js 中构造)
         */
        EgretArmatureProxy = Module["EgretArmatureDisplayWASM"].extend("EgretArmatureProxy", { // TODO 是否可以将 EgretArmatureDisplayWASM 改为 EgretArmatureProxy
            __construct: function (this: PEgretArmatureProxy, display: EgretArmatureDisplay) {
                this.__parent.__construct.call(this);
                this._display = display;
            },
            __destruct: function (this: PEgretArmatureProxy) {
                this.__parent.__destruct.call(this);
                this._display = null as any;
            },
            clear: function (this: PEgretArmatureProxy): void { // c++ call.
                if (this._display) {
                    this._display.clear();
                }

                this._display = null as any;
            },
            debugUpdate: function (this: PEgretArmatureProxy, isEnabled: boolean): void { // c++ call.
                this._display.debugUpdate(isEnabled);
            },
            //extend c++
            _dispatchEvent: function (this: PEgretArmatureProxy, type: string, eventObject: EventObject): void { // c++ call.
                this._display._dispatchEvent(type, eventObject);
            },
            //extend c++
            hasEvent: function (this: PEgretArmatureProxy, type: string): boolean { // c++ call.
                return this._display.hasEventListener(type);
            },
            dispose: function (this: PEgretArmatureProxy, disposeProxy: boolean): void {
                // TODO lsc
                disposeProxy;
                // return this._display.dispose(disposeProxy);
            },
            addEvent: function (this: PEgretArmatureProxy, type: string, listener: (event: EgretEvent) => void, target: any): void { // js call.
                this._display.addEvent(type, listener, target);
            },
            removeEvent: function (this: PEgretArmatureProxy, type: string, listener: (event: EgretEvent) => void, target: any): void { // js call.
                this._display.removeEvent(type, listener, target);
            }
        });

        /**
         * @private
         */
        EgretSlot = Module["EgretSlotWASM"].extend("EgretSlotWrapper", { // TODO 是否可以将 EgretSlotWASM 改为 EgretSlot
            __construct: function (this: PEgretSlot) {
                this.__parent.__construct.call(this);
                this._rawDisplay = null as any;
                this._meshDisplay = null as any;
                this._rawDisplayWASM = null as any;
                this._meshDisplayWASM = null as any;
            },
            __destruct: function (this: PEgretSlot) {
                this.__parent.__destruct.call(this);
                this._rawDisplay = null as any;
                this._meshDisplay = null as any;
            },
            init: function (this: PEgretSlot, slotData: SlotData, displayDatas: Array<DisplayData | null>, rawDisplay: any, meshDisplay: any): void { // js -> c++
                this._rawDisplay = rawDisplay;
                this._meshDisplay = meshDisplay;

                this._rawDisplayWASM = createEgretDisplay(this._rawDisplay, DisplayType.Image);
                this._meshDisplayWASM = createEgretDisplay(this._meshDisplay, DisplayType.Mesh);
                this.__parent.init.call(
                    this,
                    slotData, displayDatas,
                    this._rawDisplayWASM,
                    this._meshDisplayWASM
                );
            },
            getRawDisplay: function (this: PEgretSlot): egret.Bitmap {
                return this._rawDisplay;
            },
            getMeshDisplay: function (this: PEgretSlot): egret.Mesh {
                return this._meshDisplay;
            },
            getRawWASMDisplay: function (this: PEgretSlot): any {
                return this._rawDisplayWASM;
            },
            getMeshWASMDisplay: function (this: PEgretSlot): any {
                return this._meshDisplayWASM;
            },
            // extend c++ function
            getDisplay: function (this: PEgretSlot): egret.DisplayObject | null { // js -> c++
                const displayWrapper: PEgretDisplayWrapper | null = this.__parent.getEgretDisplay.call(this);
                if (displayWrapper !== null) {
                    return displayWrapper._display as any;
                }

                return null;
            },
            setDisplay: function (this: PEgretSlot, value: egret.DisplayObject | Armature | null): void { // js -> c++
                if (value === this._rawDisplay || value === this._meshDisplay) {
                    return;
                }

                if (value === null || value instanceof egret.Bitmap) {
                    this.__parent.setEgretDisplay.call(this, createEgretDisplay(value, DisplayType.Image));
                }
                else if (value instanceof egret.Mesh) {
                    this.__parent.setEgretDisplay.call(this, createEgretDisplay(value, DisplayType.Mesh));
                }
                else if (value instanceof Module["EgretArmature"]) {
                    this.__parent.setChildArmature.call(this, value);
                }
            }
        });

        Object.defineProperty(EgretSlot.prototype, "displayList", {
            get: EgretSlot.prototype.getEgretDisplayList,
            set: EgretSlot.prototype.setEgretDisplayList,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretSlot.prototype, "rawDisplay", {
            get: EgretSlot.prototype.getRawDisplay,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretSlot.prototype, "meshDisplay", {
            get: EgretSlot.prototype.getMeshDisplay,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretSlot.prototype, "display", {
            get: EgretSlot.prototype.getDisplay,
            set: EgretSlot.prototype.setDisplay,
            enumerable: true,
            configurable: true
        });

        EgretTextureAtlasData = Module["EgretTextureAtlasDataWASM"].extend("EgretTextureAtlasData", {
            __construct: function (this: PEgretTextureAtlasData, rawTextures?: { name: string }[]) {
                this.__parent.__construct.call(this);
                this._textureNames = [];
                this._texture = null;
                if (rawTextures) {
                    for (const texture of rawTextures) {
                        this._textureNames.push(texture.name);
                    }
                }
            },
            __destruct: function (this: PEgretTextureAtlasData) {
                this.__parent.__destruct.call(this);
                this._textureNames.length = 0;
                this._texture = null;
            }
        });

        Object.defineProperty((EgretTextureAtlasData as any).prototype, "renderTexture", {
            get: function (this: PEgretTextureAtlasData): egret.Texture | null {
                return this._texture;
            },
            set: function (this: PEgretTextureAtlasData, value: egret.Texture): void {
                if (this._texture === value) {
                    return;
                }
                if ((value as any)["textureId"] === null || (value as any)["textureId"] === undefined) {
                    (egret as any).WebAssemblyNode.setValuesToBitmapData(value);
                }
                this._texture = value;

                const textures = this.textures;
                if (this._texture !== null) {
                    const bitmapData = this._texture.bitmapData;
                    const textureAtlasWidth = this.width > 0.0 ? this.width : bitmapData.width;
                    const textureAtlasHeight = this.height > 0.0 ? this.height : bitmapData.height;
                    for (let k of this._textureNames) {
                        for (let i = 0, l = k.length; i < l; ++i) {
                            if (k.charCodeAt(i) > 255) {
                                k = encodeURI(k);
                                break;
                            }
                        }

                        const textureData = textures.get(k) as PEgretTextureData;
                        const subTextureWidth = Math.min(textureData.region.width, textureAtlasWidth - textureData.region.x); // TODO need remove
                        const subTextureHeight = Math.min(textureData.region.height, textureAtlasHeight - textureData.region.y); // TODO need remove

                        if (!textureData.renderTexture) {
                            let currTex = new egret.Texture();
                            currTex._bitmapData = bitmapData;
                            if (textureData.rotated) {
                                currTex.$initData(
                                    textureData.region.x, textureData.region.y,
                                    subTextureHeight, subTextureWidth,
                                    0, 0,
                                    subTextureHeight, subTextureWidth,
                                    textureAtlasWidth, textureAtlasHeight,
                                    // textureData.rotated
                                );
                            }
                            else {
                                currTex.$initData(
                                    textureData.region.x, textureData.region.y,
                                    subTextureWidth, subTextureHeight,
                                    0, 0,
                                    subTextureWidth, subTextureHeight,
                                    textureAtlasWidth, textureAtlasHeight
                                );
                            }
                            // Egret 5.0
                            (egret as any).WebAssemblyNode.setValuesToBitmapData(currTex);
                            (textureData as any).setTextureId((currTex as any)["textureId"]);
                            textureData.renderTexture = currTex;
                        }
                    }
                }
                else {
                    for (const k of this._textureNames) {
                        const textureData = textures.get(k) as PEgretTextureData;
                        textureData.renderTexture = null;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        EgretTextureData = Module["EgretTextureDataWASM"].extend("EgretTextureData", {
            __construct: function (this: PEgretTextureData) {
                this.__parent.__construct.call(this);
                this._renderTexture = null;
            },
            __destruct: function (this: PEgretTextureData) {
                this.__parent.__destruct.call(this);
                this._renderTexture = null;
            }
        });

        Object.defineProperty((EgretTextureData as any).prototype, "renderTexture", {
            get: function (this: PEgretTextureData): egret.Texture | null {
                return this._renderTexture;
            },
            set: function (this: PEgretTextureData, value: egret.Texture): void {
                if (this._renderTexture === value) {
                    return;
                }

                this._renderTexture = value;
            },
            enumerable: true,
            configurable: true
        });

        /*
        * @private
        * 扩展 c++ WorldClock。(在 c++ 中构造)
        */
        dragonBones.WorldClock = Module["WorldClock"];
        (dragonBones.WorldClock as any).prototype._c_contains = dragonBones.WorldClock.prototype.contains;
        (dragonBones.WorldClock as any).prototype._c_add = dragonBones.WorldClock.prototype.add;
        (dragonBones.WorldClock as any).prototype._c_remove = dragonBones.WorldClock.prototype.remove;
        (dragonBones.WorldClock as any).prototype.contains = function (this: any, value: IAnimatable): boolean { // js call.
            if (value instanceof dragonBones.Armature) {
                return this._c_contains((value as any).getAnimatable());
            }

            return this._c_contains(value);
        };
        (dragonBones.WorldClock as any).prototype.add = function (this: any, value: IAnimatable): void { // js call.
            if (value instanceof dragonBones.Armature) {
                return this._c_add((value as any).getAnimatable());
            }

            return this._c_add(value);
        };
        (dragonBones.WorldClock as any).prototype.remove = function (this: any, value: IAnimatable): void { // js call.
            if (value instanceof dragonBones.Armature) {
                return this._c_remove((value as any).getAnimatable());
            }

            return this._c_remove(value);
        };
        /**
         * @private
         * 扩展 c++ EgretArmature。(在 js 中构造)
         */
        dragonBones.Armature = Module["EgretArmature"];
        (dragonBones.Armature as any).prototype._c_addBone = dragonBones.Armature.prototype.addBone;
        (dragonBones.Armature as any).prototype._c_invalidUpdate = dragonBones.Armature.prototype.invalidUpdate;
        dragonBones.Armature.prototype.addBone = function (this: any, bone: Bone, name: string) {
            if (name === null || name === undefined) {
                name = "";
            }
            return this._c_addBone(bone, name);
        }
        dragonBones.Armature.prototype.invalidUpdate = function (this: any, boneName: string | null = null, updateSlotDisplay: boolean = false): void {
            if (boneName === null) {
                boneName = "";
            }
            return this._c_invalidUpdate(boneName, updateSlotDisplay);
        }
        dragonBones.Armature.prototype.getDisplay = function (this: any) {
            return this.proxy._display;
        }
        Object.defineProperty(dragonBones.Armature.prototype, "display", {
            get: function (this: any) {
                return this.proxy._display;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 扩展 c++ Animation
         */
        dragonBones.Animation = Module["Animation"];
        (dragonBones.Animation as any).prototype._c_play = dragonBones.Animation.prototype.play;
        (dragonBones.Animation as any).prototype._c_fadeIn = dragonBones.Animation.prototype.fadeIn;
        dragonBones.Animation.prototype.play = function (this: any,
            animationName: string | null = null, playTimes: number = -1): AnimationState | null {
            if (animationName === null) {
                animationName = "";
            }
            return this._c_play(animationName, playTimes);
        }
        dragonBones.Animation.prototype.fadeIn = function (this: any,
            animationName: string, fadeInTime: number = -1.0, playTimes: number = -1,
            layer: number = 0, group: string | null = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup
        ): AnimationState | null {
            if (animationName === null) {
                animationName = "";
            }
            if (group === null) {
                group = "";
            }
            return this._c_fadeIn(animationName, fadeInTime, playTimes, layer, group, fadeOutMode);
        }
    }

    const configTables: { [key: string]: { getter?: string[], setter?: string[], static?: string[], array?: string[] } } = {
        ActionData: {
            getter: [],
            setter: ["type", "bone", "slot", "data"]
        },
        DragonBonesData: {
            getter: ["frameIndices"],
            setter: [],
            array: ["armatureNames"]
        },
        ArmatureData: {
            getter: ["defaultActions", "actions"],
            setter: ["aabb", "defaultAnimation", "defaultSkin", "parent"],
            array: ["animationNames"]
        },
        BoneData: {
            getter: ["transform", "constraints"],
            setter: ["parent"]
        },
        SlotData: {
            getter: [],
            setter: ["blendMode", "color", "parent"],
            static: ["DEFAULT_COLOR"]
        },
        ConstraintData: {
            getter: [],
            setter: ["target", "root", "bone"]
        },
        DisplayData: {
            getter: ["transform"],
            setter: ["type", "parent"]
        },
        ImageDisplayData: {
            getter: ["pivot"],
            setter: ["texture"]
        },
        ArmatureDisplayData: {
            getter: ["actions"],
            setter: [] // armature
        },
        MeshDisplayData: {
            getter: [],
            setter: ["weight"]
        },
        WeightData: {
            getter: ["bones"],
            setter: []
        },
        AnimationData: {
            getter: [],
            setter: ["actionTimeline", "zOrderTimeline", "parent"]
        },
        TimelineData: {
            getter: [],
            setter: ["type"]
        },
        AnimationConfig: {
            getter: [],
            setter: ["fadeOutMode", "fadeOutTweenType", "fadeInTweenType"]
        },
        TextureData: {
            getter: ["region"],
            setter: ["frame"]
        },
        TransformObject: {
            getter: ["globalTransformMatrix", "global", "offset", "origin"],
            setter: []
        },
        Armature: {
            getter: ["armatureData", "animation", "proxy", "eventDispatcher"],
            setter: ["clock"]
        },
        Slot: {
            getter: ["boundingBoxData"],
            setter: ["displayIndex", "childArmature"]
        },
        Constraint: {
            getter: [],
            setter: ["target", "bone", "root"]
        },
        Animation: {
            getter: ["animationConfig"],
            setter: [],
            array: ["animationNames"]
        },
        WorldClock: {
            getter: [],
            setter: ["clock"],
            static: ["clock"]
        },
        EventObject: {
            getter: ["armature", "bone", "slot", "animationState", "data"],
            setter: []
        },
        EgretArmatureDisplayWASM: {
            getter: ["armature", "animation"],
            setter: []
        },
        DragonBones: {
            getter: ["clock"],
            setter: []
        }
    }

    function descGetter(funcName: string, target: any) {
        return {
            get: target["_c_get_" + funcName],
            enumerable: true,
            configurable: true
        };
    }

    function descSetter(funcName: string, target: any) {
        return {
            get: target["_c_get_" + funcName],
            set: target["_c_set_" + funcName],
            enumerable: true,
            configurable: true
        };
    }

    function descArrayGetter(funcName: string, target: any) {
        target;
        return {
            get: function (this: any): Array<any> {
                let array = this["_js_" + funcName];
                if (!array) {
                    array = [];

                    const vector = this["_c_get_" + funcName]();
                    for (let i = 0, l = vector.size(); i < l; ++i) {
                        array[i] = vector.get(i);
                    }
                }

                return array;
            },
            enumerable: true,
            configurable: true
        };
    }

    export function registerGetterSetter(): void {
        for (let fieldKey in configTables) {
            const getterClass = Module[fieldKey];
            const getterClassProto = Module[fieldKey].prototype;
            const getterArray = configTables[fieldKey].getter;
            const setterArray = configTables[fieldKey].setter;
            const staticArray = configTables[fieldKey].static;
            const arrayArray = configTables[fieldKey].array;

            if (getterArray) {
                for (let fieldName of getterArray) {
                    Object.defineProperty(getterClassProto, fieldName, descGetter(fieldName, getterClassProto));
                }
            }

            if (setterArray) {
                for (let fieldName of setterArray) {
                    Object.defineProperty(getterClassProto, fieldName, descSetter(fieldName, getterClassProto));
                }
            }

            if (staticArray) {
                for (let fieldName of staticArray) {
                    Object.defineProperty(getterClass, fieldName, descSetter(fieldName, getterClass));
                }
            }

            if (arrayArray) {
                for (let fieldName of arrayArray) {
                    Object.defineProperty(getterClassProto, fieldName, descArrayGetter(fieldName, getterClass));
                }
            }
        }
    }
}