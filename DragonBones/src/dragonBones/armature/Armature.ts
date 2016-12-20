namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @see dragonBones.IArmatureDisplay
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
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         */
        public userData: any;
        /**
         * @private
         */
        public _cacheFrameIndex: number;
        /**
         * @private
         */
        public _armatureData: ArmatureData;
        /**
         * @private
         */
        public _skinData: SkinData;
        /**
         * @private
         */
        public _animation: Animation;
        /**
         * @private
         */
        public _display: IArmatureDisplay;
        /**
         * @internal
         * @private
         */
        public _parent: Slot;
        /**
         * @private
         */
        public _eventManager: IEventDispatcher;

        private _delayDispose: boolean;
        private _lockDispose: boolean;
        private _debugDraw: boolean;
        /**
         * @internal
         * @private
         */
        public _bonesDirty: boolean;
        private _slotsDirty: boolean;
        private _replacedTexture: any;
        private _bones: Array<Bone> = [];
        private _slots: Array<Slot> = [];
        private _actions: Array<ActionData> = [];
        private _events: Array<EventObject> = [];
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
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

            if (this._animation) {
                this._animation.returnToPool();
            }

            if (this._display) {
                this._display._onClear();
            }

            this.userData = null;

            this._cacheFrameIndex = -1;
            this._armatureData = null;
            this._skinData = null;
            this._animation = null;
            this._display = null;
            this._parent = null;
            this._eventManager = null;

            this._delayDispose = false;
            this._lockDispose = false;
            this._debugDraw = false;
            this._bonesDirty = false;
            this._slotsDirty = false;
            this._replacedTexture = null;
            this._bones.length = 0;
            this._slots.length = 0;
            this._actions.length = 0;
            this._events.length = 0;
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

                if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex == bone.ikChain) {
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
                    this._animation.play(value.data[0], value.data[1]);
                    break;

                case ActionType.Stop:
                    this._animation.stop(value.data[0]);
                    break;

                case ActionType.GotoAndPlay:
                    this._animation.gotoAndPlayByTime(value.data[0], value.data[1], value.data[2]);
                    break;

                case ActionType.GotoAndStop:
                    this._animation.gotoAndStopByTime(value.data[0], value.data[1]);
                    break;

                case ActionType.FadeIn:
                    this._animation.fadeIn(value.data[0], value.data[1], value.data[2]);
                    break;

                case ActionType.FadeOut:
                    // TODO fade out
                    break;

                default:
                    break;
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
            }
        }
        /**
         * @internal
         * @private
         */
        public _removeBoneFromBoneList(value: Bone): void {
            let index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
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
            }
        }
        /**
         * @internal
         * @private
         */
        public _removeSlotFromSlotList(value: Slot): void {
            let index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
            }
        }
        /**
         * @private
         */
        public _sortZOrder(slotIndices: Array<number>): void {
            const sortedSlots = this._armatureData.sortedSlots;
            const isOriginal = slotIndices.length < 1;

            for (let i = 0, l = sortedSlots.length; i < l; ++i) {
                const slotIndex = isOriginal ? i : slotIndices[i];
                const slotData = sortedSlots[slotIndex];
                const slot = this.getSlot(slotData.name);

                if (slot) {
                    slot._setZorder(i);
                }
            }

            this._slotsDirty = true;
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
         * 释放骨架。 (会回收到内存池)
         * @version DragonBones 3.0
         */
        public dispose(): void {
            this._delayDispose = true;

            if (!this._lockDispose && this._animation) { //
                this.returnToPool();
            }
        }
        /**
         * @language zh_CN
         * 更新骨架和动画。 (可以使用时钟实例或显示容器来更新)
         * @param passedTime 两帧之前的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @see dragonBones.IArmatureDisplay
         * @version DragonBones 3.0
         */
        public advanceTime(passedTime: number): void {
            const self = this;

            if (!self._animation) {
                throw new Error("The armature has been disposed.");
            }

            const scaledPassedTime = passedTime * self._animation.timeScale;

            // Animations.
            self._animation._advanceTime(scaledPassedTime);

            // Bones and slots.
            if (self._bonesDirty) {
                self._bonesDirty = false;
                self._sortBones();
            }

            if (self._slotsDirty) {
                self._slotsDirty = false;
                self._sortSlots();
            }

            for (let i = 0, l = self._bones.length; i < l; ++i) {
                self._bones[i]._update(self._cacheFrameIndex);
            }

            for (let i = 0, l = self._slots.length; i < l; ++i) {
                const slot = self._slots[i];

                slot._update(self._cacheFrameIndex);

                const childArmature = slot._childArmature;
                if (childArmature) {
                    if (slot.inheritAnimation) { // Animation's time scale will impact to childArmature.
                        childArmature.advanceTime(scaledPassedTime);
                    }
                    else {
                        childArmature.advanceTime(passedTime);
                    }
                }
            }

            //
            if (DragonBones.debugDraw || self._debugDraw) {
                self._debugDraw = DragonBones.debugDraw;
                self._display._debugDraw(self._debugDraw);
            }

            if (!self._lockDispose) {
                self._lockDispose = true;

                // Actions and events.
                if (self._events.length > 0) { // Dispatch event before action.
                    for (let i = 0, l = self._events.length; i < l; ++i) {
                        const event = self._events[i];
                        if (event.type == EventObject.SOUND_EVENT) {
                            this._eventManager._dispatchEvent(event);
                        }
                        else {
                            self._display._dispatchEvent(event);
                        }

                        event.returnToPool();
                    }

                    self._events.length = 0;
                }

                if (self._actions.length > 0) {
                    for (let i = 0, l = self._actions.length; i < l; ++i) {
                        const action = self._actions[i];
                        if (action.slot) {
                            const slot = self.getSlot(action.slot.name);
                            if (slot) {
                                const childArmature = slot._childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else if (action.bone) {
                            for (let i = 0, l = self._slots.length; i < l; ++i) {
                                const childArmature = self._slots[i]._childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else {
                            this._doAction(action);
                        }
                    }

                    self._actions.length = 0;
                }

                self._lockDispose = false;
            }

            if (self._delayDispose) {
                self.returnToPool();
            }
        }
        /**
         * @language zh_CN
         * 判断指定的点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 4.5
         */
        public containsPoint(x: number, y: number, color: number = 0): Slot {
            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                if (slot.containsPoint(x, y, color)) {
                    return slot;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 判断指定的线段与骨架的所有插槽的自定义包围盒是否相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
         * @version DragonBones 4.5
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            color: number = 0,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): Slot {
            const isV = xA == xB;
            let dMin = 0;
            let dMax = 0;
            let intXA = 0;
            let intYA = 0;
            let intXB = 0;
            let intYB = 0;
            let intAN = 0;
            let intBN = 0;
            let intSlotA: Slot = null;
            let intSlotB: Slot = null;

            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                const intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, color, intersectionPointA, intersectionPointB, normalRadians);
                if (intersectionCount > 0) {
                    if (intersectionPointA || intersectionPointB) {
                        if (intersectionPointA) {
                            let d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                            if (d < 0) {
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
                            if (d < 0) {
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
         * 更新骨骼和插槽的变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
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
                            if (slot.parent == bone) {
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
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        public getBone(name: string): Bone {
            for (let i = 0, l = this._bones.length; i < l; ++i) {
                const bone = this._bones[i];
                if (bone.name == name) {
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
         * 获取指定名称的插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public getSlot(name: string): Slot {
            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];
                if (slot.name == name) {
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
                    if (slot.display == display) {
                        return slot;
                    }
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
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
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         */
        public get display(): IArmatureDisplay | any {
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
        /**
         * @language zh_CN
         * 动画缓存的帧率，当设置一个大于 0 的帧率时，将会开启动画缓存。
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
            if (this._armatureData.cacheFrameRate != value) {
                this._armatureData.cacheFrames(value);

                // Set child armature frameRate.
                for (let i = 0, l = this._slots.length; i < l; ++i) {
                    const slot = this._slots[i];
                    const childArmature = slot.childArmature;
                    if (childArmature && childArmature.cacheFrameRate == 0) {
                        childArmature.cacheFrameRate = value;
                    }
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
            this._display._onReplaceTexture(value);

            this._replacedTexture = value;

            for (let i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i].invalidUpdate();
            }
        }

        /**
         * @language zh_CN
         * 开启动画缓存。
         * @param frameRate 动画缓存的帧率
         * @see #cacheFrameRate
         * @version DragonBones 4.5
         */
        public enableAnimationCache(frameRate: number): void {
            this.cacheFrameRate = frameRate;
        }
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @returns  [true: 包含, false: 不包含]
         * @version DragonBones 3.0
         */
        public hasEventListener(type: EventStringType): boolean {
            return this._display.hasEvent(type);
        }
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        public addEventListener(type: EventStringType, listener: Function, target: any): void {
            this._display.addEvent(type, listener, target);
        }
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        public removeEventListener(type: EventStringType, listener: Function, target: any): void {
            this._display.removeEvent(type, listener, target);
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
                throw new Error();
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
                throw new Error();
            }
        }
        /**
         * @deprecated
         */
        public removeBone(value: Bone): void {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        }
        /**
         * @deprecated
         */
        public removeSlot(value: Slot): void {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
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