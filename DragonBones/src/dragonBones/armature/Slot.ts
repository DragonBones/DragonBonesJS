namespace dragonBones {
    /**
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export abstract class Slot extends TransformObject {
        /**
         * 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public displayController: string | null;
        /**
         * @readonly
         */
        public slotData: SlotData;
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
        protected _visibleDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @private
         */
        public _colorDirty: boolean;
        /**
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
        protected _visible: boolean;
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
        protected _animationDisplayIndex: number;
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
        protected readonly _localMatrix: Matrix = new Matrix();
        /**
         * @private
         */
        public readonly _colorTransform: ColorTransform = new ColorTransform();
        /**
         * @private
         */
        public readonly _ffdVertices: Array<number> = [];
        /**
         * @private
         */
        public readonly _displayDatas: Array<DisplayData | null> = [];
        /**
         * @private
         */
        protected readonly _displayList: Array<any | Armature> = [];
        /**
         * @private
         */
        protected readonly _meshBones: Array<Bone | null> = [];
        /**
         * @internal
         * @private
         */
        public _rawDisplayDatas: Array<DisplayData | null>;
        /**
         * @private
         */
        protected _displayData: DisplayData | null;
        /**
         * @private
         */
        protected _textureData: TextureData | null;
        /**
         * @private
         */
        public _meshData: MeshDisplayData | null;
        /**
         * @private
         */
        protected _boundingBoxData: BoundingBoxData | null;
        /**
         * @private
         */
        protected _rawDisplay: any = null; // Initial value.
        /**
         * @private
         */
        protected _meshDisplay: any = null; // Initial value.
        /**
         * @private
         */
        protected _display: any;
        /**
         * @private
         */
        protected _childArmature: Armature | null;
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

            const disposeDisplayList: Array<any> = [];
            for (const eachDisplay of this._displayList) {
                if (
                    eachDisplay !== null && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (const eachDisplay of disposeDisplayList) {
                if (eachDisplay instanceof Armature) {
                    eachDisplay.dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }

            if (this._meshDisplay !== null && this._meshDisplay !== this._rawDisplay) { // May be _meshDisplay and _rawDisplay is the same one.
                this._disposeDisplay(this._meshDisplay);
            }

            if (this._rawDisplay !== null) {
                this._disposeDisplay(this._rawDisplay);
            }

            this.displayController = null;
            this.slotData = null as any; //

            this._displayDirty = false;
            this._zOrderDirty = false;
            this._blendModeDirty = false;
            this._colorDirty = false;
            this._meshDirty = false;
            this._transformDirty = false;
            this._visible = true;
            this._blendMode = BlendMode.Normal;
            this._displayIndex = -1;
            this._animationDisplayIndex = -1;
            this._zOrder = 0;
            this._cachedFrameIndex = -1;
            this._pivotX = 0.0;
            this._pivotY = 0.0;
            this._localMatrix.identity();
            this._colorTransform.identity();
            this._ffdVertices.length = 0;
            this._displayList.length = 0;
            this._displayDatas.length = 0;
            this._meshBones.length = 0;
            this._rawDisplayDatas = null as any; //
            this._displayData = null;
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
        protected _updateDisplayData(): void {
            const prevDisplayData = this._displayData;
            const prevTextureData = this._textureData;
            const prevMeshData = this._meshData;
            const rawDisplayData = this._displayIndex >= 0 && this._displayIndex < this._rawDisplayDatas.length ? this._rawDisplayDatas[this._displayIndex] : null;

            if (this._displayIndex >= 0 && this._displayIndex < this._displayDatas.length) {
                this._displayData = this._displayDatas[this._displayIndex];
            }
            else {
                this._displayData = null;
            }

            // Update texture and mesh data.
            if (this._displayData !== null) {
                if (this._displayData.type === DisplayType.Image || this._displayData.type === DisplayType.Mesh) {
                    this._textureData = (this._displayData as ImageDisplayData).texture;
                    if (this._displayData.type === DisplayType.Mesh) {
                        this._meshData = this._displayData as MeshDisplayData;
                    }
                    else if (rawDisplayData !== null && rawDisplayData.type === DisplayType.Mesh) {
                        this._meshData = rawDisplayData as MeshDisplayData;
                    }
                    else {
                        this._meshData = null;
                    }
                }
                else {
                    this._textureData = null;
                    this._meshData = null;
                }
            }
            else {
                this._textureData = null;
                this._meshData = null;
            }

            // Update bounding box data.
            if (this._displayData !== null && this._displayData.type === DisplayType.BoundingBox) {
                this._boundingBoxData = (this._displayData as BoundingBoxDisplayData).boundingBox;
            }
            else if (rawDisplayData !== null && rawDisplayData.type === DisplayType.BoundingBox) {
                this._boundingBoxData = (rawDisplayData as BoundingBoxDisplayData).boundingBox;
            }
            else {
                this._boundingBoxData = null;
            }

            if (this._displayData !== prevDisplayData || this._textureData !== prevTextureData || this._meshData !== prevMeshData) {
                // Update pivot offset.
                if (this._meshData !== null) {
                    this._pivotX = 0.0;
                    this._pivotY = 0.0;
                }
                else if (this._textureData !== null) {
                    const imageDisplayData = this._displayData as ImageDisplayData;
                    const scale = this._armature.armatureData.scale;
                    const frame = this._textureData.frame;

                    this._pivotX = imageDisplayData.pivot.x;
                    this._pivotY = imageDisplayData.pivot.y;

                    const rect = frame !== null ? frame : this._textureData.region;
                    let width = rect.width * scale;
                    let height = rect.height * scale;

                    if (this._textureData.rotated && frame === null) {
                        width = rect.height;
                        height = rect.width;
                    }

                    this._pivotX *= width;
                    this._pivotY *= height;

                    if (frame !== null) {
                        this._pivotX += frame.x * scale;
                        this._pivotY += frame.y * scale;
                    }
                }
                else {
                    this._pivotX = 0.0;
                    this._pivotY = 0.0;
                }

                // Update mesh bones and ffd vertices.
                if (this._meshData !== prevMeshData) {
                    if (this._meshData !== null) { // && this._meshData === this._displayData
                        if (this._meshData.weight !== null) {
                            this._ffdVertices.length = this._meshData.weight.count * 2;
                            this._meshBones.length = this._meshData.weight.bones.length;

                            for (let i = 0, l = this._meshBones.length; i < l; ++i) {
                                this._meshBones[i] = this._armature.getBone(this._meshData.weight.bones[i].name);
                            }
                        }
                        else {
                            const vertexCount = this._meshData.parent.parent.intArray[this._meshData.offset + BinaryOffset.MeshVertexCount];
                            this._ffdVertices.length = vertexCount * 2;
                            this._meshBones.length = 0;
                        }

                        for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                            this._ffdVertices[i] = 0.0;
                        }

                        this._meshDirty = true;
                    }
                    else {
                        this._ffdVertices.length = 0;
                        this._meshBones.length = 0;
                    }
                }
                else if (this._meshData !== null && this._textureData !== prevTextureData) { // Update mesh after update frame.
                    this._meshDirty = true;
                }

                if (this._displayData !== null && rawDisplayData !== null && this._displayData !== rawDisplayData && this._meshData === null) {
                    rawDisplayData.transform.toMatrix(Slot._helpMatrix);
                    Slot._helpMatrix.invert();
                    Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                    this._pivotX -= Slot._helpPoint.x;
                    this._pivotY -= Slot._helpPoint.y;

                    this._displayData.transform.toMatrix(Slot._helpMatrix);
                    Slot._helpMatrix.invert();
                    Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                    this._pivotX += Slot._helpPoint.x;
                    this._pivotY += Slot._helpPoint.y;
                }

                // Update original transform.
                if (rawDisplayData !== null) {
                    this.origin = rawDisplayData.transform;
                }
                else if (this._displayData !== null) {
                    this.origin = this._displayData.transform;
                }

                this._displayDirty = true;
                this._transformDirty = true;
            }
        }
        /**
         * @private
         */
        protected _updateDisplay(): void {
            const prevDisplay = this._display !== null ? this._display : this._rawDisplay;
            const prevChildArmature = this._childArmature;

            // Update display and child armature.
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display !== null && this._display instanceof Armature) {
                    this._childArmature = this._display as Armature;
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

            // Update display.
            const currentDisplay = this._display !== null ? this._display : this._rawDisplay;
            if (currentDisplay !== prevDisplay) {
                this._onUpdateDisplay();
                this._replaceDisplay(prevDisplay);

                this._visibleDirty = true;
                this._blendModeDirty = true;
                this._colorDirty = true;
            }

            // Update frame.
            if (currentDisplay === this._rawDisplay || currentDisplay === this._meshDisplay) {
                this._updateFrame();
            }

            // Update child armature.
            if (this._childArmature !== prevChildArmature) {
                if (prevChildArmature !== null) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    prevChildArmature.clock = null;
                    if (prevChildArmature.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }

                if (this._childArmature !== null) {
                    this._childArmature._parent = this; // Update child armature parent.
                    this._childArmature.clock = this._armature.clock;
                    if (this._childArmature.inheritAnimation) { // Set child armature cache frameRate.
                        if (this._childArmature.cacheFrameRate === 0) {
                            const cacheFrameRate = this._armature.cacheFrameRate;
                            if (cacheFrameRate !== 0) {
                                this._childArmature.cacheFrameRate = cacheFrameRate;
                            }
                        }

                        // Child armature action.
                        let actions: Array<ActionData> | null = null;
                        if (this._displayData !== null && this._displayData.type === DisplayType.Armature) {
                            actions = (this._displayData as ArmatureDisplayData).actions;
                        }
                        else {
                            const rawDisplayData = this._displayIndex >= 0 && this._displayIndex < this._rawDisplayDatas.length ? this._rawDisplayDatas[this._displayIndex] : null;
                            if (rawDisplayData !== null && rawDisplayData.type === DisplayType.Armature) {
                                actions = (rawDisplayData as ArmatureDisplayData).actions;
                            }
                        }

                        if (actions !== null && actions.length > 0) {
                            for (const action of actions) {
                                this._childArmature._bufferAction(action, false); // Make sure default action at the beginning.
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
        protected _isMeshBonesUpdate(): boolean {
            for (const bone of this._meshBones) {
                if (bone !== null && bone._childrenTransformDirty) {
                    return true;
                }
            }

            return false;
        }
        /**
         * @internal
         * @private
         */
        public _setArmature(value: Armature | null): void {
            if (this._armature === value) {
                return;
            }

            if (this._armature !== null) {
                this._armature._removeSlotFromSlotList(this);
            }

            this._armature = value as any; //

            this._onUpdateDisplay();

            if (this._armature !== null) {
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
        public _setDisplayIndex(value: number, isAnimation: boolean = false): boolean {
            if (isAnimation) {
                if (this._animationDisplayIndex === value) {
                    return false;
                }

                this._animationDisplayIndex = value;
            }

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

            return this._colorDirty;
        }
        /**
         * @private
         */
        public _setDisplayList(value: Array<any> | null): boolean {
            if (value !== null && value.length > 0) {
                if (this._displayList.length !== value.length) {
                    this._displayList.length = value.length;
                }

                for (let i = 0, l = value.length; i < l; ++i) { // Retain input render displays.
                    const eachDisplay = value[i];
                    if (
                        eachDisplay !== null && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
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
                this._displayDirty = this._display !== null;
            }

            this._updateDisplayData();

            return this._displayDirty;
        }
        /**
         * @private
         */
        public init(slotData: SlotData, displayDatas: Array<DisplayData | null>, rawDisplay: any, meshDisplay: any): void {
            if (this.slotData !== null) {
                return;
            }

            this.slotData = slotData;
            this.name = this.slotData.name;

            this._visibleDirty = true;
            this._blendModeDirty = true;
            this._colorDirty = true;
            this._blendMode = this.slotData.blendMode;
            this._zOrder = this.slotData.zOrder;
            this._colorTransform.copyFrom(this.slotData.color);
            this._rawDisplayDatas = displayDatas;
            this._rawDisplay = rawDisplay;
            this._meshDisplay = meshDisplay;

            this._displayDatas.length = this._rawDisplayDatas.length;
            for (let i = 0, l = this._displayDatas.length; i < l; ++i) {
                this._displayDatas[i] = this._rawDisplayDatas[i];
            }
        }
        /**
         * @internal
         * @private
         */
        public update(cacheFrameIndex: number): void {
            if (this._displayDirty) {
                this._displayDirty = false;
                this._updateDisplay();

                if (this._transformDirty) { // Update local matrix. (Only updated when both display and transform are dirty.)
                    if (this.origin !== null) {
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

            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
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

            if (this._display === null) {
                return;
            }

            if (this._visibleDirty) {
                this._visibleDirty = false;
                this._updateVisible();
            }

            if (this._blendModeDirty) {
                this._blendModeDirty = false;
                this._updateBlendMode();
            }

            if (this._colorDirty) {
                this._colorDirty = false;
                this._updateColor();
            }

            if (this._meshData !== null && this._display === this._meshDisplay) {
                const isSkinned = this._meshData.weight !== null;
                if (this._meshDirty || (isSkinned && this._isMeshBonesUpdate())) {
                    this._meshDirty = false;
                    this._updateMesh();
                }

                if (isSkinned) {
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

                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature.armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature.armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }

                this._updateTransform(false);
            }
        }
        /**
         * @private
         */
        public updateTransformAndMatrix(): void {
            if (this._transformDirty) {
                this._transformDirty = false;
                this._updateGlobalTransformMatrix(false);
            }
        }
        /**
         * 判断指定的点是否在插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public containsPoint(x: number, y: number): boolean {
            if (this._boundingBoxData === null) {
                return false;
            }

            this.updateTransformAndMatrix();

            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(x, y, Slot._helpPoint);

            return this._boundingBoxData.containsPoint(Slot._helpPoint.x, Slot._helpPoint.y);
        }
        /**
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
         * @language zh_CN
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            if (this._boundingBoxData === null) {
                return 0;
            }

            this.updateTransformAndMatrix();
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
                    if (intersectionPointA !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                        if (intersectionPointB !== null) {
                            intersectionPointB.x = intersectionPointA.x;
                            intersectionPointB.y = intersectionPointA.y;
                        }
                    }
                    else if (intersectionPointB !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                else {
                    if (intersectionPointA !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                    }

                    if (intersectionPointB !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }

                if (normalRadians !== null) {
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.x), Math.sin(normalRadians.x), Slot._helpPoint, true);
                    normalRadians.x = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);

                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.y), Math.sin(normalRadians.y), Slot._helpPoint, true);
                    normalRadians.y = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                }
            }

            return intersectionCount;
        }
        /**
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public invalidUpdate(): void {
            this._displayDirty = true;
            this._transformDirty = true;
        }
        /**
         * 此时显示的显示对象在显示列表中的索引。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get displayIndex(): number {
            return this._displayIndex;
        }
        public set displayIndex(value: number) {
            if (this._setDisplayIndex(value)) {
                this.update(-1);
            }
        }
        /**
         * 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get displayList(): Array<any> {
            return this._displayList.concat();
        }
        public set displayList(value: Array<any>) {
            const backupDisplayList = this._displayList.concat(); // Copy.
            const disposeDisplayList = new Array<any>();

            if (this._setDisplayList(value)) {
                this.update(-1);
            }

            // Release replaced displays.
            for (const eachDisplay of backupDisplayList) {
                if (
                    eachDisplay !== null && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    this._displayList.indexOf(eachDisplay) < 0 &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (const eachDisplay of disposeDisplayList) {
                if (eachDisplay instanceof Armature) {
                    (eachDisplay as Armature).dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }
        }
        /**
         * 插槽此时的自定义包围盒数据。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get boundingBoxData(): BoundingBoxData | null {
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
         * 此时显示的显示对象。
         * @version DragonBones 3.0
         * @language zh_CN
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
         * 此时显示的子骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get childArmature(): Armature | null {
            return this._childArmature;
        }
        public set childArmature(value: Armature | null) {
            if (this._childArmature === value) {
                return;
            }

            this.display = value;
        }

        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #display
         */
        public getDisplay(): any {
            return this._display;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #display
         */
        public setDisplay(value: any) {
            this.display = value;
        }
    }
}