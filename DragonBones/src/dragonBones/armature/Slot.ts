namespace dragonBones {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    export abstract class Slot extends TransformObject {
        /**
         * @language zh_CN
         * 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         */
        public displayController: string;
        /**
         * @private
         */
        protected _displayDirty: boolean;
        /**
         * @private
         */
        protected _zOrderDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @internal
         * @private
         */
        public _colorDirty: boolean;
        /**
         * @internal
         * @private
         */
        public _meshDirty: boolean;
        /**
         * @private
         */
        protected _transformDirty: boolean;
        /**
         * @private
         */
        protected _blendMode: BlendMode;
        /**
         * @private
         */
        protected _displayIndex: number;
        /**
         * @private
         */
        public _zOrder: number;
        /**
         * @private
         */
        protected _cachedFrameIndex: number;
        /**
         * @private
         */
        public _pivotX: number;
        /**
         * @private
         */
        public _pivotY: number;
        /**
         * @private
         */
        protected _localMatrix: Matrix = new Matrix();
        /**
         * @private
         */
        public _colorTransform: ColorTransform = new ColorTransform();
        /**
         * @private
         */
        public _ffdVertices: Array<number> = [];
        /**
         * @private
         */
        protected _displayList: Array<any | Armature> = [];
        /**
         * @private
         */
        public _textureDatas: Array<TextureData> = [];
        /**
         * @private
         */
        public _replacedDisplayDatas: Array<DisplayData> = [];
        /**
         * @private
         */
        protected _meshBones: Array<Bone> = [];
        /**
         * @private
         */
        protected _skinSlotData: SkinSlotData;
        /**
         * @private
         */
        protected _displayData: DisplayData;
        /**
         * @private
         */
        protected _replacedDisplayData: DisplayData;
        /**
         * @private
         */
        protected _textureData: TextureData;
        /**
         * @private
         */
        public _meshData: MeshData;
        /**
         * @private
         */
        protected _boundingBoxData: BoundingBoxData;
        /**
         * @private
         */
        protected _rawDisplay: any;
        /**
         * @private
         */
        protected _meshDisplay: any;
        /**
         * @private
         */
        protected _display: any;
        /**
         * @private
         */
        protected _childArmature: Armature;
        /**
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

            const disposeDisplayList: Array<any> = [];
            for (let i = 0, l = this._displayList.length; i < l; ++i) {
                const eachDisplay = this._displayList[i];
                if (
                    eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (let i = 0, l = disposeDisplayList.length; i < l; ++i) {
                const eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof Armature) {
                    (eachDisplay as Armature).dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }

            if (this._meshDisplay && this._meshDisplay !== this._rawDisplay) { // May be _meshDisplay and _rawDisplay is the same one.
                this._disposeDisplay(this._meshDisplay);
            }

            if (this._rawDisplay) {
                this._disposeDisplay(this._rawDisplay);
            }

            this.displayController = null;

            this._displayDirty = false;
            this._zOrderDirty = false;
            this._blendModeDirty = false;
            this._colorDirty = false;
            this._meshDirty = false;
            this._transformDirty = false;
            this._blendMode = BlendMode.Normal;
            this._displayIndex = -1;
            this._zOrder = 0;
            this._cachedFrameIndex = -1;
            this._pivotX = 0.0;
            this._pivotY = 0.0;
            this._localMatrix.identity();
            this._colorTransform.identity();
            this._ffdVertices.length = 0;
            this._displayList.length = 0;
            this._textureDatas.length = 0;
            this._replacedDisplayDatas.length = 0;
            this._meshBones.length = 0;
            this._skinSlotData = null;
            this._displayData = null;
            this._replacedDisplayData = null;
            this._textureData = null;
            this._meshData = null;
            this._boundingBoxData = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._display = null;
            this._childArmature = null;
            this._cachedFrameIndices = null;
        }
        /**
         * @private
         */
        protected abstract _initDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _disposeDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _onUpdateDisplay(): void;
        /**
         * @private
         */
        protected abstract _addDisplay(): void;
        /**
         * @private
         */
        protected abstract _replaceDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _removeDisplay(): void;
        /**
         * @private
         */
        protected abstract _updateZOrder(): void;
        /**
         * @internal
         * @private
         */
        public abstract _updateVisible(): void;
        /**
         * @private
         */
        protected abstract _updateBlendMode(): void;
        /**
         * @private
         */
        protected abstract _updateColor(): void;
        /**
         * @private
         */
        protected abstract _updateFrame(): void;
        /**
         * @private
         */
        protected abstract _updateMesh(): void;
        /**
         * @private
         */
        protected abstract _updateTransform(isSkinnedMesh: boolean): void;
        /**
         * @private
         */
        protected _isMeshBonesUpdate(): boolean {
            for (let i = 0, l = this._meshBones.length; i < l; ++i) {
                if (this._meshBones[i]._childrenTransformDirty) {
                    return true;
                }
            }

            return false;
        }
        /**
         * @private
         */
        protected _updateDisplayData(): void {
            const prevDisplayData = this._displayData;
            const prevReplaceDisplayData = this._replacedDisplayData;
            const prevTextureData = this._textureData;
            const prevMeshData = this._meshData;
            const currentDisplay = this._displayIndex >= 0 && this._displayIndex < this._displayList.length ? this._displayList[this._displayIndex] : null;

            if (this._displayIndex >= 0 && this._displayIndex < this._skinSlotData.displays.length) {
                this._displayData = this._skinSlotData.displays[this._displayIndex];
            }
            else {
                this._displayData = null;
            }

            if (this._displayIndex >= 0 && this._displayIndex < this._replacedDisplayDatas.length) {
                this._replacedDisplayData = this._replacedDisplayDatas[this._displayIndex];
            }
            else {
                this._replacedDisplayData = null;
            }

            if (this._displayData !== prevDisplayData || this._replacedDisplayData !== prevReplaceDisplayData || this._display != currentDisplay) {
                const currentDisplayData = this._replacedDisplayData ? this._replacedDisplayData : this._displayData;
                if (currentDisplayData && (currentDisplay === this._rawDisplay || currentDisplay === this._meshDisplay)) {
                    if (this._replacedDisplayData) {
                        this._textureData = this._replacedDisplayData.texture;
                    }
                    else if (this._displayIndex < this._textureDatas.length && this._textureDatas[this._displayIndex]) {
                        this._textureData = this._textureDatas[this._displayIndex];
                    }
                    else {
                        this._textureData = this._displayData.texture;
                    }

                    if (currentDisplay === this._meshDisplay) {
                        if (this._replacedDisplayData && this._replacedDisplayData.mesh) {
                            this._meshData = this._replacedDisplayData.mesh;
                        }
                        else {
                            this._meshData = this._displayData.mesh;
                        }
                    }
                    else {
                        this._meshData = null;
                    }

                    // Update pivot offset.
                    if (this._meshData) {
                        this._pivotX = 0.0;
                        this._pivotY = 0.0;
                    }
                    else if (this._textureData) {
                        const scale = this._armature.armatureData.scale;
                        this._pivotX = currentDisplayData.pivot.x;
                        this._pivotY = currentDisplayData.pivot.y;

                        if (currentDisplayData.isRelativePivot) {
                            const rect = this._textureData.frame ? this._textureData.frame : this._textureData.region;
                            let width = rect.width * scale;
                            let height = rect.height * scale;

                            if (this._textureData.rotated) {
                                width = rect.height;
                                height = rect.width;
                            }

                            this._pivotX *= width;
                            this._pivotY *= height;
                        }

                        if (this._textureData.frame) {
                            this._pivotX += this._textureData.frame.x * scale;
                            this._pivotY += this._textureData.frame.y * scale;
                        }
                    }
                    else {
                        this._pivotX = 0.0;
                        this._pivotY = 0.0;
                    }

                    if (
                        this._displayData && currentDisplayData !== this._displayData &&
                        (!this._meshData || this._meshData !== this._displayData.mesh)
                    ) {
                        this._displayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX -= Slot._helpPoint.x;
                        this._pivotY -= Slot._helpPoint.y;

                        currentDisplayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX += Slot._helpPoint.x;
                        this._pivotY += Slot._helpPoint.y;
                    }

                    if (this._meshData !== prevMeshData) { // Update mesh bones and ffd vertices.
                        if (this._meshData && this._displayData && this._meshData === this._displayData.mesh) {
                            if (this._meshData.skinned) {
                                this._meshBones.length = this._meshData.bones.length;

                                for (let i = 0, l = this._meshBones.length; i < l; ++i) {
                                    this._meshBones[i] = this._armature.getBone(this._meshData.bones[i].name);
                                }

                                let ffdVerticesCount = 0;
                                for (let i = 0, l = this._meshData.boneIndices.length; i < l; ++i) {
                                    ffdVerticesCount += this._meshData.boneIndices[i].length;
                                }

                                this._ffdVertices.length = ffdVerticesCount * 2;
                            }
                            else {
                                this._meshBones.length = 0;
                                this._ffdVertices.length = this._meshData.vertices.length;
                            }

                            for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                                this._ffdVertices[i] = 0.0;
                            }

                            this._meshDirty = true;
                        }
                        else {
                            this._meshBones.length = 0;
                            this._ffdVertices.length = 0;
                        }
                    }
                    else if (this._textureData !== prevTextureData) {
                        this._meshDirty = true;
                    }
                }
                else {
                    this._textureData = null;
                    this._meshData = null;
                    this._pivotX = 0.0;
                    this._pivotY = 0.0;
                    this._meshBones.length = 0;
                    this._ffdVertices.length = 0;
                }

                this._displayDirty = true;
                this._transformDirty = true;

                if (this._displayData) {
                    this.origin = this._displayData.transform;
                }
                else if (this._replacedDisplayData) {
                    this.origin = this._replacedDisplayData.transform;
                }
            }

            // Update bounding box data.
            if (this._replacedDisplayData) {
                this._boundingBoxData = this._replacedDisplayData.boundingBox;
            }
            else if (this._displayData) {
                this._boundingBoxData = this._displayData.boundingBox;
            }
            else {
                this._boundingBoxData = null;
            }
        }
        /**
         * @private
         */
        protected _updateDisplay(): void {
            const prevDisplay = this._display || this._rawDisplay;
            const prevChildArmature = this._childArmature;

            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display instanceof Armature) {
                    this._childArmature = <Armature>this._display;
                    this._display = this._childArmature.display;
                }
                else {
                    this._childArmature = null;
                }
            }
            else {
                this._display = null;
                this._childArmature = null;
            }

            const currentDisplay = this._display ? this._display : this._rawDisplay;
            if (currentDisplay !== prevDisplay) {
                this._onUpdateDisplay();
                this._replaceDisplay(prevDisplay);

                this._blendModeDirty = true;
                this._colorDirty = true;
            }

            // Update frame.
            if (currentDisplay === this._rawDisplay || currentDisplay === this._meshDisplay) {
                this._updateFrame();
            }

            // Update child armature.
            if (this._childArmature !== prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    prevChildArmature.clock = null;

                    if (prevChildArmature.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }

                if (this._childArmature) {
                    this._childArmature._parent = this; // Update child armature parent.
                    this._childArmature.clock = this._armature.clock;

                    if (this._childArmature.inheritAnimation) {
                        if (this._childArmature.cacheFrameRate === 0) { // Set child armature frameRate.
                            const cacheFrameRate = this._armature.cacheFrameRate;
                            if (cacheFrameRate !== 0) {
                                this._childArmature.cacheFrameRate = cacheFrameRate;
                            }
                        }

                        // Child armature action.                        
                        const actions = this._skinSlotData.slot.actions.length > 0 ? this._skinSlotData.slot.actions : this._childArmature.armatureData.actions;
                        if (actions.length > 0) {
                            for (let i = 0, l = actions.length; i < l; ++i) {
                                this._childArmature._bufferAction(actions[i]);
                            }
                        }
                        else {
                            this._childArmature.animation.play();
                        }
                    }
                }
            }
        }
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(isCache: boolean): void {
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(this._parent.globalTransformMatrix);
            if (isCache) {
                this.global.fromMatrix(this.globalTransformMatrix);
            }
            else {
                this._globalDirty = true;
            }
        }
        /**
         * @private
         */
        public _init(skinSlotData: SkinSlotData, rawDisplay: any, meshDisplay: any): void {
            if (this._skinSlotData) {
                return;
            }

            this._skinSlotData = skinSlotData;

            const slotData = this._skinSlotData.slot;

            this.name = slotData.name;

            this._zOrder = slotData.zOrder;
            this._blendMode = slotData.blendMode;
            this._colorTransform.copyFrom(slotData.color);
            this._rawDisplay = rawDisplay;
            this._meshDisplay = meshDisplay;

            this._blendModeDirty = true;
            this._colorDirty = true;
        }
        /**
         * @internal
         * @private
         */
        public _setArmature(value: Armature): void {
            if (this._armature === value) {
                return;
            }

            if (this._armature) {
                this._armature._removeSlotFromSlotList(this);
            }

            this._armature = value;

            this._onUpdateDisplay();

            if (this._armature) {
                this._armature._addSlotToSlotList(this);
                this._addDisplay();
            }
            else {
                this._removeDisplay();
            }
        }
        /**
         * @internal
         * @private
         */
        public _update(cacheFrameIndex: number): void {
            if (this._displayDirty) {
                this._displayDirty = false;
                this._updateDisplay();

                if (this._transformDirty) { // Update local matrix. (Only update when both display and transform are dirty.)
                    if (this.origin) {
                        this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
                    }
                    else {
                        this.global.copyFrom(this.offset).toMatrix(this._localMatrix);
                    }
                }
            }

            if (this._zOrderDirty) {
                this._zOrderDirty = false;
                this._updateZOrder();
            }

            if (cacheFrameIndex >= 0 && this._cachedFrameIndices) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else if (this._transformDirty || this._parent._childrenTransformDirty) { // Dirty.
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
            else if (this._transformDirty || this._parent._childrenTransformDirty) { // Dirty.
                cacheFrameIndex = -1;
                this._transformDirty = true;
                this._cachedFrameIndex = -1;
            }

            if (!this._display) {
                return;
            }

            if (this._blendModeDirty) {
                this._blendModeDirty = false;
                this._updateBlendMode();
            }

            if (this._colorDirty) {
                this._colorDirty = false;
                this._updateColor();
            }

            if (this._meshData && this._displayData && this._meshData === this._displayData.mesh) {
                if (this._meshDirty || (this._meshData.skinned && this._isMeshBonesUpdate())) {
                    this._meshDirty = false;

                    this._updateMesh();
                }

                if (this._meshData.skinned) {
                    if (this._transformDirty) {
                        this._transformDirty = false;
                        this._updateTransform(true);
                    }

                    return;
                }
            }

            if (this._transformDirty) {
                this._transformDirty = false;

                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    this._updateGlobalTransformMatrix(isCache);

                    if (isCache) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }

                this._updateTransform(false);
            }
        }
        /**
         * @private
         */
        public _updateTransformAndMatrix(): void {
            if (this._transformDirty) {
                this._transformDirty = false;
                this._updateGlobalTransformMatrix(false);
            }
        }
        /**
         * @private Factory
         */
        public _setDisplayList(value: Array<any>): boolean {
            if (value && value.length > 0) {
                if (this._displayList.length !== value.length) {
                    this._displayList.length = value.length;
                }

                for (let i = 0, l = value.length; i < l; ++i) { // Retain input render displays.
                    const eachDisplay = value[i];
                    if (
                        eachDisplay && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                        !(eachDisplay instanceof Armature) && this._displayList.indexOf(eachDisplay) < 0
                    ) {
                        this._initDisplay(eachDisplay);
                    }

                    this._displayList[i] = eachDisplay;
                }
            }
            else if (this._displayList.length > 0) {
                this._displayList.length = 0;
            }

            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._displayDirty = this._display !== this._displayList[this._displayIndex];
            }
            else {
                this._displayDirty = this._display != null;
            }

            this._updateDisplayData();

            return this._displayDirty;
        }
        /**
         * @internal
         * @private
         */
        public _setDisplayIndex(value: number): boolean {
            if (this._displayIndex === value) {
                return false;
            }

            this._displayIndex = value;
            this._displayDirty = true;

            this._updateDisplayData();

            return this._displayDirty;
        }
        /**
         * @internal
         * @private
         */
        public _setZorder(value: number): boolean {
            if (this._zOrder === value) {
                //return false;
            }

            this._zOrder = value;
            this._zOrderDirty = true;

            return this._zOrderDirty;
        }
        /**
         * @internal
         * @private
         */
        public _setColor(value: ColorTransform): boolean {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;

            return true;
        }
        /**
         * @language zh_CN
         * 判断指定的点是否在插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 5.0
         */
        public containsPoint(x: number, y: number): boolean {
            if (!this._boundingBoxData) {
                return false;
            }

            this._updateTransformAndMatrix();

            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(x, y, Slot._helpPoint);

            return this._boundingBoxData.containsPoint(Slot._helpPoint.x, Slot._helpPoint.y);
        }
        /**
         * @language zh_CN
         * 判断指定的线段与插槽的自定义包围盒是否相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 5.0
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): number {
            if (!this._boundingBoxData) {
                return 0;
            }

            this._updateTransformAndMatrix();

            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(xA, yA, Slot._helpPoint);
            xA = Slot._helpPoint.x;
            yA = Slot._helpPoint.y;
            Slot._helpMatrix.transformPoint(xB, yB, Slot._helpPoint);
            xB = Slot._helpPoint.x;
            yB = Slot._helpPoint.y;

            const intersectionCount = this._boundingBoxData.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
            if (intersectionCount > 0) {
                if (intersectionCount === 1 || intersectionCount === 2) {
                    if (intersectionPointA) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                        if (intersectionPointB) {
                            intersectionPointB.x = intersectionPointA.x;
                            intersectionPointB.y = intersectionPointA.y;
                        }
                    }
                    else if (intersectionPointB) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                else {
                    if (intersectionPointA) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                    }

                    if (intersectionPointB) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }

                if (normalRadians) {
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.x), Math.sin(normalRadians.x), Slot._helpPoint, true);
                    normalRadians.x = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);

                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.y), Math.sin(normalRadians.y), Slot._helpPoint, true);
                    normalRadians.y = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                }
            }

            return intersectionCount;
        }
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        public invalidUpdate(): void {
            this._displayDirty = true;
            this._transformDirty = true;
        }
        /**
         * @private
         */
        public get skinSlotData(): SkinSlotData {
            return this._skinSlotData;
        }
        /**
         * @language zh_CN
         * 插槽此时的自定义包围盒数据。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        public get boundingBoxData(): BoundingBoxData {
            return this._boundingBoxData;
        }
        /**
         * @private
         */
        public get rawDisplay(): any {
            return this._rawDisplay;
        }
        /**
         * @private
         */
        public get meshDisplay(): any {
            return this._meshDisplay;
        }
        /**
         * @language zh_CN
         * 此时显示的显示对象在显示列表中的索引。
         * @version DragonBones 4.5
         */
        public get displayIndex(): number {
            return this._displayIndex;
        }
        public set displayIndex(value: number) {
            if (this._setDisplayIndex(value)) {
                this._update(-1);
            }
        }
        /**
         * @language zh_CN
         * 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         */
        public get displayList(): Array<any> {
            return this._displayList.concat();
        }
        public set displayList(value: Array<any>) {
            const backupDisplayList = this._displayList.concat(); // Copy.
            const disposeDisplayList = [];

            if (this._setDisplayList(value)) {
                this._update(-1);
            }

            // Release replaced render displays.
            for (let i = 0, l = backupDisplayList.length; i < l; ++i) {
                let eachDisplay = backupDisplayList[i];
                if (
                    eachDisplay && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    this._displayList.indexOf(eachDisplay) < 0 &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (let i = 0, l = disposeDisplayList.length; i < l; ++i) {
                let eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof Armature) {
                    (eachDisplay as Armature).dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }
        }
        /**
         * @language zh_CN
         * 此时显示的显示对象。
         * @version DragonBones 3.0
         */
        public get display(): any {
            return this._display;
        }
        public set display(value: any) {
            if (this._display === value) {
                return;
            }

            const displayListLength = this._displayList.length;
            if (this._displayIndex < 0 && displayListLength === 0) {  // Emprty.
                this._displayIndex = 0;
            }

            if (this._displayIndex < 0) {
                return;
            }
            else {
                const replaceDisplayList = this.displayList; // Copy.
                if (displayListLength <= this._displayIndex) {
                    replaceDisplayList.length = this._displayIndex + 1;
                }

                replaceDisplayList[this._displayIndex] = value;
                this.displayList = replaceDisplayList;
            }
        }
        /**
         * @language zh_CN
         * 此时显示的子骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        public get childArmature(): Armature {
            return this._childArmature;
        }
        public set childArmature(value: Armature) {
            if (this._childArmature === value) {
                return;
            }

            this.display = value;
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
         * @see #display
         */
        public setDisplay(value: any) {
            this.display = value;
        }
    }
}