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

        private _renderDisplay: egret.DisplayObject = null as any;
        private _colorFilter: egret.ColorMatrixFilter | null = null;
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

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
            this._renderDisplay = (this._display !== null ? this._display : this._rawDisplay) as egret.DisplayObject;
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = this._armature.display as EgretArmatureDisplay;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as EgretArmatureDisplay;
            const prevDisplay = value as egret.DisplayObject;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        }
        /**
         * @private
         */
        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _updateZOrder(): void {
            const container = this._armature.display as EgretArmatureDisplay;
            const index = container.getChildIndex(this._renderDisplay);
            if (index === this._zOrder) {
                return;
            }

            container.addChildAt(this._renderDisplay, this._zOrder);
        }
        /**
         * @internal
         * @private
         */
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible && this._visible;
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

                let filters = this._renderDisplay.filters;
                if (!filters) { // null or undefined?
                    filters = [];
                }

                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }

                this._renderDisplay.$setAlpha(1.0);
                this._renderDisplay.filters = filters;
            }
            else {
                if (this._colorFilter !== null) {
                    this._colorFilter = null;
                    this._renderDisplay.filters = null as any;
                }

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
                if (this._armature.replacedTexture !== null && this._rawDisplayDatas !== null && this._rawDisplayDatas.indexOf(this._displayData) >= 0) { // Update replaced texture atlas.
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
                        const data = meshData.parent.parent.parent;
                        const intArray = data.intArray;
                        const floatArray = data.floatArray;
                        const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                        const triangleCount = intArray[meshData.offset + BinaryOffset.MeshTriangleCount];
                        let vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

                        if (vertexOffset < 0) {
                            vertexOffset += 65536; // Fixed out of bouds bug. 
                        }

                        const uvOffset = vertexOffset + vertexCount * 2;

                        const meshDisplay = this._renderDisplay as egret.Mesh;
                        const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

                        meshNode.uvs.length = vertexCount * 2;
                        meshNode.vertices.length = vertexCount * 2;
                        meshNode.indices.length = triangleCount * 3;

                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshNode.vertices[i] = floatArray[vertexOffset + i];
                            meshNode.uvs[i] = floatArray[uvOffset + i];
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshNode.indices[i] = intArray[meshData.offset + BinaryOffset.MeshVertexIndices + i];
                        }

                        meshDisplay.texture = currentTextureData.renderTexture;
                        meshDisplay.$setAnchorOffsetX(this._pivotX);
                        meshDisplay.$setAnchorOffsetY(this._pivotY);
                        meshDisplay.$updateVertices();
                    }
                    else { // Normal texture.
                        const scale = currentTextureData.parent.scale;
                        const normalDisplay = this._renderDisplay as egret.Bitmap;
                        const texture = currentTextureData.renderTexture;
                        normalDisplay.texture = texture;
                        normalDisplay.width = texture.textureWidth * scale;
                        normalDisplay.height = texture.textureHeight * scale;
                        normalDisplay.$setAnchorOffsetX(this._pivotX);
                        normalDisplay.$setAnchorOffsetY(this._pivotY);
                    }

                    this._visibleDirty = true;

                    return;
                }
            }

            const normalDisplay = this._renderDisplay as egret.Bitmap;
            normalDisplay.texture = null as any;
            normalDisplay.x = 0.0;
            normalDisplay.y = 0.0;
            normalDisplay.visible = false;
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const hasFFD = this._ffdVertices.length > 0;
            const scale = this._armature.armatureData.scale;
            const meshData = this._meshData as MeshDisplayData;
            const weightData = meshData.weight;
            const meshDisplay = this._renderDisplay as egret.Mesh;
            const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

            if (weightData !== null) {
                const data = meshData.parent.parent.parent;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                let weightFloatOffset = intArray[weightData.offset + BinaryOffset.WeigthFloatOffset];

                if (weightFloatOffset < 0) {
                    weightFloatOffset += 65536; // Fixed out of bouds bug. 
                }

                for (
                    let i = 0, iD = 0, iB = weightData.offset + BinaryOffset.WeigthBoneIndices + weightData.bones.length, iV = weightFloatOffset, iF = 0;
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
                            let xL = floatArray[iV++] * scale;
                            let yL = floatArray[iV++] * scale;

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
            }
            else if (hasFFD) {
                const data = meshData.parent.parent.parent;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                let vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

                if (vertexOffset < 0) {
                    vertexOffset += 65536; // Fixed out of bouds bug. 
                }

                for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                    meshNode.vertices[i] = floatArray[vertexOffset + i] * scale + this._ffdVertices[i];
                }

                meshDisplay.$updateVertices();
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
                this._renderDisplay.$setMatrix((globalTransformMatrix as any) as egret.Matrix, this.transformUpdateEnabled);
            }
        }
    }
}