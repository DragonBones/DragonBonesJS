namespace dragonBones {
    /**
     *
     */
    export class Armature extends BaseObject implements IAnimateble {
		/**
		 * @private
		 */
        public static _soundEventManager: IEventDispatcher = null;

		/**
         *
		 */
        public userData: any;
		/**
		 * @private
		 */
        public _bonesDirty: boolean;
        /**
         * @private
         */
        public _cacheFrameIndex: number;
        /**
         * @private
         */
        public _delayAdvanceTime: number;
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
        public _display: IArmatureDisplayContainer;
        /**
         * @private
         */
        public _parent: Slot;
        /**
         * @private
         */
        public _action: ActionData;
        /**
         * @private
         */
        public _replaceTexture: any;
		/**
		 * @private
		 */
        private _delayDispose: boolean;
		/**
		 * @private
		 */
        private _lockDispose: boolean;
		/**
		 * @private
		 */
        private _lockActionAndEvent: boolean;
        /**
         * @private
         */
        private _slotsDirty: boolean;
        /**
         * @private Store bones based on bones' hierarchy (From root to leaf)
         */
        private _bones: Array<Bone> = [];
        /**
         * @private Store slots based on slots' zOrder (From low to high)
         */
        private _slots: Array<Slot> = [];
		/**
		 * @private
		 */
        private _events: Array<EventObject> = [];
		/**
		 * @private
		 */
        public constructor() {
            super();
        }
		/**
		 * @inheritDoc
		 */
        protected _onClear(): void {
            this.userData = null;

            this._bonesDirty = false;
            this._cacheFrameIndex = -1;
            this._delayAdvanceTime = -1;
            this._armatureData = null;
            this._skinData = null;

            if (this._animation) {
                this._animation.returnToPool();
                this._animation = null;
            }

            if (this._display) {
                this._display._onClear();
                this._display = null;
            }

            this._parent = null;
            this._action = null;
            this._replaceTexture = null;

            this._delayDispose = false;
            this._lockDispose = false;
            this._lockActionAndEvent = false;
            this._slotsDirty = false;

            if (this._bones.length) {
                for (let i in this._bones) {
                    this._bones[i].returnToPool();
                }

                this._bones.length = 0;
            }

            if (this._slots.length) {
                for (let i in this._slots) {
                    this._slots[i].returnToPool();
                }

                this._slots.length = 0;
            }

            if (this._events.length) {
                for (let i in this._events) {
                    this._events[i].returnToPool();
                }

                this._events.length = 0;
            }
        }
        /**
		 * @private
		 */
        private _sortBones(): void {
            const total = this._bones.length;
            if (!total) {
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
                } else {
                    this._bones.push(bone);
                }

                count++;
            }
        }
		/**
		 * @private
		 */
        private _sortSlots(): void {
        }
		/**
		 * @private
		 */
        public _addBoneToBoneList(value: Bone): void {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones[this._bones.length] = value;
                this._animation._timelineStateDirty = true;
            }
        }
		/**
		 * @private
		 */
        public _removeBoneFromBoneList(value: Bone): void {
            let index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        }
		/**
		 * @private
		 */
        public _addSlotToSlotList(value: Slot): void {
            if (this._slots.indexOf(value) < 0) {
                this._slotsDirty = true;
                this._slots[this._slots.length] = value;
                this._animation._timelineStateDirty = true;
            }
        }
		/**
		 * @private
		 */
        public _removeSlotFromSlotList(value: Slot): void {
            let index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        }
		/**
		 * @private
		 */
        public _bufferEvent(value: EventObject, type: string): void {
            value.type = type;
            value.armature = this;
            this._events.push(value);
        }
		/**
		 * dispose
		 */
        public dispose(): void {
            this._delayDispose = true;

            if (!this._lockDispose) {
                this.returnToPool();
            }
        }
		/**
		 *
		 */
        public advanceTime(passedTime: number): void {
            this._lockDispose = true;

            const scaledPassedTime = passedTime * this._animation.timeScale;

            //
            this._animation._advanceTime(scaledPassedTime);

            //
            if (this._bonesDirty) {
                this._bonesDirty = false;
                this._sortBones();
            }

            if (this._slotsDirty) {
                this._slotsDirty = false;
                this._sortSlots();
            }

            for (let i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i]._update(this._cacheFrameIndex);
            }

            for (let i = 0, l = this._slots.length; i < l; ++i) {
                const slot = this._slots[i];

                slot._update(this._cacheFrameIndex);

                const childArmature = slot.childArmature;
                if (childArmature) {
                    if (slot.inheritAnimation) { // Animation's time scale will impact to childArmature
                        childArmature.advanceTime(scaledPassedTime);
                    } else {
                        childArmature.advanceTime(passedTime);
                    }
                }
            }

            //
            if (!this._lockActionAndEvent) {
                this._lockActionAndEvent = true;

                if (this._events.length > 0) {
                    for (let i = 0, l = this._events.length; i < l; ++i) {
                        const event = this._events[i];
                        if (Armature._soundEventManager && event.type == EventObject.SOUND_EVENT) {
                            Armature._soundEventManager._dispatchEvent(event);
                        } else {
                            this._display._dispatchEvent(event);
                        }

                        event.returnToPool();
                    }

                    this._events.length = 0;
                }

                if (this._action) {
                    switch (this._action.type) {
                        case ActionType.Play:
                            this._animation.play(this._action.data[0], this._action.data[1]);
                            break;

                        case ActionType.Stop:
                            this._animation.stop(this._action.data[0]);
                            break;

                        case ActionType.GotoAndPlay:
                            this._animation.gotoAndPlayByTime(this._action.data[0], this._action.data[1], this._action.data[2]);
                            break;

                        case ActionType.GotoAndStop:
                            this._animation.gotoAndStopByTime(this._action.data[0], this._action.data[1]);
                            break;

                        case ActionType.FadeIn:
                            this._animation.fadeIn(this._action.data[0], this._action.data[1], this._action.data[2]);
                            break;

                        case ActionType.FadeOut:
                            // TODO fade out
                            break;
                    }

                    this._action = null;
                }

                this._lockActionAndEvent = false;
            }

            this._lockDispose = false;

            if (this._delayDispose) {
                this.returnToPool();
            } else if (this._delayAdvanceTime >= 0) {
                const delayAdvanceTime = this._delayAdvanceTime;
                this._delayAdvanceTime = -1;
                this.advanceTime(delayAdvanceTime);
            }
        }
		/**
		 * Force update bones and slots. (When bone's animation play complete, it will not update.) 
		 */
        public invalidUpdate(boneName: string = null, updateSlotDisplay: boolean = false): void {
            if (boneName) {
                const bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();

                    if (updateSlotDisplay) {
                        for (let i in this._slots) {
                            const slot = this._slots[i];
                            if (slot.parent == bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            } else {
                for (let i in this._bones) {
                    this._bones[i].invalidUpdate();
                }

                if (updateSlotDisplay) {
                    for (let i in this._slots) {
                        this._slots[i].invalidUpdate();
                    }
                }
            }
        }
		/**
		 * Retrieves a Slot by name
		 * @param The name of the Bone to retrieve.
		 * @return A Slot instance or null if no Slot with that name exist.
		 * @see dragonBones.Slot
		 */
        public getSlot(name: string): Slot {
            for (let i in this._slots) {
                const slot = this._slots[i];
                if (slot.name == name) {
                    return slot;
                }
            }

            return null;
        }
		/**
		 * Gets the Slot associated with this DisplayObject.
		 * @param Instance type of this object varies from flash.display.DisplayObject to startling.display.DisplayObject and subclasses.
		 * @return A Slot instance or null if no Slot with that DisplayObject exist.
		 * @see dragonBones.Slot
		 */
        public getSlotByDisplay(display: any): Slot {
            if (display) {
                for (let i in this._slots) {
                    const slot = this._slots[i];
                    if (slot.display == display) {
                        return slot;
                    }
                }
            }

            return null;
        }
		/**
		 * Add a slot to a bone as child.
		 * @param slot A Slot instance
		 * @param boneName bone name
		 * @see dragonBones.core.DBObject
		 */
        public addSlot(value: Slot, boneName: string): void {
            const bone = this.getBone(boneName);
            if (bone) {
                value._setArmature(this);
                value._setParent(bone);
            } else {
                throw new Error();
            }
        }
		/**
		 * Remove a Slot instance from this Armature instance.
		 * @param The Slot instance to remove.
		 * @see dragonBones.Slot
		 */
        public removeSlot(value: Slot): void {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            } else {
                throw new Error();
            }
        }
		/**
		 * Retrieves a Bone by name
		 * @param The name of the Bone to retrieve.
		 * @return A Bone instance or null if no Bone with that name exist.
		 * @see dragonBones.Bone
		 */
        public getBone(name: string): Bone {
            for (let i in this._bones) {
                const bone = this._bones[i];
                if (bone.name == name) {
                    return bone;
                }
            }

            return null;
        }
		/**
		 * Gets the Bone associated with this DisplayObject.
		 * @param Instance type of this object varies from flash.display.DisplayObject to startling.display.DisplayObject and subclasses.
		 * @return A Bone instance or null if no Bone with that DisplayObject exist..
		 * @see dragonBones.Bone
		 */
        public getBoneByDisplay(display: any): Bone {
            const slot = this.getSlotByDisplay(display);

            return slot ? slot.parent : null;
        }
		/**
		 * @language zh_CN
		 * 将一个指定的骨骼添加到骨架中。
		 * @param bone 需要添加的骨骼。
		 * @param parentName 需要添加到指定的父骨骼的名称，如果未指定名称则添加到骨架根部。 (默认: <code>null</code>)
		 * @see	dragonBones.Bone
		 * @version DragonBones 3.0
		 */
        public addBone(value: Bone, parentName: string = null): void {
            if (value) {
                value._setArmature(this);
                value._setParent(parentName ? this.getBone(parentName) : null);
            } else {
                throw new Error();
            }
        }
		/**
		 * @language zh_CN
		 * 将一个指定的骨骼从骨架中移除。
		 * @param bone 需要移除的骨骼
		 * @see	dragonBones.Bone
		 * @version DragonBones 3.0
		 */
        public removeBone(value: Bone): void {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            } else {
                throw new Error();
            }
        }
		/**
		 * @language zh_CN
		 * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
		 * @see dragonBones.Bone
		 * @version DragonBones 4.5
		 */
        public setReplaceTexture(texture: any): void {
            this._replaceTexture = texture;

            for (let i in this._slots) {
                this._slots[i].invalidUpdate();
            }
        }
		/**
		 * @language zh_CN
		 * 获得该骨架所有骨骼的列表，注意这里返回的是直接引用。
		 * @see dragonBones.Bone
		 * @version DragonBones 3.0
		 */
        public getBones(): Array<Bone> {
            return this._bones;
        }
		/**
		 * @language zh_CN
		 * 获得此骨架所有插槽的列表，注意这里返回的是直接引用。
		 * @see dragonBones.Slot
		 * @version DragonBones 3.0
		 */
        public getSlots(): Array<Slot> {
            return this._slots;
        }
		/**
		 * @language zh_CN
		 * 骨架名称。
		 * @see dragonBones.objects.ArmatureData#name
		 * @version DragonBones 3.0
		 */
        public get name(): string {
            return this._armatureData ? this._armatureData.name : null;
        }
		/**
		 * @language zh_CN
		 * 获得骨架数据。
    	 * @see dragonBones.objects.ArmatureData
		 * @version DragonBones 4.5
		 */
        public get armatureData(): ArmatureData {
            return this._armatureData;
        }
		/**
		 * @language zh_CN
		 * 获得显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
		 * @version DragonBones 3.0
		 */
        public get display(): any {
            return this._display;
        }
		/**
		 * @language zh_CN
		 * 获得父插槽实例。
    	 * @see dragonBones.Slot
		 * @version DragonBones 4.5
		 */
        public get parent(): Slot {
            return this._parent;
        }
		/**
		 * @language zh_CN
		 * 获得动画控制器实例。
    	 * @see dragonBones.animation.Animation
		 * @version DragonBones 3.0
		 */
        public get animation(): Animation {
            return this._animation;
        }
		/**
		 * @language zh_CN
		 * 动画缓存的帧率，当设置一个大于 0 的帧率时，将会开启动画缓存机制。
		 * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
		 * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序的帧率。
		 * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
		 * @see dragonBones.objects.DragonBonesData#frameRate
		 * @see dragonBones.objects.ArmatureData#frameRate
		 * @version DragonBones 4.0
		 */
        public get cacheFrameRate(): number {
            return this._armatureData.cacheFrameRate;
        }
        public set cacheFrameRate(value: number) {
            if (this._armatureData.cacheFrameRate != value) {
                this._armatureData.cacheFrames(value);
            }
        }
		/**
		 * @language zh_CN
		 * 添加事件。
		 * @param type 事件类型。
		 * @version DragonBones 3.0
		 */
        public hasEventListener(type: string): void {
            this._display.hasEvent(type);
        }
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件监听。
         * @version DragonBones 3.0
         */
        public addEventListener(type: string, listener: Function, target: any): void {
            this._display.addEvent(type, listener, target);
        }
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件监听。
         * @version DragonBones 3.0
         */
        public removeEventListener(type: string, listener: Function, target: any): void {
            this._display.removeEvent(type, listener, target);
        }
		/**
		 * @language zh_CN
		 * 开启动画缓存的帧率。
         * @param frameRate 动画缓存的帧率
		 * @see #dragonBones.Armature.cacheFrameRate
		 * @version DragonBones 4.0
		 */
        public enableAnimationCache(frameRate: number): void {
            this.cacheFrameRate = frameRate;
        }

        /**
         * 不推荐使用
         * @see #dragonBones.Armature.cacheFrameRate
         */
        public enableCache: boolean = false;
    }
}