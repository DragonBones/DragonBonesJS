namespace dragonBones {
    /**
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class Armature extends BaseObject implements IAnimatable {
        public static toString(): string {
            return "[class dragonBones.Armature]";
        }
        private static _onSortSlots(a: Slot, b: Slot): number {
            return a._zOrder > b._zOrder ? 1 : -1;
        }
        /**
         * 是否继承父骨架的动画状态。
         * @default true
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public inheritAnimation: boolean;
        /**
         * @private
         */
        public debugDraw: boolean;
        /**
         * 获取骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @readonly
         * @language zh_CN
         */
        public armatureData: ArmatureData;
        /**
         * 用于存储临时数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public userData: any;

        private _debugDraw: boolean;
        private _lockUpdate: boolean;
        private _bonesDirty: boolean;
        private _slotsDirty: boolean;
        private _zOrderDirty: boolean;
        private _flipX: boolean;
        private _flipY: boolean;
        /**
         * @internal
         * @private
         */
        public _cacheFrameIndex: number;
        private readonly _bones: Array<Bone> = [];
        private readonly _slots: Array<Slot> = [];
        private readonly _actions: Array<ActionData> = [];
        private _animation: Animation = null as any; // Initial value.
        private _proxy: IArmatureProxy = null as any; // Initial value.
        private _display: any;
        /**
         * @private
         */
        public _replaceTextureAtlasData: TextureAtlasData | null = null; // Initial value.
        private _replacedTexture: any;
        /**
         * @internal
         * @private
         */
        public _dragonBones: DragonBones;
        private _clock: WorldClock | null = null; // Initial value.
        /**
         * @internal
         * @private
         */
        public _parent: Slot | null;
        /**
         * @private
         */
        protected _onClear(): void {
            if (this._clock !== null) { // Remove clock first.
                this._clock.remove(this);
            }

            for (const bone of this._bones) {
                bone.returnToPool();
            }

            for (const slot of this._slots) {
                slot.returnToPool();
            }

            for (const action of this._actions) {
                action.returnToPool();
            }

            if (this._animation !== null) {
                this._animation.returnToPool();
            }

            if (this._proxy !== null) {
                this._proxy.clear();
            }

            if (this._replaceTextureAtlasData !== null) {
                this._replaceTextureAtlasData.returnToPool();
            }

            this.inheritAnimation = true;
            this.debugDraw = false;
            this.armatureData = null as any; //
            this.userData = null;

            this._debugDraw = false;
            this._lockUpdate = false;
            this._bonesDirty = false;
            this._slotsDirty = false;
            this._zOrderDirty = false;
            this._flipX = false;
            this._flipY = false;
            this._cacheFrameIndex = -1;
            this._bones.length = 0;
            this._slots.length = 0;
            this._actions.length = 0;
            this._animation = null as any; //
            this._proxy = null as any; //
            this._display = null;
            this._replaceTextureAtlasData = null;
            this._replacedTexture = null;
            this._dragonBones = null as any; //
            this._clock = null;
            this._parent = null;
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

                if (bone.constraints.length > 0) { // Wait constraint.
                    let flag = false;
                    for (const constraint of bone.constraints) {
                        if (this._bones.indexOf(constraint.target) < 0) {
                            flag = true;
                            break;
                        }
                    }

                    if (flag) {
                        continue;
                    }
                }

                if (bone.parent !== null && this._bones.indexOf(bone.parent) < 0) { // Wait parent.
                    continue;
                }

                this._bones.push(bone);
                count++;
            }
        }

        private _sortSlots(): void {
            this._slots.sort(Armature._onSortSlots);
        }
        /**
         * @internal
         * @private
         */
        public _sortZOrder(slotIndices: Array<number> | Int16Array | null, offset: number): void {
            const slotDatas = this.armatureData.sortedSlots;
            const isOriginal = slotIndices === null;

            if (this._zOrderDirty || !isOriginal) {
                for (let i = 0, l = slotDatas.length; i < l; ++i) {
                    const slotIndex = isOriginal ? i : (slotIndices as Array<number>)[offset + i];
                    if (slotIndex < 0 || slotIndex >= l) {
                        continue;
                    }

                    const slotData = slotDatas[slotIndex];
                    const slot = this.getSlot(slotData.name);
                    if (slot !== null) {
                        slot._setZorder(i);
                    }
                }

                this._slotsDirty = true;
                this._zOrderDirty = !isOriginal;
            }
        }
        /**
         * @internal
         * @private
         */
        public _addBoneToBoneList(value: Bone): void {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones.push(value);
                this._animation._timelineDirty = true;
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
                this._animation._timelineDirty = true;
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
                this._animation._timelineDirty = true;
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
                this._animation._timelineDirty = true;
            }
        }
        /**
         * @internal
         * @private
         */
        public _bufferAction(action: ActionData, append: boolean): void {
            if (this._actions.indexOf(action) < 0) {
                if (append) {
                    this._actions.push(action);
                }
                else {
                    this._actions.unshift(action);
                }
            }
        }
        /**
         * 释放骨架。 (回收到对象池)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public dispose(): void {
            if (this.armatureData !== null) {
                this._lockUpdate = true;
                this._dragonBones.bufferObject(this);
            }
        }
        /**
         * @private
         */
        public init(
            armatureData: ArmatureData,
            proxy: IArmatureProxy, display: any, dragonBones: DragonBones
        ): void {
            if (this.armatureData !== null) {
                return;
            }

            this.armatureData = armatureData;
            this._animation = BaseObject.borrowObject(Animation);
            this._proxy = proxy;
            this._display = display;
            this._dragonBones = dragonBones;

            this._proxy.init(this);
            this._animation.init(this);
            this._animation.animations = this.armatureData.animations;
        }
        /**
         * 更新骨架和动画。
         * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public advanceTime(passedTime: number): void {
            if (this._lockUpdate) {
                return;
            }

            if (this.armatureData === null) {
                console.assert(false, "The armature has been disposed.");
                return;
            }
            else if (this.armatureData.parent === null) {
                console.assert(false, "The armature data has been disposed.");
                return;
            }

            const prevCacheFrameIndex = this._cacheFrameIndex;

            // Update nimation.
            this._animation.advanceTime(passedTime);

            // Sort bones and slots.
            if (this._bonesDirty) {
                this._bonesDirty = false;
                this._sortBones();
            }

            if (this._slotsDirty) {
                this._slotsDirty = false;
                this._sortSlots();
            }

            // Update bones and slots.
            if (this._cacheFrameIndex < 0 || this._cacheFrameIndex !== prevCacheFrameIndex) {
                let i = 0, l = 0;
                for (i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].update(this._cacheFrameIndex);
                }

                for (i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].update(this._cacheFrameIndex);
                }
            }

            if (this._actions.length > 0) {
                this._lockUpdate = true;
                for (const action of this._actions) {
                    if (action.type === ActionType.Play) {
                        this._animation.fadeIn(action.name);
                    }
                }

                this._actions.length = 0;
                this._lockUpdate = false;
            }

            //
            const drawed = this.debugDraw || DragonBones.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                this._proxy.debugUpdate(this._debugDraw);
            }
        }
        /**
         * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public invalidUpdate(boneName: string | null = null, updateSlotDisplay: boolean = false): void {
            if (boneName !== null && boneName.length > 0) {
                const bone = this.getBone(boneName);
                if (bone !== null) {
                    bone.invalidUpdate();

                    if (updateSlotDisplay) {
                        for (const slot of this._slots) {
                            if (slot.parent === bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (const bone of this._bones) {
                    bone.invalidUpdate();
                }

                if (updateSlotDisplay) {
                    for (const slot of this._slots) {
                        slot.invalidUpdate();
                    }
                }
            }
        }
        /**
         * 判断点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public containsPoint(x: number, y: number): Slot | null {
            for (const slot of this._slots) {
                if (slot.containsPoint(x, y)) {
                    return slot;
                }
            }

            return null;
        }
        /**
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
         * @language zh_CN
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): Slot | null {
            const isV = xA === xB;
            let dMin = 0.0;
            let dMax = 0.0;
            let intXA = 0.0;
            let intYA = 0.0;
            let intXB = 0.0;
            let intYB = 0.0;
            let intAN = 0.0;
            let intBN = 0.0;
            let intSlotA: Slot | null = null;
            let intSlotB: Slot | null = null;

            for (const slot of this._slots) {
                const intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
                if (intersectionCount > 0) {
                    if (intersectionPointA !== null || intersectionPointB !== null) {
                        if (intersectionPointA !== null) {
                            let d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }

                            if (intSlotA === null || d < dMin) {
                                dMin = d;
                                intXA = intersectionPointA.x;
                                intYA = intersectionPointA.y;
                                intSlotA = slot;

                                if (normalRadians) {
                                    intAN = normalRadians.x;
                                }
                            }
                        }

                        if (intersectionPointB !== null) {
                            let d = intersectionPointB.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }

                            if (intSlotB === null || d > dMax) {
                                dMax = d;
                                intXB = intersectionPointB.x;
                                intYB = intersectionPointB.y;
                                intSlotB = slot;

                                if (normalRadians !== null) {
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

            if (intSlotA !== null && intersectionPointA !== null) {
                intersectionPointA.x = intXA;
                intersectionPointA.y = intYA;

                if (normalRadians !== null) {
                    normalRadians.x = intAN;
                }
            }

            if (intSlotB !== null && intersectionPointB !== null) {
                intersectionPointB.x = intXB;
                intersectionPointB.y = intYB;

                if (normalRadians !== null) {
                    normalRadians.y = intBN;
                }
            }

            return intSlotA;
        }
        /**
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getBone(name: string): Bone | null {
            for (const bone of this._bones) {
                if (bone.name === name) {
                    return bone;
                }
            }

            return null;
        }
        /**
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getBoneByDisplay(display: any): Bone | null {
            const slot = this.getSlotByDisplay(display);

            return slot !== null ? slot.parent : null;
        }
        /**
         * 获取插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getSlot(name: string): Slot | null {
            for (const slot of this._slots) {
                if (slot.name === name) {
                    return slot;
                }
            }

            return null;
        }
        /**
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getSlotByDisplay(display: any): Slot | null {
            if (display !== null) {
                for (const slot of this._slots) {
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
        public addBone(value: Bone, parentName: string | null = null): void {
            console.assert(value !== null);

            value._setArmature(this);
            value._setParent(parentName !== null ? this.getBone(parentName) : null);
        }
        /**
         * @deprecated
         */
        public removeBone(value: Bone): void {
            console.assert(value !== null && value.armature === this);

            value._setParent(null);
            value._setArmature(null);
        }
        /**
         * @deprecated
         */
        public addSlot(value: Slot, parentName: string): void {
            const bone = this.getBone(parentName);

            console.assert(value !== null && bone !== null);

            value._setArmature(this);
            value._setParent(bone);
        }
        /**
         * @deprecated
         */
        public removeSlot(value: Slot): void {
            console.assert(value !== null && value.armature === this);

            value._setParent(null);
            value._setArmature(null);
        }
        /**
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getBones(): Array<Bone> {
            return this._bones;
        }
        /**
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getSlots(): Array<Slot> {
            return this._slots;
        }

        public get flipX(): boolean {
            return this._flipX;
        }
        public set flipX(value: boolean) {
            if (this._flipX === value) {
                return;
            }

            this._flipX = value;
            this.invalidUpdate();
        }

        public get flipY(): boolean {
            return this._flipY;
        }
        public set flipY(value: boolean) {
            if (this._flipY === value) {
                return;
            }

            this._flipY = value;
            this.invalidUpdate();
        }
        /**
         * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get cacheFrameRate(): number {
            return this.armatureData.cacheFrameRate;
        }
        public set cacheFrameRate(value: number) {
            if (this.armatureData.cacheFrameRate !== value) {
                this.armatureData.cacheFrames(value);

                // Set child armature frameRate.
                for (const slot of this._slots) {
                    const childArmature = slot.childArmature;
                    if (childArmature !== null) {
                        childArmature.cacheFrameRate = value;
                    }
                }
            }
        }
        /**
         * 骨架名称。
         * @see dragonBones.ArmatureData#name
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get name(): string {
            return this.armatureData.name;
        }
        /**
         * 获得动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get animation(): Animation {
            return this._animation;
        }
        /**
         * @pivate
         */
        public get proxy(): IArmatureProxy {
            return this._proxy;
        }
        /**
         * @pivate
         */
        public get eventDispatcher(): IEventDispatcher {
            return this._proxy;
        }
        /**
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get display(): any {
            return this._display;
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

            if (this._replaceTextureAtlasData !== null) {
                this._replaceTextureAtlasData.returnToPool();
                this._replaceTextureAtlasData = null;
            }

            this._replacedTexture = value;

            for (const slot of this._slots) {
                slot.invalidUpdate();
                slot.update(-1);
            }
        }
        /**
         * @inheritDoc
         */
        public get clock(): WorldClock | null {
            return this._clock;
        }
        public set clock(value: WorldClock | null) {
            if (this._clock === value) {
                return;
            }

            if (this._clock !== null) {
                this._clock.remove(this);
            }

            this._clock = value;

            if (this._clock) {
                this._clock.add(this);
            }

            // Update childArmature clock.
            for (const slot of this._slots) {
                const childArmature = slot.childArmature;
                if (childArmature !== null) {
                    childArmature.clock = this._clock;
                }
            }
        }
        /**
         * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get parent(): Slot | null {
            return this._parent;
        }

        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#replacedTexture
         */
        public replaceTexture(texture: any): void {
            this.replacedTexture = texture;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#eventDispatcher
         */
        public hasEventListener(type: EventStringType): boolean {
            return this._proxy.hasEvent(type);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#eventDispatcher
         */
        public addEventListener(type: EventStringType, listener: Function, target: any): void {
            this._proxy.addEvent(type, listener, target);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#eventDispatcher
         */
        public removeEventListener(type: EventStringType, listener: Function, target: any): void {
            this._proxy.removeEvent(type, listener, target);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #cacheFrameRate
         */
        public enableAnimationCache(frameRate: number): void {
            this.cacheFrameRate = frameRate;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #display
         */
        public getDisplay(): any {
            return this._display;
        }
    }
}