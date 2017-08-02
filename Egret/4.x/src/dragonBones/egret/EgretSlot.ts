namespace dragonBones {
    /**
     * Egret 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.EgretSlot]";
        }
        /**
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public transformUpdateEnabled: boolean = false;

        private _armatureDisplay: EgretArmatureDisplay = null as any;
        private _renderDisplay: egret.DisplayObject = null as any;
        private _colorFilter: egret.ColorMatrixFilter | null = null;
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            this._armatureDisplay = null as any; //
            this._renderDisplay = null as any; //
            this._colorFilter = null;
        }
        /**
         * @private
         */
        protected _initDisplay(value: any): void {
            value;
        }
        /**
         * @private
         */
        protected _disposeDisplay(value: any): void {
            value;
        }
        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            this._armatureDisplay = this._armature.display;
            this._renderDisplay = (this._display !== null ? this._display : this._rawDisplay) as egret.DisplayObject;

            if (this._armatureDisplay._batchEnabled && this._renderDisplay !== this._rawDisplay && this._renderDisplay !== this._meshDisplay) {
                this._armatureDisplay.disableBatch();
            }

            if (this._armatureDisplay._batchEnabled) {
                const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode);
                if (!node.matrix) {
                    node.matrix = new egret.Matrix();
                }
            }
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            if (this._armatureDisplay._batchEnabled) {
                (this._armatureDisplay.$renderNode as egret.sys.GroupNode).addNode(this._renderDisplay.$renderNode);
            }
            else {
                this._armatureDisplay.addChild(this._renderDisplay);
            }
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: any): void {
            const prevDisplay = value as egret.DisplayObject;

            if (this._armatureDisplay._batchEnabled) {
                const nodes = (this._armatureDisplay.$renderNode as egret.sys.GroupNode).drawData;
                nodes[nodes.indexOf(value.$renderNode)] = this._renderDisplay.$renderNode;
            }
            else {
                this._armatureDisplay.addChild(this._renderDisplay);
                this._armatureDisplay.swapChildren(this._renderDisplay, prevDisplay);
                this._armatureDisplay.removeChild(prevDisplay);
            }
        }
        /**
         * @private
         */
        protected _removeDisplay(): void {
            if (this._armatureDisplay._batchEnabled) {
                const nodes = (this._armatureDisplay.$renderNode as egret.sys.GroupNode).drawData;
                nodes.splice(nodes.indexOf(this._renderDisplay.$renderNode), 1);
            }
            else {
                this._renderDisplay.parent.removeChild(this._renderDisplay);
            }
        }
        /**
         * @private
         */
        protected _updateZOrder(): void {
            if (this._armatureDisplay._batchEnabled) {
                const nodes = (this._armatureDisplay.$renderNode as egret.sys.GroupNode).drawData;
                nodes[this._zOrder] = this._renderDisplay.$renderNode;
            }
            else {
                const index = this._armatureDisplay.getChildIndex(this._renderDisplay);
                if (index === this._zOrder) {
                    return;
                }

                this._armatureDisplay.addChildAt(this._renderDisplay, this._zOrder);
            }
        }
        /**
         * @internal
         * @private
         */
        public _updateVisible(): void {
            if (this._armatureDisplay._batchEnabled) {
                const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode);
                node.alpha = this._parent.visible ? 1.0 : 0.0;
            }
            else {
                this._renderDisplay.visible = this._parent.visible;
            }
        }
        /**
         * @private
         */
        protected _updateBlendMode(): void {
            switch (this._blendMode) {
                case BlendMode.Normal:
                    this._renderDisplay.blendMode = egret.BlendMode.NORMAL;
                    break;

                case BlendMode.Add:
                    this._renderDisplay.blendMode = egret.BlendMode.ADD;
                    break;

                case BlendMode.Erase:
                    this._renderDisplay.blendMode = egret.BlendMode.ERASE;
                    break;

                default:
                    break;
            }

            if (this._armatureDisplay._batchEnabled) {
                const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode);
                node.blendMode = egret.sys.blendModeToNumber(this._renderDisplay.blendMode);
            }
        }
        /**
         * @private
         */
        protected _updateColor(): void {
            if (
                this._colorTransform.redMultiplier !== 1.0 ||
                this._colorTransform.greenMultiplier !== 1.0 ||
                this._colorTransform.blueMultiplier !== 1.0 ||
                this._colorTransform.redOffset !== 0 ||
                this._colorTransform.greenOffset !== 0 ||
                this._colorTransform.blueOffset !== 0 ||
                this._colorTransform.alphaOffset !== 0
            ) {
                if (this._colorFilter === null) {
                    this._colorFilter = new egret.ColorMatrixFilter();
                }

                const colorMatrix = this._colorFilter.matrix;
                colorMatrix[0] = this._colorTransform.redMultiplier;
                colorMatrix[6] = this._colorTransform.greenMultiplier;
                colorMatrix[12] = this._colorTransform.blueMultiplier;
                colorMatrix[18] = this._colorTransform.alphaMultiplier;
                colorMatrix[4] = this._colorTransform.redOffset;
                colorMatrix[9] = this._colorTransform.greenOffset;
                colorMatrix[14] = this._colorTransform.blueOffset;
                colorMatrix[19] = this._colorTransform.alphaOffset;
                this._colorFilter.matrix = colorMatrix;

                if (this._armatureDisplay._batchEnabled) {
                    const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode);
                    node.filter = this._colorFilter;
                    node.alpha = 1.0;
                }

                let filters = this._renderDisplay.filters;
                if (!filters) { // null or undefined?
                    filters = [];
                }

                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }

                this._renderDisplay.filters = filters;
                this._renderDisplay.$setAlpha(1.0);
            }
            else {
                if (this._armatureDisplay._batchEnabled) {
                    const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode);
                    node.filter = null as any;
                    node.alpha = this._colorTransform.alphaMultiplier;
                }

                this._renderDisplay.filters = null as any;
                this._renderDisplay.$setAlpha(this._colorTransform.alphaMultiplier);
            }
        }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const meshData = this._display === this._meshDisplay ? this._meshData : null;
            let currentTextureData = this._textureData as (EgretTextureData | null);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {

                if (this._armature.replacedTexture !== null && this._rawDisplayDatas.indexOf(this._displayData) >= 0) { // Update replaced texture atlas.
                    let currentTextureAtlasData = currentTextureData.parent as EgretTextureAtlasData;
                    if (this._armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = BaseObject.borrowObject(EgretTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    else {
                        currentTextureAtlasData = this._armature._replaceTextureAtlasData as EgretTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as EgretTextureData;
                }

                if (currentTextureData.renderTexture !== null) {
                    if (meshData !== null) { // Mesh.
                        const intArray = meshData.parent.parent.intArray;
                        const floatArray = meshData.parent.parent.floatArray;
                        const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                        const triangleCount = intArray[meshData.offset + BinaryOffset.MeshTriangleCount];
                        const verticesOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];
                        const uvOffset = verticesOffset + vertexCount * 2;

                        const meshDisplay = this._renderDisplay as egret.Mesh;
                        const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

                        meshNode.uvs.length = vertexCount * 2;
                        meshNode.vertices.length = vertexCount * 2;
                        meshNode.indices.length = triangleCount * 3;

                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshNode.vertices[i] = floatArray[verticesOffset + i];
                            meshNode.uvs[i] = floatArray[uvOffset + i];
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshNode.indices[i] = intArray[meshData.offset + BinaryOffset.MeshVertexIndices + i];
                        }

                        if (this._armatureDisplay._batchEnabled) {
                            const texture = currentTextureData.renderTexture;
                            const node = this._renderDisplay.$renderNode as egret.sys.MeshNode;
                            egret.sys.RenderNode.prototype.cleanBeforeRender.call(this._renderDisplay.$renderNode);
                            node.image = texture._bitmapData;

                            node.drawMesh(
                                texture._bitmapX, texture._bitmapY,
                                texture._bitmapWidth, texture._bitmapHeight,
                                texture._offsetX, texture._offsetY,
                                texture.textureWidth, texture.textureHeight
                            );

                            node.imageWidth = texture._sourceWidth;
                            node.imageHeight = texture._sourceHeight;
                        }

                        meshDisplay.texture = currentTextureData.renderTexture;
                        meshDisplay.$setAnchorOffsetX(this._pivotX);
                        meshDisplay.$setAnchorOffsetY(this._pivotY);
                        meshDisplay.$updateVertices();
                        meshDisplay.$invalidateTransform();
                    }
                    else { // Normal texture.
                        const normalDisplay = this._renderDisplay as egret.Bitmap;
                        normalDisplay.texture = currentTextureData.renderTexture;

                        if (this._armatureDisplay._batchEnabled) {
                            const texture = currentTextureData.renderTexture;
                            const node = this._renderDisplay.$renderNode as egret.sys.BitmapNode;
                            egret.sys.RenderNode.prototype.cleanBeforeRender.call(this._renderDisplay.$renderNode);
                            node.image = texture._bitmapData;

                            node.drawImage(
                                texture._bitmapX, texture._bitmapY,
                                texture._bitmapWidth, texture._bitmapHeight,
                                texture._offsetX, texture._offsetY,
                                texture.textureWidth, texture.textureHeight
                            );

                            node.imageWidth = texture._sourceWidth;
                            node.imageHeight = texture._sourceHeight;
                        }

                        normalDisplay.$setAnchorOffsetX(this._pivotX);
                        normalDisplay.$setAnchorOffsetY(this._pivotY);
                    }

                    return;
                }
            }

            if (this._armatureDisplay._batchEnabled) {
                (this._renderDisplay.$renderNode as egret.sys.BitmapNode).image = null as any;
            }

            if (meshData !== null) {
                const meshDisplay = this._renderDisplay as egret.Mesh;
                meshDisplay.$setBitmapData(null as any);
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
            }
            else {
                const normalDisplay = this._renderDisplay as egret.Bitmap;
                normalDisplay.$setBitmapData(null as any);
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
            }
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const hasFFD = this._ffdVertices.length > 0;
            const meshData = this._meshData as MeshDisplayData;
            const weight = meshData.weight;
            const meshDisplay = this._renderDisplay as egret.Mesh;
            const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

            if (weight !== null) {
                const intArray = meshData.parent.parent.intArray;
                const floatArray = meshData.parent.parent.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                const weightFloatOffset = intArray[weight.offset + BinaryOffset.WeigthFloatOffset];

                for (
                    let i = 0, iD = 0, iB = weight.offset + BinaryOffset.WeigthBoneIndices + weight.bones.length, iV = weightFloatOffset, iF = 0;
                    i < vertexCount;
                    ++i
                ) {
                    const boneCount = intArray[iB++];
                    let xG = 0.0, yG = 0.0;
                    for (let j = 0; j < boneCount; ++j) {
                        const boneIndex = intArray[iB++];
                        const bone = this._meshBones[boneIndex];
                        if (bone !== null) {
                            const matrix = bone.globalTransformMatrix;
                            const weight = floatArray[iV++];
                            let xL = floatArray[iV++];
                            let yL = floatArray[iV++];

                            if (hasFFD) {
                                xL += this._ffdVertices[iF++];
                                yL += this._ffdVertices[iF++];
                            }

                            xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                            yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        }
                    }

                    meshNode.vertices[iD++] = xG;
                    meshNode.vertices[iD++] = yG;
                }

                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
            else if (hasFFD) {
                const intArray = meshData.parent.parent.intArray;
                const floatArray = meshData.parent.parent.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                const vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

                for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                    meshNode.vertices[i] = floatArray[vertexOffset + i] + this._ffdVertices[i];
                }

                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        }
        /**
         * @private
         */
        protected _updateTransform(isSkinnedMesh: boolean): void {
            if (isSkinnedMesh) { // Identity transform.
                const transformationMatrix = this._renderDisplay.matrix;
                transformationMatrix.identity();
                this._renderDisplay.$setMatrix(transformationMatrix, this.transformUpdateEnabled);
            }
            else {
                const globalTransformMatrix = this.globalTransformMatrix;
                if (this._armatureDisplay._batchEnabled) {
                    let displayMatrix = (this._renderDisplay.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode)).matrix;
                    displayMatrix.a = globalTransformMatrix.a;
                    displayMatrix.b = globalTransformMatrix.b;
                    displayMatrix.c = globalTransformMatrix.c;
                    displayMatrix.d = globalTransformMatrix.d;
                    displayMatrix.tx = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                    displayMatrix.ty = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                }
                else if (this.transformUpdateEnabled) {
                    this._renderDisplay.$setMatrix((globalTransformMatrix as any) as egret.Matrix, true);
                }
                else {
                    const values = this._renderDisplay.$DisplayObject as any;
                    const displayMatrix = values[6];

                    displayMatrix.a = this.globalTransformMatrix.a;
                    displayMatrix.b = this.globalTransformMatrix.b;
                    displayMatrix.c = this.globalTransformMatrix.c;
                    displayMatrix.d = this.globalTransformMatrix.d;
                    displayMatrix.tx = this.globalTransformMatrix.tx;
                    displayMatrix.ty = this.globalTransformMatrix.ty;

                    this._renderDisplay.$removeFlags(8);
                    this._renderDisplay.$invalidatePosition();
                }
            }
        }
    }
}