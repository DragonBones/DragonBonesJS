namespace dragonBones {
    /**
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class Bone extends TransformObject {
        public static toString(): string {
            return "[class dragonBones.Bone]";
        }
        /**
         * @private
         */
        public offsetMode: OffsetMode;
        /**
         * @internal
         * @private
         */
        public readonly animationPose: Transform = new Transform();
        /**
         * @readonly
         */
        public boneData: BoneData;
        /**
         * @internal
         * @private
         */
        public _transformDirty: boolean;
        /**
         * @internal
         * @private
         */
        public _childrenTransformDirty: boolean;
        /**
         * @internal
         * @private
         */
        public _blendDirty: boolean;
        private _localDirty: boolean;
        /**
         * @internal
         * @private
         */
        public _hasConstraint: boolean;
        private _visible: boolean;
        private _cachedFrameIndex: number;
        /**
         * @internal
         * @private
         */
        public _blendLayer: number;
        /**
         * @internal
         * @private
         */
        public _blendLeftWeight: number;
        /**
         * @internal
         * @private
         */
        public _blendLayerWeight: number;
        private readonly _bones: Array<Bone> = [];
        private readonly _slots: Array<Slot> = [];
        /**
         * @internal
         * @private
         */
        public _cachedFrameIndices: Array<number> | null;
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            this.offsetMode = OffsetMode.Additive;
            this.animationPose.identity();
            this.boneData = null as any; //

            this._transformDirty = false;
            this._childrenTransformDirty = false;
            this._blendDirty = false;
            this._localDirty = true;
            this._hasConstraint = false;
            this._visible = true;
            this._cachedFrameIndex = -1;
            this._blendLayer = 0;
            this._blendLeftWeight = 1.0;
            this._blendLayerWeight = 0.0;
            this._bones.length = 0;
            this._slots.length = 0;
            this._cachedFrameIndices = null;
        }
        /**
         * @private
         */
        private _updateGlobalTransformMatrix(isCache: boolean): void {
            const flipX = this._armature.flipX;
            const flipY = this._armature.flipY === DragonBones.yDown;
            const global = this.global;
            const globalTransformMatrix = this.globalTransformMatrix;
            let inherit = this._parent !== null;
            let dR = 0.0;

            if (this.offsetMode === OffsetMode.Additive) {
                // global.copyFrom(this.origin).add(this.offset).add(this.animationPose);
                global.x = this.origin.x + this.offset.x + this.animationPose.x;
                global.y = this.origin.y + this.offset.y + this.animationPose.y;
                global.skew = this.origin.skew + this.offset.skew + this.animationPose.skew;
                global.rotation = this.origin.rotation + this.offset.rotation + this.animationPose.rotation;
                global.scaleX = this.origin.scaleX * this.offset.scaleX * this.animationPose.scaleX;
                global.scaleY = this.origin.scaleY * this.offset.scaleY * this.animationPose.scaleY;
            }
            else if (this.offsetMode === OffsetMode.None) {
                global.copyFrom(this.origin).add(this.animationPose);
            }
            else {
                inherit = false;
                global.copyFrom(this.offset);
            }

            if (inherit) {
                const parentMatrix = this._parent.globalTransformMatrix;

                if (this.boneData.inheritScale) {
                    if (!this.boneData.inheritRotation) {
                        this._parent.updateGlobalTransform();
                        dR = this._parent.global.rotation; //

                        if (DragonBones.yDown) {
                            global.rotation -= dR;
                        }
                        else {
                            global.rotation += dR;
                        }
                    }

                    global.toMatrix(globalTransformMatrix);
                    globalTransformMatrix.concat(parentMatrix);

                    if (this.boneData.inheritTranslation) {
                        global.x = globalTransformMatrix.tx;
                        global.y = globalTransformMatrix.ty;
                    }
                    else {
                        globalTransformMatrix.tx = global.x;
                        globalTransformMatrix.ty = global.y;
                    }

                    if (isCache) {
                        global.fromMatrix(globalTransformMatrix);
                    }
                    else {
                        this._globalDirty = true;
                    }
                }
                else {
                    if (this.boneData.inheritTranslation) {
                        const x = global.x;
                        const y = global.y;
                        global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }
                    else {
                        if (flipX) {
                            global.x = -global.x;
                        }

                        if (flipY) {
                            global.y = -global.y;
                        }
                    }

                    if (this.boneData.inheritRotation) {
                        this._parent.updateGlobalTransform();
                        dR = this._parent.global.rotation;

                        if (this._parent.global.scaleX < 0.0) {
                            dR += Math.PI;
                        }

                        if (parentMatrix.a * parentMatrix.d - parentMatrix.b * parentMatrix.c < 0.0) {
                            dR -= global.rotation * 2.0;

                            if (flipX !== flipY || this.boneData.inheritReflection) {
                                global.skew += Math.PI;
                            }
                        }

                        global.rotation += dR;
                    }
                    else if (flipX || flipY) {
                        if (flipX && flipY) {
                            dR = Math.PI;
                        }
                        else {
                            dR = -global.rotation * 2.0;
                            if (flipX) {
                                dR += Math.PI;
                            }

                            global.skew += Math.PI;
                        }

                        global.rotation += dR;
                    }

                    global.toMatrix(globalTransformMatrix);
                }
            }
            else {
                if (flipX || flipY) {
                    if (flipX) {
                        global.x = -global.x;
                    }

                    if (flipY) {
                        global.y = -global.y;
                    }

                    if (flipX && flipY) {
                        dR = Math.PI;
                    }
                    else {
                        dR = -global.rotation * 2.0;
                        if (flipX) {
                            dR += Math.PI;
                        }

                        global.skew += Math.PI;
                    }

                    global.rotation += dR;
                }

                global.toMatrix(globalTransformMatrix);
            }
        }
        /**
         * @internal
         * @private
         */
        public _setArmature(value: Armature | null): void {
            if (this._armature === value) {
                return;
            }

            let oldSlots: Array<Slot> | null = null;
            let oldBones: Array<Bone> | null = null;

            if (this._armature !== null) {
                oldSlots = this.getSlots();
                oldBones = this.getBones();
                this._armature._removeBoneFromBoneList(this);
            }

            this._armature = value as any; //

            if (this._armature !== null) {
                this._armature._addBoneToBoneList(this);
            }

            if (oldSlots !== null) {
                for (const slot of oldSlots) {
                    if (slot.parent === this) {
                        slot._setArmature(this._armature);
                    }
                }
            }

            if (oldBones !== null) {
                for (const bone of oldBones) {
                    if (bone.parent === this) {
                        bone._setArmature(this._armature);
                    }
                }
            }
        }
        /**
         * @internal
         * @private
         */
        public init(boneData: BoneData): void {
            if (this.boneData !== null) {
                return;
            }

            this.boneData = boneData;
            this.name = this.boneData.name;
            this.origin = this.boneData.transform;
        }
        /**
         * @internal
         * @private
         */
        public update(cacheFrameIndex: number): void {
            this._blendDirty = false;

            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else {
                    if (this._hasConstraint) { // Update constraints.
                        for (const constraint of this._armature._constraints) {
                            if (constraint._bone === this) {
                                constraint.update();
                            }
                        }
                    }

                    if (
                        this._transformDirty ||
                        (this._parent !== null && this._parent._childrenTransformDirty)
                    ) { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                    else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                        this._transformDirty = false;
                        this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                    }
                    else { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                }
            }
            else {
                if (this._hasConstraint) { // Update constraints.
                    for (const constraint of this._armature._constraints) {
                        if (constraint._bone === this) {
                            constraint.update();
                        }
                    }
                }

                if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                    cacheFrameIndex = -1;
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }

            if (this._transformDirty) {
                this._transformDirty = false;
                this._childrenTransformDirty = true;

                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    if (this._localDirty) {
                        this._updateGlobalTransformMatrix(isCache);
                    }

                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature.armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature.armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }
            }
            else if (this._childrenTransformDirty) {
                this._childrenTransformDirty = false;
            }

            this._localDirty = true;
        }
        /**
         * @internal
         * @private
         */
        public updateByConstraint(): void {
            if (this._localDirty) {
                this._localDirty = false;
                if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) {
                    this._updateGlobalTransformMatrix(true);
                }

                this._transformDirty = true;
            }
        }
        /**
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public invalidUpdate(): void {
            this._transformDirty = true;
        }
        /**
         * 是否包含骨骼或插槽。
         * @returns
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public contains(child: TransformObject): boolean {
            if (child === this) {
                return false;
            }

            let ancestor: TransformObject | null = child;
            while (ancestor !== this && ancestor !== null) {
                ancestor = ancestor.parent;
            }

            return ancestor === this;
        }
        /**
         * 所有的子骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getBones(): Array<Bone> {
            this._bones.length = 0;

            for (const bone of this._armature.getBones()) {
                if (bone.parent === this) {
                    this._bones.push(bone);
                }
            }

            return this._bones;
        }
        /**
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getSlots(): Array<Slot> {
            this._slots.length = 0;

            for (const slot of this._armature.getSlots()) {
                if (slot.parent === this) {
                    this._slots.push(slot);
                }
            }

            return this._slots;
        }
        /**
         * 控制此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get visible(): boolean {
            return this._visible;
        }
        public set visible(value: boolean) {
            if (this._visible === value) {
                return;
            }

            this._visible = value;

            for (const slot of this._armature.getSlots()) {
                if (slot._parent === this) {
                    slot._updateVisible();
                }
            }
        }

        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #boneData
         * @see #dragonBones.BoneData#length
         */
        public get length(): number {
            return this.boneData.length;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#getSlot()
         */
        public get slot(): Slot | null {
            for (const slot of this._armature.getSlots()) {
                if (slot.parent === this) {
                    return slot;
                }
            }

            return null;
        }
    }
}