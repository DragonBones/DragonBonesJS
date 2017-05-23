namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     */
    export class Armature extends BaseObject implements IAnimateble {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.Armature]";
        }
        private static _onSortSlots(a: Slot, b: Slot): number {
            return a._zOrder > b._zOrder ? 1 : -1;
        }
        /**
         * @language zh_CN
         * 是否继承父骨架的动画状态。
         * @default true
         * @version DragonBones 4.5
         */
        public inheritAnimation: boolean;
        /**
         * @private
         */
        public debugDraw: boolean;
        /**
         * @language zh_CN
         * 用于存储临时数据。
         * @version DragonBones 3.0
         */
        public userData: any;

        private _debugDraw: boolean;
        private _delayDispose: boolean;
        private _lockDispose: boolean;
        /**
         * @internal
         * @private
         */
        public _bonesDirty: boolean;
        private _slotsDirty: boolean;
        private _zOrderDirty: boolean;
        private _flipX: boolean;
        private _flipY: boolean;
        private _bones: Array<Bone> = [];
        private _slots: Array<Slot> = [];
        private _actions: Array<ActionData> = [];
        private _events: Array<EventObject> = [];
        /**
         * @private
         */
        public _armatureData: ArmatureData;
        /**
         * @private
         */
        public _skinData: SkinData;
        private _animation: Animation;
        private _proxy: IArmatureProxy;
        private _display: any;
        private _eventManager: IEventDispatcher;
        /**
         * @internal
         * @private
         */
        public _parent: Slot;
        private _clock: WorldClock;
        /**
         * @private
         */
        public _replaceTextureAtlasData: TextureAtlasData;
        private _replacedTexture: any;

        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _onClear(): void {
            for (let i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i].returnToPool();
            }

            for (let i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i].returnToPool();
            }

            for (let i = 0, l = this._events.length; i < l; ++i) {
                this._events[i].returnToPool();
            }

            if (this._clock) {
                this._clock.remove(this);
            }

            if (this._proxy) {
                this._proxy._onClear();
            }

            if (this._replaceTextureAtlasData) {
                this._replaceTextureAtlasData.returnToPool();
            }

            if (this._animation) {
                this._animation.returnToPool();
            }

            this.inheritAnimation = true;
            this.debugDraw = false;
            this.userData = null;

            this._debugDraw = false;
            this._delayDispose = false;
            this._lockDispose = false;
            this._bonesDirty = false;
            this._slotsDirty = false;
            this._zOrderDirty = false;
            this._flipX = false;
            this._flipY = false;
            this._bones.length = 0;
            this._slots.length = 0;
            this._actions.length = 0;
            this._events.length = 0;
            this._armatureData = null;
            this._skinData = null;
            this._animation = null;
            this._proxy = null;
            this._display = null;
            this._eventManager = null;
            this._parent = null;
            this._clock = null;
            this._replaceTextureAtlasData = null;
            this._replacedTexture = null;
        }

        private _sortBones(): void {
            const total = this._bones.length;
            if (total <= 0) {
                return;
            }

            const sortHelper = this._bones.concat();
            let index = 0;
            let count = 0;

            this._bones.length = 0;

            while (count < total) {
                const bone = sortHelper[index++];

                if (index >= total) {
                    index = 0;
                }

                if (this._bones.indexOf(bone) >= 0) {
                    continue;
                }

                if (bone.parent && this._bones.indexOf(bone.parent) < 0) {
                    continue;
                }

                if (bone.ik && this._bones.indexOf(bone.ik) < 0) {
                    continue;
                }

                if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex === bone.ikChain) {
                    this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone); // ik, parent, bone, children
                }
                else {
                    this._bones.push(bone);
                }

                count++;
            }
        }

        private _sortSlots(): void {
            this._slots.sort(Armature._onSortSlots);
        }

        private _doAction(value: ActionData): void {
            switch (value.type) {
                case ActionType.Play:
                    this._animation.playConfig(value.animationConfig);
                    break;

                default:
                    break;
            }
        }
        /**
         * @private
         */
        public _init(
            armatureData: ArmatureData, skinData: SkinData,
            proxy: IArmatureProxy, display: any, eventManager: IEventDispatcher
        ): void {
            if (this._armatureData) {
                return;
            }

            this._armatureData = armatureData;
            this._skinData = skinData;
            this._animation = BaseObject.borrowObject(Animation);
            this._proxy = proxy;
            this._display = display;
            this._eventManager = eventManager;

            this._animation._init(this);
            this._animation.animations = this._armatureData.animations;
        }
        /**
         * @internal
         * @private
         */
        public _addBoneToBoneList(value: Bone): void {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones.push(value);
                this._animation._timelineStateDirty = true;
            }
        }
        /**
         * @internal
         * @private
         */
        public _removeBoneFromBoneList(value: Bone): void {
            const index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        }
        /**
         * @internal
         * @private
         */
        public _addSlotToSlotList(value: Slot): void {
            if (this._slots.indexOf(value) < 0) {
                this._slotsDirty = true;
                this._slots.push(value);
                this._animation._timelineStateDirty = true;
            }
        }
        /**
         * @internal
         * @private
         */
        public _removeSlotFromSlotList(value: Slot): void {
            const index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        }
        /**
         * @private
         */
        public _sortZOrder(slotIndices: Array<number>): void {
            const slots = this._armatureData.sortedSlots;
            const isOriginal = !slotIndices || slotIndices.length < 1;

            if (this._zOrderDirty || !isOriginal) {
                for (let i = 0, l = slots.length; i < l; ++i) {
                    const slotIndex = isOriginal ? i : slotIndices[i];
                    const slotData = slots[slotIndex];

                    if (slotData) {
                        const slot = this.getSlot(slotData.name);
                        if (slot) {
                            slot._setZorder(i);
                        }
                    }
                }

                this._slotsDirty = true;
                this._zOrderDirty = !isOriginal;
            }
        }
        /**
         * @private
         */
        public _bufferAction(value: ActionData): void {
            this._actions.push(value);
        }
        /**
         * @internal
         * @private
         */
        public _bufferEvent(value: EventObject, type: string): void {
            value.type = type;
            value.armature = this;
            this._events.push(value);
        }
        /**
         * @language zh_CN
         * 释放骨架。 (回收到对象池)
         * @version DragonBones 3.0
         */
        public dispose(): void {
            if (this._armatureData) {
                if (this._lockDispose) {
                    this._delayDispose = true;
                }
                else {
                    this.returnToPool();
                }
            }
        }
        /**
         * @language zh_CN
         * 更新骨架和动画。
         * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @version DragonBones 3.0
         */
        public advanceTime(passedTime: number): void {
            if (!this._armatureData) {
                throw new Error("The armature has been disposed.");
                //return;
            }
            else if (!this._armatureData.parent) {
                throw new Error("The armature data has been disposed.");
                //return;
            }

            const prevCacheFrameIndex = this._animation._cacheFrameIndex;

            // Update nimation.
            this._animation._advanceTime(passedTime);

            const currentCacheFrameIndex = this._animation._cacheFrameIndex;

            // Sort bones and slots.
            if (this._bonesDirty) {
                this._bonesDirty = false;
                this._sortBones();
            }

            if (this._slotsDirty) {
                this._slotsDirty = false;
                this._sortSlots();
            }

            let i = 0, l = 0;

            // Update bones and slots.
            if (currentCacheFrameIndex < 0 || currentCacheFrameIndex !== prevCacheFrameIndex) {
                for (i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i]._update(currentCacheFrameIndex);
                }

                for (i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i]._update(currentCacheFrameIndex);
                }
            }

            //
            const drawed = this.debugDraw || DragonBones.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                this._proxy._debugDraw(this._debugDraw);
            }

            if (!this._lockDispose) {
                this._lockDispose = true;

                // Events. (Dispatch event before action.)
                l = this._events.length;
                if (l > 0) {
                    for (i = 0; i < l; ++i) {
                        const eventObject = this._events[i];
                        this._proxy._dispatchEvent(eventObject.type, eventObject);

                        if (eventObject.type === EventObject.SOUND_EVENT) {
                            this._eventManager._dispatchEvent(eventObject.type, eventObject);
                        }

                        eventObject.returnToPool();
                    }

                    this._events.length = 0;
                }

                // Actions.
                l = this._actions.length;
                if (l > 0) {
                    for (i = 0; i < l; ++i) {
                        const action = this._actions[i];
                        if (action.slot) {
                            const slot = this.getSlot(action.slot.name);
                            if (slot) {
                                const childArmature = slot.childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else if (action.bone) {
                            for (let iA = 0, lA = this._slots.length; iA < lA; ++iA) {
                                const childArmature = this._slots[iA].childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else {
                            this._doAction(action);
                        }
                    }

                    this._actions.length = 0;
                }

                this._lockDispose = false;
            }

            if (this._delayDispose) {
                this.returnToPool();
            }
        }
        /**
         * @language zh_CN
         * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public invalidUpdate(boneName: string = null, updateSlotDisplay: boolean = false): void {
            if (boneName) {
                const bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();

                    if (updateSlotDisplay) {
                        for (let i = 0, l = this._slots.length; i < l; ++i) {
                            const slot = this._slots[i];
                            if (slot.parent === bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (let i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].invalidUpdate();
                }

                if (updateSlotDisplay) {
                    for (let i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].invalidUpdate();
                    }
                }
            }
        }
        /**
         * @language zh_CN
         * 判断点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @version DragonBones 5.0
         */
        public containsPoint(x: number, y: number): Slot {
            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                if (slot.containsPoint(x, y)) {
                    return slot;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 判断线段是否与骨架的所有插槽的自定义包围盒相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
         * @version DragonBones 5.0
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): Slot {
            const isV = xA === xB;
            let dMin = 0.0;
            let dMax = 0.0;
            let intXA = 0.0;
            let intYA = 0.0;
            let intXB = 0.0;
            let intYB = 0.0;
            let intAN = 0.0;
            let intBN = 0.0;
            let intSlotA: Slot = null;
            let intSlotB: Slot = null;

            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                const intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
                if (intersectionCount > 0) {
                    if (intersectionPointA || intersectionPointB) {
                        if (intersectionPointA) {
                            let d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }

                            if (!intSlotA || d < dMin) {
                                dMin = d;
                                intXA = intersectionPointA.x;
                                intYA = intersectionPointA.y;
                                intSlotA = slot;

                                if (normalRadians) {
                                    intAN = normalRadians.x;
                                }
                            }
                        }

                        if (intersectionPointB) {
                            let d = intersectionPointB.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }

                            if (!intSlotB || d > dMax) {
                                dMax = d;
                                intXB = intersectionPointB.x;
                                intYB = intersectionPointB.y;
                                intSlotB = slot;

                                if (normalRadians) {
                                    intBN = normalRadians.y;
                                }
                            }
                        }
                    }
                    else {
                        intSlotA = slot;
                        break;
                    }
                }
            }

            if (intSlotA && intersectionPointA) {
                intersectionPointA.x = intXA;
                intersectionPointA.y = intYA;

                if (normalRadians) {
                    normalRadians.x = intAN;
                }
            }

            if (intSlotB && intersectionPointB) {
                intersectionPointB.x = intXB;
                intersectionPointB.y = intYB;

                if (normalRadians) {
                    normalRadians.y = intBN;
                }
            }

            return intSlotA;
        }
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        public getBone(name: string): Bone {
            for (let i = 0, l = this._bones.length; i < l; ++i) {
                const bone = this._bones[i];
                if (bone.name === name) {
                    return bone;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        public getBoneByDisplay(display: any): Bone {
            const slot = this.getSlotByDisplay(display);

            return slot ? slot.parent : null;
        }
        /**
         * @language zh_CN
         * 获取插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public getSlot(name: string): Slot {
            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                if (slot.name === name) {
                    return slot;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public getSlotByDisplay(display: any): Slot {
            if (display) {
                for (let i = 0, l = this._slots.length; i < l; ++i) {
                    const slot = this._slots[i];
                    if (slot.display === display) {
                        return slot;
                    }
                }
            }

            return null;
        }
        /**
         * @deprecated
         */
        public addBone(value: Bone, parentName: string = null): void {
            if (value) {
                value._setArmature(this);
                value._setParent(parentName ? this.getBone(parentName) : null);
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @deprecated
         */
        public removeBone(value: Bone): void {
            if (value && value.armature === this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @deprecated
         */
        public addSlot(value: Slot, parentName: string): void {
            const bone = this.getBone(parentName);
            if (bone) {
                value._setArmature(this);
                value._setParent(bone);
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @deprecated
         */
        public removeSlot(value: Slot): void {
            if (value && value.armature === this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图类型。
         * @param texture 贴图。
         * @version DragonBones 4.5
         */
        public replaceTexture(texture: any): void {
            this.replacedTexture = texture;
        }
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        public getBones(): Array<Bone> {
            return this._bones;
        }
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public getSlots(): Array<Slot> {
            return this._slots;
        }
        /**
         * @language zh_CN
         * 骨架名称。
         * @see dragonBones.ArmatureData#name
         * @version DragonBones 3.0
         */
        public get name(): string {
            return this._armatureData ? this._armatureData.name : null;
        }
        /**
         * @language zh_CN
         * 获取骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         */
        public get armatureData(): ArmatureData {
            return this._armatureData;
        }
        /**
         * @language zh_CN
         * 获得动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         */
        public get animation(): Animation {
            return this._animation;
        }
        /**
         * @language zh_CN
         * 获取事件监听器。
         * @version DragonBones 5.0
         */
        public get eventDispatcher(): IEventDispatcher {
            return this._proxy;
        }
        /**
         * @language zh_CN
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         */
        public get display(): any {
            return this._display;
        }
        /**
         * @language zh_CN
         * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         */
        public get parent(): Slot {
            return this._parent;
        }

        public get flipX(): boolean {
            return this._flipX;
        }
        public set flipX(value: boolean) {
            if (this._flipX === value) {
                return;
            }

            this._flipX = value;
        }

        public get flipY(): boolean {
            return this._flipY;
        }
        public set flipY(value: boolean) {
            if (this._flipY === value) {
                return;
            }

            this._flipY = value;
        }
        /**
         * @language zh_CN
         * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         */
        public get cacheFrameRate(): number {
            return this._armatureData.cacheFrameRate;
        }
        public set cacheFrameRate(value: number) {
            if (this._armatureData.cacheFrameRate !== value) {
                this._armatureData.cacheFrames(value);

                // Set child armature frameRate.
                for (let i = 0, l = this._slots.length; i < l; ++i) {
                    const childArmature = this._slots[i].childArmature;
                    if (childArmature) {
                        childArmature.cacheFrameRate = value;
                    }
                }
            }
        }
        /**
         * @inheritDoc
         */
        public get clock(): WorldClock {
            return this._clock;
        }
        public set clock(value: WorldClock) {
            if (this._clock === value) {
                return;
            }

            const prevClock = this._clock;
            if (prevClock) {
                prevClock.remove(this);
            }

            this._clock = value;
            if (this._clock) {
                this._clock.add(this);
            }

            // Update childArmature clock.
            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const childArmature = this._slots[i].childArmature;
                if (childArmature) {
                    childArmature.clock = this._clock;
                }
            }
        }
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @version DragonBones 4.5
         */
        public get replacedTexture(): any {
            return this._replacedTexture;
        }
        public set replacedTexture(value: any) {
            if (this._replacedTexture === value) {
                return;
            }

            if (this._replaceTextureAtlasData) {
                this._replaceTextureAtlasData.returnToPool();
                this._replaceTextureAtlasData = null;
            }

            this._replacedTexture = value;

            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                slot.invalidUpdate();
                slot._update(-1);
            }
        }

        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        public hasEventListener(type: EventStringType): boolean {
            return this._proxy.hasEvent(type);
        }
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        public addEventListener(type: EventStringType, listener: Function, target: any): void {
            this._proxy.addEvent(type, listener, target);
        }
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        public removeEventListener(type: EventStringType, listener: Function, target: any): void {
            this._proxy.removeEvent(type, listener, target);
        }
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        public enableAnimationCache(frameRate: number): void {
            this.cacheFrameRate = frameRate;
        }
        /**
         * @deprecated
         * @see #display
         */
        public getDisplay(): any {
            return this._display;
        }
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        public enableCache: boolean = false;
    }
}