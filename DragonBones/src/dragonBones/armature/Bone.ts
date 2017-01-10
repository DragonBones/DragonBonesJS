namespace dragonBones {
    /**
     * @internal
     * @private
     */
    export const enum BoneTransformDirty {
        None = 0,
        Self = 1,
        All = 2
    }
    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    export class Bone extends TransformObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.Bone]";
        }
        /**
         * @language zh_CN
         * 是否继承父骨骼的平移。
         * @version DragonBones 3.0
         */
        public inheritTranslation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的旋转。
         * @version DragonBones 3.0
         */
        public inheritRotation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的缩放。
         * @version DragonBones 4.5
         */
        public inheritScale: boolean;
        /**
         * @private
         */
        public ikBendPositive: boolean;
        /**
         * @language zh_CN
         * 骨骼长度。
         * @version DragonBones 4.5
         */
        public length: number;
        /**
         * @private
         */
        public ikWeight: number;
        /**
         * @internal
         * @private
         */
        public _transformDirty: BoneTransformDirty;
        private _visible: boolean;
        private _cachedFrameIndex: number;
        private _ikChain: number;
        private _ikChainIndex: number;
        /**
         * @internal
         * @private
         */
        public _updateState: number;
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
        public _blendTotalWeight: number;
        /**
         * @internal
         * @private
         */
        public _animationPose: Transform = new Transform();
        private _bones: Array<Bone> = [];
        private _slots: Array<Slot> = [];
        private _boneData: BoneData;
        private _ik: Bone;
        /**
         * @internal
         * @private
         */
        public _cachedFrameIndices: Array<number>;
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
            super._onClear();

            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.ikBendPositive = false;
            this.length = 0.0;
            this.ikWeight = 0.0;

            this._transformDirty = BoneTransformDirty.None;
            this._visible = true;
            this._cachedFrameIndex = -1;
            this._ikChain = 0;
            this._ikChainIndex = 0;
            this._updateState = -1;
            this._blendLayer = 0;
            this._blendLeftWeight = 1.0;
            this._blendTotalWeight = 0.0;
            this._animationPose.identity();
            this._bones.length = 0;
            this._slots.length = 0;
            this._boneData = null;
            this._ik = null;
            this._cachedFrameIndices = null;
        }
        /**
         * @private
         */
        private _updateGlobalTransformMatrix(): void {
            this.global.x = this.origin.x + this.offset.x + this._animationPose.x;
            this.global.y = this.origin.y + this.offset.y + this._animationPose.y;
            this.global.skewX = this.origin.skewX + this.offset.skewX + this._animationPose.skewX;
            this.global.skewY = this.origin.skewY + this.offset.skewY + this._animationPose.skewY;
            this.global.scaleX = this.origin.scaleX * this.offset.scaleX * this._animationPose.scaleX;
            this.global.scaleY = this.origin.scaleY * this.offset.scaleY * this._animationPose.scaleY;

            if (this._parent) {
                const parentRotation = this._parent.global.skewY; // Only inherit skew y.
                const parentMatrix = this._parent.globalTransformMatrix;

                if (this.inheritScale) {
                    if (!this.inheritRotation) {
                        this.global.skewX -= parentRotation;
                        this.global.skewY -= parentRotation;
                    }

                    this.global.toMatrix(this.globalTransformMatrix);
                    this.globalTransformMatrix.concat(parentMatrix);

                    if (!this.inheritTranslation) {
                        this.globalTransformMatrix.tx = this.global.x;
                        this.globalTransformMatrix.ty = this.global.y;
                    }

                    this.global.fromMatrix(this.globalTransformMatrix);
                }
                else {
                    if (this.inheritTranslation) {
                        const x = this.global.x;
                        const y = this.global.y;
                        this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }

                    if (this.inheritRotation) {
                        this.global.skewX += parentRotation;
                        this.global.skewY += parentRotation;
                    }

                    this.global.toMatrix(this.globalTransformMatrix);
                }
            }
            else {
                this.global.toMatrix(this.globalTransformMatrix);
            }

            if (this._ik && this._ikChainIndex === this._ikChain && this.ikWeight > 0) {
                if (this.inheritTranslation && this._ikChain > 0 && this._parent) {
                    this._computeIKB();
                }
                else {
                    this._computeIKA();
                }
            }
        }
        /**
         * @private
         */
        private _computeIKA(): void {
            const ikGlobal = this._ik.global;
            const x = this.globalTransformMatrix.a * this.length;
            const y = this.globalTransformMatrix.b * this.length;

            const ikRadian =
                (
                    Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) +
                    this.offset.skewY -
                    this.global.skewY * 2 +
                    Math.atan2(y, x)
                ) * this.ikWeight; // Support offset.

            this.global.skewX += ikRadian;
            this.global.skewY += ikRadian;
            this.global.toMatrix(this.globalTransformMatrix);
        }
        /**
         * @private
         */
        private _computeIKB(): void {
            const parentGlobal = this._parent.global;
            const ikGlobal = this._ik.global;

            const x = this.globalTransformMatrix.a * this.length;
            const y = this.globalTransformMatrix.b * this.length;

            const lLL = x * x + y * y;
            const lL = Math.sqrt(lLL);

            let dX = this.global.x - parentGlobal.x;
            let dY = this.global.y - parentGlobal.y;
            const lPP = dX * dX + dY * dY;
            const lP = Math.sqrt(lPP);

            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            const lTT = dX * dX + dY * dY;
            const lT = Math.sqrt(lTT);

            let ikRadianA = 0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    ikRadianA += Math.PI;
                }
            }
            else {
                const h = (lPP - lLL + lTT) / (2 * lTT);
                const r = Math.sqrt(lPP - h * h * lTT) / lT;
                const hX = parentGlobal.x + (dX * h);
                const hY = parentGlobal.y + (dY * h);
                const rX = -dY * r;
                const rY = dX * r;

                if (this.ikBendPositive) {
                    this.global.x = hX - rX;
                    this.global.y = hY - rY;
                }
                else {
                    this.global.x = hX + rX;
                    this.global.y = hY + rY;
                }

                ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
            }

            ikRadianA = (ikRadianA - parentGlobal.skewY) * this.ikWeight;

            parentGlobal.skewX += ikRadianA;
            parentGlobal.skewY += ikRadianA;
            parentGlobal.toMatrix(this._parent.globalTransformMatrix);
            this._parent._transformDirty = BoneTransformDirty.Self;

            this.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
            this.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;

            const ikRadianB =
                (
                    Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) + this.offset.skewY -
                    this.global.skewY * 2 + Math.atan2(y, x)
                ) * this.ikWeight; // Support offset.

            this.global.skewX += ikRadianB;
            this.global.skewY += ikRadianB;

            this.global.toMatrix(this.globalTransformMatrix);
        }
        /**
         * @internal
         * @private
         */
        public _init(boneData: BoneData): void {
            if (this._boneData) {
                return;
            }

            this._boneData = boneData;

            this.inheritTranslation = this._boneData.inheritTranslation;
            this.inheritRotation = this._boneData.inheritRotation;
            this.inheritScale = this._boneData.inheritScale;
            this.length = this._boneData.length;
            this.name = this._boneData.name;
            this.origin = this._boneData.transform;
        }
        /**
         * @internal
         * @private
         */
        public _setArmature(value: Armature): void {
            if (this._armature === value) {
                return;
            }

            this._ik = null;

            let oldSlots: Array<Slot> = null;
            let oldBones: Array<Bone> = null;

            if (this._armature) {
                oldSlots = this.getSlots();
                oldBones = this.getBones();
                this._armature._removeBoneFromBoneList(this);
            }

            this._armature = value;

            if (this._armature) {
                this._armature._addBoneToBoneList(this);
            }

            if (oldSlots) {
                for (let i = 0, l = oldSlots.length; i < l; ++i) {
                    const slot = oldSlots[i];
                    if (slot.parent === this) {
                        slot._setArmature(this._armature);
                    }
                }
            }

            if (oldBones) {
                for (let i = 0, l = oldBones.length; i < l; ++i) {
                    const bone = oldBones[i];
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
        public _setIK(value: Bone, chain: number, chainIndex: number): void {
            if (value) {
                if (chain === chainIndex) {
                    let chainEnd = this._parent;
                    if (chain && chainEnd) {
                        chain = 1;
                    }
                    else {
                        chain = 0;
                        chainIndex = 0;
                        chainEnd = this;
                    }

                    if (chainEnd === value || chainEnd.contains(value)) {
                        value = null;
                        chain = 0;
                        chainIndex = 0;
                    }
                    else {
                        let ancestor = value;
                        while (ancestor.ik && ancestor.ikChain) {
                            if (chainEnd.contains(ancestor.ik)) {
                                value = null;
                                chain = 0;
                                chainIndex = 0;
                                break;
                            }

                            ancestor = ancestor.parent;
                        }
                    }
                }
            }
            else {
                chain = 0;
                chainIndex = 0;
            }

            this._ik = value;
            this._ikChain = chain;
            this._ikChainIndex = chainIndex;

            if (this._armature) {
                this._armature._bonesDirty = true;
            }
        }
        /**
         * @internal
         * @private
         */
        public _update(cacheFrameIndex: number): void {
            this._updateState = -1;

            if (cacheFrameIndex >= 0 && this._cachedFrameIndices) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = BoneTransformDirty.None;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = BoneTransformDirty.All;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else if (
                    this._transformDirty === BoneTransformDirty.All ||
                    (this._parent && this._parent._transformDirty !== BoneTransformDirty.None) ||
                    (this._ik && this.ikWeight > 0 && this._ik._transformDirty !== BoneTransformDirty.None)
                ) { // Dirty.
                    this._transformDirty = BoneTransformDirty.All;
                    this._cachedFrameIndex = -1;
                }
                else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                    this._transformDirty = BoneTransformDirty.None;
                    this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                }
                else { // Dirty.
                    this._transformDirty = BoneTransformDirty.All;
                    this._cachedFrameIndex = -1;
                }
            }
            else if (
                this._transformDirty === BoneTransformDirty.All ||
                (this._parent && this._parent._transformDirty !== BoneTransformDirty.None) ||
                (this._ik && this.ikWeight > 0 && this._ik._transformDirty !== BoneTransformDirty.None)
            ) { // Dirty.
                cacheFrameIndex = -1;
                this._transformDirty = BoneTransformDirty.All;
                this._cachedFrameIndex = -1;
            }

            if (this._transformDirty !== BoneTransformDirty.None) {
                if (this._transformDirty === BoneTransformDirty.All) {
                    this._transformDirty = BoneTransformDirty.Self;

                    if (this._cachedFrameIndex < 0) {
                        this._updateGlobalTransformMatrix();

                        if (cacheFrameIndex >= 0) {
                            this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                        }
                    }
                    else {
                        this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                    }

                    this._updateState = 0;
                }
                else {
                    this._transformDirty = BoneTransformDirty.None;
                }
            }
        }
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        public invalidUpdate(): void {
            this._transformDirty = BoneTransformDirty.All;
        }
        /**
         * @language zh_CN
         * 是否包含骨骼或插槽。
         * @returns
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        public contains(child: TransformObject): boolean {
            if (child) {
                if (child === this) {
                    return false;
                }

                let ancestor = child;
                while (ancestor !== this && ancestor) {
                    ancestor = ancestor.parent;
                }

                return ancestor === this;
            }

            return false;
        }
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        public getBones(): Array<Bone> {
            this._bones.length = 0;

            const bones = this._armature.getBones();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];
                if (bone.parent === this) {
                    this._bones.push(bone);
                }
            }

            return this._bones;
        }
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public getSlots(): Array<Slot> {
            this._slots.length = 0;

            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot.parent === this) {
                    this._slots.push(slot);
                }
            }

            return this._slots;
        }
        /**
         * @language zh_CN
         * 控制此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public get visible(): boolean {
            return this._visible;
        }
        public set visible(value: boolean) {
            if (this._visible === value) {
                return;
            }

            this._visible = value;
            
            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot._parent === this) {
                    slot._updateVisible();
                }
            }
        }

        /**
         * @deprecated
         * @see dragonBones.Armature#getSlot()
         */
        public get slot(): Slot {
            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot.parent === this) {
                    return slot;
                }
            }

            return null;
        }
        /**
         * @deprecated
         */
        public get ikChain(): number {
            return this._ikChain;
        }
        /**
         * @deprecated
         */
        public get ikChainIndex(): number {
            return this._ikChainIndex;
        }
        /**
         * @deprecated
         */
        public get ik(): Bone {
            return this._ik;
        }
    }
}