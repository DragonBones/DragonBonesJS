namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    export class EgretSlot extends Slot {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EgretSlot]";
        }

        /**
         * @language zh_CN
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         */
        public transformUpdateEnabled: boolean;

        private _renderDisplay: egret.DisplayObject;
        private _colorFilter: egret.ColorMatrixFilter;

        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        public constructor() {
            super();
        }

        private _createTexture(textureData: EgretTextureData, textureAtlas: egret.BitmapData): egret.Texture {
            const textureAtlasWidth = textureAtlas.width;
            const textureAtlasHeight = textureAtlas.height;
            const subTextureWidth = Math.min(textureData.region.width, textureAtlasWidth - textureData.region.x); // TODO need remove
            const subTextureHeight = Math.min(textureData.region.height, textureAtlasHeight - textureData.region.y); // TODO need remove

            const texture = new egret.Texture();
            texture._bitmapData = textureAtlas;
            texture.$initData(
                textureData.region.x, textureData.region.y,
                subTextureWidth, subTextureHeight,
                0, 0,
                subTextureWidth, subTextureHeight,
                textureAtlasWidth, textureAtlasHeight
            );

            return texture;
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.transformUpdateEnabled = false;

            this._renderDisplay = null;
            this._colorFilter = null;
        }

        /**
         * @private
         */
        protected _initDisplay(value: any): void {
        }
        /**
         * @private
         */
        protected _disposeDisplay(value: any): void {
        }
        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            if (!this._rawDisplay) {
                this._rawDisplay = new egret.Bitmap();
            }

            this._renderDisplay = (this._display || this._rawDisplay) as egret.DisplayObject;
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = this._armature._display as EgretArmatureDisplay;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: any): void {
            const container = this._armature._display as EgretArmatureDisplay;
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
            const container = this._armature._display as EgretArmatureDisplay;
            container.addChildAt(this._renderDisplay, this._zOrder);
        }
        /**
         * @internal
         * @private
         */
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible;
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
                this._colorTransform.redMultiplier != 1 ||
                this._colorTransform.greenMultiplier != 1 ||
                this._colorTransform.blueMultiplier != 1 ||
                this._colorTransform.redOffset != 0 ||
                this._colorTransform.greenOffset != 0 ||
                this._colorTransform.blueOffset != 0 ||
                this._colorTransform.alphaOffset != 0
            ) {
                if (!this._colorFilter) {
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
                if (!filters) {
                    filters = [];
                }

                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }

                this._renderDisplay.filters = filters;
            }
            else {
                if (this._colorFilter) {
                    this._colorFilter = null;
                    this._renderDisplay.filters = null;
                }

                this._renderDisplay.$setAlpha(this._colorTransform.alphaMultiplier);
            }
        }
        /**
         * @private
         */
        protected _updateFilters(): void { }
        /**
         * @private
         */
        protected _updateFrame(): void {
            if (this._display && this._displayIndex >= 0) {
                const rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                const replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                const currentDisplayData = replacedDisplayData || rawDisplayData;
                const currentTextureData = currentDisplayData.texture as EgretTextureData;
                if (currentTextureData) {
                    const currentTextureAtlasData = currentTextureData.parent as EgretTextureAtlasData;
                    const replacedTextureAtlas = this._armature.replacedTexture ? (this._armature.replacedTexture as egret.Texture)._bitmapData : null;
                    const currentTextureAtlas = (replacedTextureAtlas && currentDisplayData.texture.parent == rawDisplayData.texture.parent) ?
                        replacedTextureAtlas : (currentTextureAtlasData.texture ? currentTextureAtlasData.texture._bitmapData : null);
                    if (currentTextureAtlas) {
                        let currentTexture = currentTextureData.texture;

                        if (currentTextureAtlas == replacedTextureAtlas) {
                            const armatureDisplay = this._armature._display as EgretArmatureDisplay;
                            const textureName = currentTextureData.name;
                            currentTexture = armatureDisplay._subTextures[textureName];
                            if (!currentTexture) {
                                currentTexture = this._createTexture(currentTextureData, currentTextureAtlas);
                                armatureDisplay._subTextures[textureName] = currentTexture;
                            }
                        }
                        else if (!currentTextureData.texture) {
                            currentTexture = this._createTexture(currentTextureData, currentTextureAtlas);
                            currentTextureData.texture = currentTexture;
                        }

                        this._updatePivot(rawDisplayData, currentDisplayData, currentTextureData);

                        if (this._meshData && this._display == this._meshDisplay) { // Mesh.
                            const meshDisplay = this._meshDisplay as egret.Mesh;
                            const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

                            meshNode.uvs.length = 0;
                            meshNode.vertices.length = 0;
                            meshNode.indices.length = 0;

                            for (let i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                                meshNode.uvs[i] = this._meshData.uvs[i];
                                meshNode.vertices[i] = this._meshData.vertices[i];
                            }

                            for (let i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                                meshNode.indices[i] = this._meshData.vertexIndices[i];
                            }

                            meshDisplay.$setBitmapData(currentTexture);
                            meshDisplay.$setAnchorOffsetX(this._pivotX);
                            meshDisplay.$setAnchorOffsetY(this._pivotY);

                            meshDisplay.$updateVertices();
                            meshDisplay.$invalidateTransform();

                            // Identity transform.
                            if (this._meshData.skinned) {
                                const transformationMatrix = meshDisplay.matrix;
                                transformationMatrix.identity();
                                meshDisplay.matrix = transformationMatrix;
                            }
                        }
                        else { // Normal texture.
                            const frameDisplay = this._display as egret.Bitmap;
                            frameDisplay.$setBitmapData(currentTexture);
                            frameDisplay.$setAnchorOffsetX(this._pivotX);
                            frameDisplay.$setAnchorOffsetY(this._pivotY);
                        }

                        this._updateVisible();

                        return;
                    }
                }
            }

            this._pivotX = 0;
            this._pivotY = 0;

            const frameDisplay = this._renderDisplay as egret.Bitmap;
            frameDisplay.visible = false;
            frameDisplay.$setBitmapData(null);
            frameDisplay.$setAnchorOffsetX(this._pivotX);
            frameDisplay.$setAnchorOffsetY(this._pivotY);
            frameDisplay.x = this.origin.x;
            frameDisplay.y = this.origin.y;
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const meshDisplay = this._meshDisplay as egret.Mesh;
            const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;
            const hasFFD = this._ffdVertices.length > 0;

            if (this._meshData.skinned) {
                for (let i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    let iH = i / 2;

                    const boneIndices = this._meshData.boneIndices[iH];
                    const boneVertices = this._meshData.boneVertices[iH];
                    const weights = this._meshData.weights[iH];

                    let xG = 0, yG = 0;

                    for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        const bone = this._meshBones[boneIndices[iB]];
                        const matrix = bone.globalTransformMatrix;
                        const weight = weights[iB];

                        let xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }

                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;

                        iF += 2;
                    }

                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }

                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
            else if (hasFFD) {
                const vertices = this._meshData.vertices;
                for (let i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    const xG = vertices[i] + this._ffdVertices[i];
                    const yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }

                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        }
        /**
         * @private
         */
        protected _updateTransform(): void {
            if (this.transformUpdateEnabled) {
                this._renderDisplay.$setMatrix(this.globalTransformMatrix as egret.Matrix, this.transformUpdateEnabled);
                this._renderDisplay.$setAnchorOffsetX(this._pivotX);
                this._renderDisplay.$setAnchorOffsetX(this._pivotY);
            }
            else {
                const values = this._renderDisplay.$DisplayObject;
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