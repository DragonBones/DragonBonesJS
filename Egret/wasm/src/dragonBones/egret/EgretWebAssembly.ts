namespace dragonBones {
    type ConfigItem = {
        static?: boolean | ConfigItem;
        getter?: boolean;
        setter?: boolean | Function;
        array?: boolean;
        source?: string;
        replace?: any;
    };

    export declare const EgretTextureData: any;
    export declare const EgretTextureAtlasData: any;
    export declare const EgretDisplayProxy: any;
    export declare const EgretArmatureProxy: any;
    export declare const EgretSlot: any;

    interface BindingClass {
        $$: {
            ptr: number;
            ptrType: {
                name: string;
            },
            count: {
                value: number;
            }
        }
    }

    interface STDVector<T> extends BindingClass {
        size(): number;
        get(index: number): T;
        set(index: number, value: T): void;
        push_back(value: T): void;

        delete(): void;
    }

    interface STDMap<T> extends BindingClass {
        get(key: string): T;
    }

    export interface PEgretTextureData extends TextureData, BindingClass {
        textureID: number;

        renderTexture: egret.Texture | null;
    }

    export interface PEgretTextureAtlasData extends TextureAtlasData, BindingClass {
        textureID: number;
        renderTexture: egret.Texture | null;

        _renderTexture: egret.Texture | null;
    }

    export interface PEgretDisplayProxy extends BaseObject, BindingClass {
        _display: egret.DisplayObject | null;

        setDisplayInfo(id: number, type: DisplayType, armature: Armature | null): void;
        getDisplayType(): DisplayType;
        getDisplayID(): number;
        getArmature(): number;
    }

    export interface PEgretArmatureProxy extends IArmatureProxy, BindingClass {
        _display: EgretArmatureDisplay;

        getLastEventObject(): EventObject;
    }

    export interface PEgretSlot extends Slot, BindingClass {
        _displays: Array<egret.DisplayObject | Armature | null>;

        getEgretDisplayList(): STDVector<PEgretDisplayProxy | null>;
        setEgretDisplayList(value: STDVector<PEgretDisplayProxy | null>, isInternal: boolean): any;
        getEgretRawDisplay(): PEgretDisplayProxy;
        getEgretMeshDisplay(): PEgretDisplayProxy;
        getEgretDisplay(): PEgretDisplayProxy | null;
        setEgretDisplay(value: PEgretDisplayProxy | null): void;
    }

    export function stdVectorToArray<T>(stdVector: STDVector<T>, array: Array<T>): void {
        for (let i = 0, l = stdVector.size(); i < l; ++i) {
            array[i] = stdVector.get(i);
        }
    }

    export function stdMapToMap<T>(stdMap: STDMap<T>, map: Map<T>): void {
        const stdVector = Module["getMapKeys" + stdMap.$$.ptrType.name.replace("*", "")](stdMap);
        const array = new Array<string>();
        stdVectorToArray(stdVector, array)

        for (let k of array) {
            for (let i = 0, l = k.length; i < l; ++i) {
                if (k.charCodeAt(i) > 255) {
                    k = encodeURI(k);
                    break;
                }
            }

            map[k] = stdMap.get(k);
        }
    }

    let isInitialed = false;

    export function modifyCPPAPI(): void {
        if (isInitialed) {
            return;
        }

        isInitialed = true;
        (dragonBones as any).webAssemblyModule = Module;

        const WASMPoint = Module.WASMPoint; // TODO

        const config: { [key: string]: { [key: string]: ConfigItem | boolean } } = {
            DragonBones: {
                clock: { getter: true },
                eventManager: { getter: true }
            },
            BaseObject: {
                borrowObject: {
                    static: true,
                    replace: function <T extends BaseObject>(this: any, objectConstructor: { new(): T; }): T {
                        const object = new objectConstructor();

                        return object;
                    }
                },
                setMaxCount: {
                    static: true,
                    replace: function (this: any, objectConstructor: (typeof BaseObject) | null, maxCount: number): void {
                        objectConstructor; // TODO
                        this._c_setMaxCount(0, maxCount);
                    }

                },
                clearPool: {
                    static: true,
                    replace: function (this: any, objectConstructor: (typeof BaseObject) | null = null): void {
                        objectConstructor; // TODO
                        this._c_clearPool(0);
                    }
                }
            },
            WASMPoint: {
                // TODO
            },
            UserData: {
                ints: { getter: true, array: true },
                floats: { getter: true, array: true },
                strings: { getter: true, array: true }
            },
            ActionData: {
                bone: { getter: true, setter: true },
                slot: { getter: true, setter: true },
                data: { getter: true, setter: true },
            },
            DragonBonesData: {
                extend: true,
                frameIndices: { getter: true },
                armatureNames: { getter: true, array: true },
                binary: { getter: true },
                userData: { getter: true, setter: true },
                returnToPool: {
                    replace: function (this: any): void {
                        webAssemblyModule._free(this.binary);
                        webAssemblyModule.setDataBinary(this, 0, 0, 0, 0, 0, 0, 0);
                        this._c_returnToPool();
                    }
                }
            },
            ArmatureData: {
                extend: true,
                aabb: { getter: true },
                animationNames: { getter: true, array: true },
                sortedBones: { getter: true, array: true },
                sortedSlots: { getter: true, array: true },
                defaultActions: { getter: true, array: true },
                actions: { getter: true }, //
                defaultSkin: { getter: true, setter: true },
                defaultAnimation: { getter: true, setter: true },
                userData: { getter: true, setter: true },
                parent: { getter: true, setter: true }
            },
            BoneData: {
                transform: { getter: true },
                constraints: { getter: true, array: true },
                userData: { getter: true, setter: true },
                parent: { getter: true, setter: true }
            },
            ConstraintData: {
                target: { getter: true, setter: true },
                bone: { getter: true, setter: true },
                root: { getter: true, setter: true }
            },
            IKConstraintData: {},
            SlotData: {
                DEFAULT_COLOR: { getter: true, static: true },
                color: { getter: true, setter: true },
                userData: { getter: true, setter: true },
                parent: { getter: true, setter: true }
            },
            SkinData: {
                extend: true,
                displays: {
                    getter: true,
                    replace: function (this: any): Map<any> {
                        const stdMap = this._c_get_displays() as STDMap<any>;
                        const map = {};
                        stdMapToMap(stdMap, map);

                        return map;
                    }
                }
            },
            DisplayData: {
                transform: { getter: true },
                parent: { getter: true, setter: true }
            },
            ImageDisplayData: {
                pivot: { getter: true },
                texture: { getter: true, setter: true }
            },
            ArmatureDisplayData: {
                actions: { getter: true, array: true },
                armature: { getter: true, setter: true }
            },
            MeshDisplayData: {
                weight: { getter: true, setter: true }
            },
            BoundingBoxDisplayData: {
                boundingBox: { getter: true, setter: true }
            },
            WeightData: {
                bones: { getter: true, array: true }
            },
            BoundingBoxData: {},
            RectangleBoundingBoxData: {},
            EllipseBoundingBoxData: {},
            PolygonBoundingBoxData: {
                vertices: { getter: true } //
            },
            AnimationData: {
                actionTimeline: { getter: true, setter: true },
                zOrderTimeline: { getter: true, setter: true },
                parent: { getter: true, setter: true }
            },
            TimelineData: {
            },
            AnimationConfig: {
            },
            TextureAtlasData: {
                textures: {
                    getter: true,
                    replace: function (this: any): Map<TextureData> {
                        const stdMap = this._c_get_textures() as STDMap<TextureData>;
                        const map = {};
                        stdMapToMap(stdMap, map);

                        return map;
                    }
                },
            },
            TextureData: {
                region: { getter: true },
                frame: { getter: true, setter: true },
                parent: { getter: true, setter: true }
            },
            IArmatureProxy: {
                armature: { getter: true },
                animation: { getter: true },
            },
            Armature: {
                extend: true,
                init: {
                    replace: function (this: Armature, armatureData: ArmatureData, proxy: IArmatureProxy, display: any, dragonBones: DragonBones): void {
                        Module.armatureInit(this, armatureData, proxy, display, dragonBones);
                    }
                },
                armatureData: { getter: true },
                userData: { getter: true },
                getBones: { array: true },
                getSlots: { array: true },
                animation: { getter: true },
                proxy: {
                    getter: true
                },
                eventDispatcher: {
                    getter: true,
                    replace: function (this: Armature): EgretArmatureDisplay {
                        return (this.proxy as PEgretArmatureProxy)._display;
                    }
                },
                display: {
                    getter: true,
                    replace: function (this: Armature): EgretArmatureDisplay {
                        return (this.proxy as PEgretArmatureProxy)._display;
                    }
                },
                clock: { getter: true, setter: true },
                parent: { getter: true },
                invalidUpdate: {
                    replace: function (this: any, boneName: string | null = null, updateSlotDisplay: boolean = false): void {
                        this._c_invalidUpdate(boneName || "", updateSlotDisplay);
                    }
                },
                intersectsSegment: {
                    replace: function (
                        this: any,
                        xA: number, yA: number, xB: number, yB: number,
                        intersectionPointA: { x: number, y: number } | null = null,
                        intersectionPointB: { x: number, y: number } | null = null,
                        normalRadians: { x: number, y: number } | null = null
                    ): Slot | null {
                        let a = null;
                        let b = null;
                        let c = null;

                        if (intersectionPointA) {
                            a = WASMPoint.getHelpPointA();
                        }
                        if (intersectionPointB) {
                            b = WASMPoint.getHelpPointB();
                        }
                        if (normalRadians) {
                            c = WASMPoint.getHelpPointB();
                        }

                        const r = this._c_intersectsSegment(xA, yA, xB, yB, a, b, c);

                        if (intersectionPointA) {
                            intersectionPointA.x = a.x;
                            intersectionPointA.y = a.y;
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = b.x;
                            intersectionPointB.y = b.y;
                        }
                        if (normalRadians) {
                            normalRadians.x = c.x;
                            normalRadians.y = c.y;
                        }

                        return r;
                    }
                },
                getBoneByDisplay: {
                    replace: function (this: Armature, display: egret.DisplayObject): Bone | null {
                        const slot = this.getSlotByDisplay(display);

                        return slot !== null ? slot.parent : null;
                    }
                },
                getSlotByDisplay: {
                    replace: function (this: Armature, display: egret.DisplayObject): Slot | null {
                        for (const slot of this.getSlots()) {
                            if (slot.display === display) {
                                return slot;
                            }
                        }

                        return null;
                    }
                },
                hasEventListener: {
                    replace: function (this: Armature, type: string) { // TODO @deprecated
                        (this.display as EgretArmatureDisplay).hasEventListener(type);
                    }
                },
                addEventListener: {
                    replace: function (this: Armature, type: string, listener: Function, target: any) { // TODO @deprecated
                        (this.display as EgretArmatureDisplay).addEventListener(type, listener, target);
                    }
                },
                removeEventListener: {
                    replace: function (this: Armature, type: string, listener: Function, target: any) { // TODO @deprecated
                        (this.display as EgretArmatureDisplay).removeEventListener(type, listener, target);
                    }
                },
                replacedTexture: { // TODO @deprecated
                    getter: true,
                    setter: function (this: Armature) {
                        console.log("WebAssembly can not support set replacedTexture yet.");
                    },
                    replace: function (this: Armature) {
                        console.log("WebAssembly can not support get replacedTexture yet.");
                    }
                },
                replaceTexture: { // TODO @deprecated
                    replace: function (this: Armature) {
                        console.log("WebAssembly can not support replaceTexture yet.");
                    }
                },
                enableAnimationCache: { // TODO @deprecated
                    replace: function (this: Armature, frameRate: number): void {
                        this.cacheFrameRate = frameRate;
                    }
                },
                getDisplay: { // TODO @deprecated
                    replace: function (this: Armature) {
                        return this.display;
                    }
                }
            },
            TransformObject: {
                globalTransformMatrix: { getter: true },
                global: { getter: true },
                offset: { getter: true },
                origin: { getter: true },
                armature: { getter: true },
                parent: { getter: true }
            },
            Bone: {
                boneData: { getter: true },
                getBones: { array: true },
                getSlots: { array: true },
                slot: {
                    getter: true,
                    replace: function (this: Bone): Slot | null {
                        console.warn("已废弃，请参考 @see");

                        for (const slot of this.armature.getSlots()) {
                            if (slot.parent === this) {
                                return slot;
                            }
                        }

                        return null;
                    }
                }
            },
            Constraint: {
                target: { getter: true, setter: true },
                bone: { getter: true, setter: true },
                root: { getter: true, setter: true }
            },
            IKConstraint: {
            },
            Slot: {
                slotData: { getter: true },
                rawDisplayDatas: { getter: true, setter: true },
                boundingBoxData: { getter: true },
                childArmature: { getter: true, setter: true },
                getDisplay: {
                    replace: function (this: Slot): any {
                        return this.display;
                    }
                },
                setDisplay: {
                    replace: function (this: Slot, value: any) {
                        this.display = value;
                    }
                }
            },
            IAnimatable: {},
            WorldClock: {
                clock: {
                    static: {
                        getter: true,
                        replace: function (this: any): WorldClock {
                            return this.getStaticClock();
                        }
                    },
                    getter: true, setter: true
                },
                contains: {
                    replace: function (this: any, value: IAnimatable): boolean {
                        if (value instanceof Armature) {
                            return this._c_contains((value as any).getAnimatable());
                        }

                        return this._c_contains(value);
                    }
                },
                add: {
                    replace: function (this: any, value: IAnimatable): void {
                        if (value instanceof Armature) {
                            this._c_add((value as any).getAnimatable());
                        }
                        else {
                            this._c_add(value);
                        }
                    }
                },
                remove: {
                    replace: function (this: any, value: IAnimatable): void {
                        if (value instanceof Armature) {
                            this._c_remove((value as any).getAnimatable());
                        }
                        else {
                            this._c_remove(value);
                        }
                    }
                },
                advanceTime: {
                    replace: function (this: any, passedTime: number): void {
                        if (passedTime < 0.0) {
                            passedTime = new Date().getTime() * 0.001 - this.time;
                        }

                        this._c_advanceTime(passedTime);
                    }
                }
            },
            Animation: {
                stop: {
                    replace: function (this: any, animationName: string | null): void {
                        this._c_stop(animationName || "");
                    }
                },
                play: {
                    replace: function (this: any, animationName: string | null, playTimes: number = -1): AnimationState | null {
                        return this._c_play(animationName || "", playTimes);
                    }
                },
                fadeIn: {
                    replace: function (
                        this: any,
                        animationName: string, fadeInTime: number = -1.0, playTimes: number = -1,
                        layer: number = 0, group: string | null = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup
                    ): AnimationState | null {
                        return this._c_fadeIn(animationName || "", fadeInTime, playTimes, layer, group || "", fadeOutMode);
                    }
                },
                gotoAndPlayByTime: {
                    replace: function (
                        this: any,
                        animationName: string, time: number = 0.0, playTimes: number = -1
                    ): AnimationState | null {
                        return this._c_gotoAndPlayByTime(animationName, time, playTimes);
                    }
                },
                gotoAndPlayByFrame: {
                    replace: function (
                        this: any,
                        animationName: string, frame: number = 0, playTimes: number = -1
                    ): AnimationState | null {
                        return this._c_gotoAndPlayByFrame(animationName, frame, playTimes);
                    }
                },
                gotoAndPlayByProgress: {
                    replace: function (
                        this: any,
                        animationName: string, progress: number = 0.0, playTimes: number = -1
                    ): AnimationState | null {
                        return this._c_gotoAndPlayByProgress(animationName, progress, playTimes);
                    }
                },
                gotoAndStopByTime: {
                    replace: function (
                        this: any, animationName: string, time: number = 0.0
                    ): AnimationState | null {
                        return this._c_gotoAndStopByTime(animationName, time);
                    }
                },
                gotoAndStopByFrame: {
                    replace: function (
                        this: any, animationName: string, frame: number = 0.0
                    ): AnimationState | null {
                        return this._c_gotoAndStopByFrame(animationName, frame);
                    }
                },
                gotoAndStopByProgress: {
                    replace: function (
                        this: any, animationName: string, progress: number = 0.0
                    ): AnimationState | null {
                        return this._c_gotoAndStopByProgress(animationName, progress);
                    }
                },
                getStates: { array: true },
                animationNames: { getter: true, array: true },
                animationConfig: { getter: true },
                lastAnimationState: { getter: true },
                gotoAndPlay: {
                    replace: function (
                        this: Animation, animationName: string, fadeInTime: number = -1, duration: number = -1, playTimes: number = -1
                    ): AnimationState | null {
                        console.warn("已废弃，请参考 play()");
                        console.warn("已废弃，请参考 fadeIn()");

                        const animationState = this.fadeIn(animationName, fadeInTime, playTimes);
                        if (animationState != null && duration >= 0.0) {
                            if (duration = 0.0) {
                                animationState.timeScale = 0.0;
                            }
                            else {
                                animationState.timeScale = animationState.totalTime / duration;
                            }
                        }

                        return animationState;
                    }
                },
                gotoAndStop: {
                    replace: function (this: Animation, animationName: string, time: number = 0): AnimationState | null {
                        console.warn("已废弃，请参考 @see");

                        return this.gotoAndStopByTime(animationName, time);
                    }
                }
            },
            AnimationState: {
                animationData: { getter: true },
                fadeOut: {
                    replace: function (this: any, fadeOutTime: number, pausePlayhead: boolean = true): void {
                        this._c_fadeOut(fadeOutTime, pausePlayhead);
                    }
                },
                addBoneMask: {
                    replace: function (this: any, name: string, recursive: boolean = true): void {
                        this._c_addBoneMask(name, recursive);
                    }
                },
                removeBoneMask: {
                    replace: function (this: any, name: string, recursive: boolean = true): void {
                        this._c_removeBoneMask(name, recursive);
                    }
                }
            },
            EventObject: {
                START: { static: true, replace: EventObject.START },
                LOOP_COMPLETE: { static: true, replace: EventObject.LOOP_COMPLETE },
                COMPLETE: { static: true, replace: EventObject.COMPLETE },
                FADE_IN: { static: true, replace: EventObject.FADE_IN },
                FADE_IN_COMPLETE: { static: true, replace: EventObject.FADE_IN_COMPLETE },
                FADE_OUT: { static: true, replace: EventObject.FADE_OUT },
                FADE_OUT_COMPLETE: { static: true, replace: EventObject.FADE_OUT_COMPLETE },
                FRAME_EVENT: { static: true, replace: EventObject.FRAME_EVENT },
                SOUND_EVENT: { static: true, replace: EventObject.SOUND_EVENT },
                armature: { getter: true },
                bone: { getter: true },
                slot: { getter: true },
                animationState: { getter: true },
                data: { getter: true }
            },
            EgretTextureAtlasData: {
                extend: true,
                renderTexture: {
                    getter: true,
                    setter: function (this: PEgretTextureAtlasData, value: egret.Texture | null): void {
                        if (this._renderTexture === value) {
                            return;
                        }

                        this._renderTexture = value;

                        let textureID = -1;
                        if (this._renderTexture && !this._renderTexture.$textureId) {
                            egret.WebAssemblyNode.setValuesToBitmapData(this._renderTexture);
                            textureID = this._renderTexture.$textureId;
                        }

                        this.textureID = textureID;

                        if (this._renderTexture) {
                            const bitmapData = this._renderTexture.bitmapData;
                            const textureAtlasWidth = this.width > 0.0 ? this.width : bitmapData.width;
                            const textureAtlasHeight = this.height > 0.0 ? this.height : bitmapData.height;

                            for (let k in this.textures) {
                                const textureData = this.textures[k] as PEgretTextureData;
                                const region = textureData.region;
                                const subTextureWidth = region.width;
                                const subTextureHeight = region.height;

                                if (!textureData.renderTexture) { // May be undefined.
                                    textureData.renderTexture = new egret.Texture();
                                    textureData.renderTexture.disposeBitmapData = false;
                                }

                                textureData.renderTexture._bitmapData = bitmapData;

                                if (textureData.rotated) {
                                    textureData.renderTexture.$initData(
                                        region.x, region.y,
                                        subTextureHeight, subTextureWidth,
                                        0, 0,
                                        subTextureHeight, subTextureWidth,
                                        textureAtlasWidth, textureAtlasHeight
                                    );
                                }
                                else {
                                    textureData.renderTexture.$initData(
                                        region.x, region.y,
                                        subTextureWidth, subTextureHeight,
                                        0, 0,
                                        subTextureWidth, subTextureHeight,
                                        textureAtlasWidth, textureAtlasHeight
                                    );
                                }

                                (egret as any).WebAssemblyNode.setValuesToBitmapData(textureData.renderTexture);
                                textureData.textureID = textureData.renderTexture.$textureId;
                            }
                        }
                        else {
                            for (let k in this.textures) {
                                const textureData = this.textures[k] as PEgretTextureData;
                                textureData.renderTexture = null;
                            }
                        }
                    },
                    replace: function (this: PEgretTextureAtlasData): egret.Texture | null {
                        return this._renderTexture;
                    }
                },
                createTexture: {
                    replace: function (this: PEgretTextureAtlasData): TextureData {
                        return BaseObject.borrowObject(EgretTextureData) as any;
                    }
                },
                returnToPool: {
                    replace: function (this: PEgretTextureAtlasData): void {
                        (this as any)._c_returnToPool();
                        this._renderTexture = null;
                    }
                }
            },
            EgretTextureData: {
                extend: true,
                _onClear: {
                    replace: function (this: PEgretTextureData): void {
                        if (this.renderTexture) {
                            this.renderTexture.dispose();
                            this.renderTexture = null;
                        }
                    }
                }
            },
            EgretDisplayProxy: {
                extend: true,
            },
            EgretArmatureProxy: {
                extend: true,
                _dispatchEvent: {
                    replace: function (this: PEgretArmatureProxy, type: string): void {
                        this._display._dispatchEvent(type, this.getLastEventObject());
                    }
                },
                hasEvent: {
                    replace: function (this: PEgretArmatureProxy, type: string): boolean {
                        return this._display.hasEvent(type);
                    }
                },
                addEvent: {
                    replace: function (this: PEgretArmatureProxy, type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
                        this._display.addEvent(type, listener, target);
                    }
                },
                removeEvent: {
                    replace: function (this: PEgretArmatureProxy, type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
                        this._display.removeEvent(type, listener, target);
                    }
                }
            },
            EgretSlot: {
                extend: true,
                _setDisplayList: {
                    replace: function (this: PEgretSlot, value: Array<egret.DisplayObject | Armature | null>): void {
                        const stdVector = new Module.EgretDisplayVector() as STDVector<PEgretDisplayProxy | null>;

                        for (let i = 0, l = value.length; i < l; ++i) {
                            const display = value[i];

                            if (display instanceof Armature) {
                                stdVector.push_back((display.proxy as any)._c_get_display());
                            }
                            else if (display !== null) {
                                if (display === this.rawDisplay) {
                                    stdVector.push_back(this.getEgretRawDisplay());
                                }
                                else {
                                    stdVector.push_back(this.getEgretMeshDisplay());
                                }
                            }
                            else {
                                stdVector.push_back(null);
                            }
                        }

                        this.setEgretDisplayList(stdVector, true);

                        stdVector.delete();
                    }
                },
                init: {
                    replace: function (this: PEgretSlot, slotData: SlotData, displayDatas: STDVector<DisplayData | null> | null, rawDisplay: egret.Bitmap, meshDisplay: egret.Mesh): void {
                        const egretRawDisplayProxy = BaseObject.borrowObject(EgretDisplayProxy) as any as PEgretDisplayProxy;
                        const egretMeshDisplayProxy = BaseObject.borrowObject(EgretDisplayProxy) as any as PEgretDisplayProxy;
                        egretRawDisplayProxy.setDisplayInfo(rawDisplay.$waNode.id, DisplayType.Image, null);
                        egretMeshDisplayProxy.setDisplayInfo(meshDisplay.$waNode.id, DisplayType.Mesh, null);
                        egretRawDisplayProxy._display = rawDisplay;
                        egretMeshDisplayProxy._display = meshDisplay;

                        Module.slotInit(this, slotData, displayDatas, egretRawDisplayProxy, egretMeshDisplayProxy);
                    }
                },
                displayList: {
                    getter: true,
                    setter: function (this: PEgretSlot, value: Array<egret.DisplayObject | Armature | null>): void {
                        const stdVector = new Module.EgretDisplayVector() as STDVector<PEgretDisplayProxy | null>;

                        for (let i = 0, l = value.length; i < l; ++i) {
                            const display = value[i];

                            if (display instanceof Armature) {
                                stdVector.push_back((display.proxy as any)._c_get_display());
                            }
                            else if (display !== null) {
                                if (display === this.rawDisplay) {
                                    stdVector.push_back(this.getEgretRawDisplay());
                                }
                                else if (display === this.meshDisplay) {
                                    stdVector.push_back(this.getEgretMeshDisplay());
                                }
                                else { // TODO search all display.
                                    const egretDisplayProxy = BaseObject.borrowObject(EgretDisplayProxy) as any as PEgretDisplayProxy;
                                    const displayID = display.$waNode.id;
                                    egretDisplayProxy.setDisplayInfo(displayID, value instanceof egret.Mesh ? DisplayType.Mesh : DisplayType.Image, null);
                                    stdVector.push_back(egretDisplayProxy);
                                }
                            }
                            else {
                                stdVector.push_back(null);
                            }
                        }

                        this.setEgretDisplayList(stdVector, false);

                        stdVector.delete();

                    },
                    replace: function (this: PEgretSlot): Array<egret.DisplayObject | Armature | null> {
                        if (this._displays) {
                            this._displays.length = 0;
                        }
                        else {
                            this._displays = [];
                        }

                        const displays = this.getEgretDisplayList();
                        for (let i = 0, l = displays.size(); i < l; ++i) {
                            const display = displays.get(i);
                            this._displays.push(display ? display._display : null);
                        }

                        return this._displays.concat();
                    }
                },
                rawDisplay: {
                    getter: true,
                    replace: function (this: PEgretSlot): egret.Bitmap {
                        return this.getEgretRawDisplay()._display as any;
                    }
                },
                meshDisplay: {
                    getter: true,
                    replace: function (this: PEgretSlot): egret.Mesh {
                        return this.getEgretMeshDisplay()._display as any;
                    }
                },
                display: {
                    getter: true,
                    setter: function (this: PEgretSlot, value: egret.DisplayObject | null): void {
                        if (value instanceof Armature) {
                            this.setEgretDisplay((value.proxy as any)._c_get_display());
                        }
                        else if (value !== null) {
                            if (value === this.rawDisplay) {
                                this.setEgretDisplay(this.getEgretRawDisplay());
                            }
                            else if (value === this.meshDisplay) {
                                this.setEgretDisplay(this.getEgretMeshDisplay());
                            }
                            else { // TODO search all display.
                                const egretDisplayProxy = BaseObject.borrowObject(EgretDisplayProxy) as any as PEgretDisplayProxy;
                                const displayID = value.$waNode.id;
                                egretDisplayProxy.setDisplayInfo(displayID, value instanceof egret.Mesh ? DisplayType.Mesh : DisplayType.Image, null);
                                this.setEgretDisplay(egretDisplayProxy);
                            }
                        }
                        else {
                            this.setEgretDisplay(null);
                        }
                    },
                    replace: function (this: PEgretSlot): egret.DisplayObject | null {
                        const egretDisplay = this.getEgretDisplay();
                        return egretDisplay ? egretDisplay._display : null;
                    }
                }
            }
        };

        function modifyTarget(target: any, memberKey: string, memberConfig: ConfigItem): void {
            if (memberConfig.getter && memberConfig.setter) {
                if (memberConfig.array) {
                    // TODO
                }
                else {
                    Object.defineProperty(target, memberKey, {
                        get: memberConfig.replace || target["_c_get_" + (memberConfig.source || memberKey)],
                        set: memberConfig.setter instanceof Function ? memberConfig.setter : target["_c_set_" + (memberConfig.source || memberKey)],
                        enumerable: true,
                        configurable: true
                    });
                }
            }
            else if (memberConfig.getter) {
                if (memberConfig.replace) {
                    Object.defineProperty(target, memberKey, {
                        get: memberConfig.replace,
                        enumerable: true,
                        configurable: true
                    });
                }
                else if (memberConfig.array) {
                    Object.defineProperty(target, memberKey, {
                        get: function (this: any): Array<any> | null {
                            const stdVector = this[memberConfig.source || ("_c_get_" + memberKey)]();
                            if (stdVector) {
                                const array = this["_js_" + memberKey] = this["_js_" + memberKey] || new Array<any>();
                                stdVectorToArray(stdVector, array);

                                return array;
                            }

                            return null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                }
                else {
                    if (memberConfig.source === memberKey) {
                        memberConfig.source = "";
                        target["_c_get_" + memberKey] = target[memberKey];
                    }

                    Object.defineProperty(target, memberKey, {
                        get: target[memberConfig.source || ("_c_get_" + memberKey)],
                        enumerable: true,
                        configurable: true
                    });
                }
            }
            else if (memberConfig.setter) {
                if (memberConfig.array) {
                    // TODO
                }
                else {
                    Object.defineProperty(target, memberKey, {
                        set: memberConfig.setter instanceof Function ? memberConfig.setter : target["_c_set_" + (memberConfig.source || memberKey)],
                        enumerable: true,
                        configurable: true
                    });
                }
            }
            else if (memberConfig.array) {
                target["_c_" + memberKey] = target[memberConfig.source || memberKey];
                target[memberKey] = function (this: any): Array<any> | null {
                    const stdVector = this["_c_" + memberKey].apply(this, arguments) as STDVector<any>;
                    if (stdVector) {
                        const array = this["_js_" + memberKey] = this["_js_" + memberKey] || new Array<any>();
                        array.length = 0;
                        stdVectorToArray(stdVector, array);

                        return array;
                    }

                    return null;
                }
            }
            else if (memberConfig.replace) {
                const rawFunction = target[memberConfig.source || memberKey];
                if (rawFunction) {
                    target["_c_" + memberKey] = rawFunction;
                }

                target[memberKey] = memberConfig.replace;
            }
        }

        for (let classKey in config) {
            const classConfig = config[classKey];
            const extend = classConfig["extend"] as boolean | undefined;
            const clazz = extend ? Module[classKey].extend(classKey + "Wrapper", {}) : Module[classKey];
            const classPrototype = clazz.prototype;

            if (classKey in dragonBones) {
                // console.log(`Replace ${classKey}.`);
            }

            for (let memberKey in classConfig) {
                if (memberKey === "extend") {
                    continue;
                }

                const memberConfig = classConfig[memberKey] as ConfigItem;

                if (memberConfig.static && typeof memberConfig.static !== "boolean") {
                    modifyTarget(clazz, memberKey, memberConfig.static);
                }
                else {
                    const target = memberConfig.static ? clazz : classPrototype;
                    modifyTarget(target, memberKey, memberConfig);
                }
            }

            (dragonBones as any)[classKey] = clazz;
        }
    }

    egret.WebAssembly.addModuleCallback(modifyCPPAPI, null);
}