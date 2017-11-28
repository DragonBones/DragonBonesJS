/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2016 DragonBones team and other contributors
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
    /**
     * - Bone is one of the most important logical units in the armature animation system,
     * and is responsible for the realization of translate, rotation, scaling in the animations.
     * A armature can contain multiple bones.
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移、旋转、缩放的实现。
     * 一个骨架中可以包含多个骨骼。
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
         * - The offset mode.
         * @see #offset
         * @version DragonBones 5.5
         * @language en_US
         */
        /**
         * - 偏移模式。
         * @see #offset
         * @version DragonBones 5.5
         * @language zh_CN
         */
        public offsetMode: OffsetMode;
        /**
         * @internal
         * @private
         */
        public readonly animationPose: Transform = new Transform();
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
        /**
         * @internal
         * @private
         */
        public _boneData: BoneData;
        /**
         * @internal
         * @private
         */
        public _cachedFrameIndices: Array<number> | null;
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.offsetMode = OffsetMode.Additive;
            this.animationPose.identity();

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
            this._boneData = null as any; //
            this._cachedFrameIndices = null;
        }
        /**
         * @private
         */
        private _updateGlobalTransformMatrix(isCache: boolean): void {
            const flipX = this._armature.flipX;
            const flipY = this._armature.flipY === DragonBones.yDown;
            let inherit = this._parent !== null;
            let rotation = 0.0;
            const global = this.global;
            const globalTransformMatrix = this.globalTransformMatrix;

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

                if (this._boneData.inheritScale) {
                    if (!this._boneData.inheritRotation) {
                        this._parent.updateGlobalTransform();

                        if (flipX && flipY) {
                            rotation = global.rotation - (this._parent.global.rotation + Math.PI);
                        }
                        else if (flipX) {
                            rotation = global.rotation + this._parent.global.rotation + Math.PI;
                        }
                        else if (flipY) {
                            rotation = global.rotation + this._parent.global.rotation;
                        }
                        else {
                            rotation = global.rotation - this._parent.global.rotation;
                        }

                        global.rotation = rotation;
                    }

                    global.toMatrix(globalTransformMatrix);
                    globalTransformMatrix.concat(parentMatrix);

                    if (this._boneData.inheritTranslation) {
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
                    if (this._boneData.inheritTranslation) {
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

                    if (this._boneData.inheritRotation) {
                        this._parent.updateGlobalTransform();

                        if (this._parent.global.scaleX < 0.0) {
                            rotation = global.rotation + this._parent.global.rotation + Math.PI;
                        }
                        else {
                            rotation = global.rotation + this._parent.global.rotation;
                        }

                        if (parentMatrix.a * parentMatrix.d - parentMatrix.b * parentMatrix.c < 0.0) {
                            rotation -= global.rotation * 2.0;

                            if (flipX !== flipY || this._boneData.inheritReflection) {
                                global.skew += Math.PI;
                            }
                        }

                        global.rotation = rotation;
                    }
                    else if (flipX || flipY) {
                        if (flipX && flipY) {
                            rotation = global.rotation + Math.PI;
                        }
                        else {
                            if (flipX) {
                                rotation = Math.PI - global.rotation;
                            }
                            else {
                                rotation = -global.rotation;
                            }

                            global.skew += Math.PI;
                        }

                        global.rotation = rotation;
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
                        rotation = global.rotation + Math.PI;
                    }
                    else {
                        if (flipX) {
                            rotation = Math.PI - global.rotation;
                        }
                        else {
                            rotation = -global.rotation;
                        }

                        global.skew += Math.PI;
                    }

                    global.rotation = rotation;
                }

                global.toMatrix(globalTransformMatrix);
            }
        }
        /**
         * @inheritDoc
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
            if (this._boneData !== null) {
                return;
            }

            this._boneData = boneData;
            //
            this.origin = this._boneData.transform;
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
                            if (constraint._root === this) {
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
                        if (constraint._root === this) {
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
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
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
         * - Forces the bone to update the transform in the next frame.
         * When the bone is not animated or its animation state is finished, the bone will not continue to update,
         * and when the skeleton must be updated for some reason, the method needs to be called explicitly.
         * @example
         * <pre>
         *     let bone = armature.getBone("arm");
         *     bone.offset.scaleX = 2.0;
         *     bone.invalidUpdate();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 强制骨骼在下一帧更新变换。
         * 当该骨骼没有动画状态或其动画状态播放完成时，骨骼将不在继续更新，而此时由于某些原因必须更新骨骼时，则需要显式调用该方法。
         * @example
         * <pre>
         *     let bone = armature.getBone("arm");
         *     bone.offset.scaleX = 2.0;
         *     bone.invalidUpdate();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public invalidUpdate(): void {
            this._transformDirty = true;
        }
        /**
         * - Check whether the bone contains a specific bone or slot.
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查该骨骼是否包含特定的骨骼或插槽。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public contains(value: TransformObject): boolean {
            if (value === this) {
                return false;
            }

            let ancestor: TransformObject | null = value;
            while (ancestor !== this && ancestor !== null) {
                ancestor = ancestor.parent;
            }

            return ancestor === this;
        }
        /**
         * - The bone data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 骨骼数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get boneData(): BoneData {
            return this._boneData;
        }
        /**
         * - The visible of all slots in the bone.
         * @default true
         * @see dragonBones.Slot#visible
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot#visible
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
         * - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get name(): string {
            return this._boneData.name;
        }

        /**
         * - Deprecated, please refer to {@link dragonBones.Armature#getBones()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.Armature#getBones()}。
         * @deprecated
         * @language zh_CN
         */
        public getBones(): Array<Bone> {
            const bones = new Array<Bone>();

            for (const bone of this._armature.getBones()) {
                if (bone.parent === this) {
                    bones.push(bone);
                }
            }

            return bones;
        }
        /**
         * - Deprecated, please refer to {@link dragonBones.Armature#getSlots()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.Armature#getSlots()}。
         * @deprecated
         * @language zh_CN
         */
        public getSlots(): Array<Slot> {
            const slots = new Array<Slot>();

            for (const slot of this._armature.getSlots()) {
                if (slot.parent === this) {
                    slots.push(slot);
                }
            }

            return slots;
        }
        /**
         * - Deprecated, please refer to {@link dragonBones.Armature#getSlot()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.Armature#getSlot()}。
         * @deprecated
         * @language zh_CN
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