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
            this._renderDisplay = (this._display ? this._display : this._rawDisplay) as egret.DisplayObject;
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
                this._colorTransform.redMultiplier !== 1 ||
                this._colorTransform.greenMultiplier !== 1 ||
                this._colorTransform.blueMultiplier !== 1 ||
                this._colorTransform.redOffset !== 0 ||
                this._colorTransform.greenOffset !== 0 ||
                this._colorTransform.blueOffset !== 0 ||
                this._colorTransform.alphaOffset !== 0
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
                this._renderDisplay.$setAlpha(1.0);
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
        protected _updateFrame(): void {
            const isMeshDisplay = this._meshData && this._display === this._meshDisplay;
            let currentTextureData = this._textureData as EgretTextureData;

            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                let currentTextureAtlasData = currentTextureData.parent as EgretTextureAtlasData;

                // Update replaced texture atlas.
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData as EgretTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = BaseObject.borrowObject(EgretTextureAtlasData);
                        currentTextureAtlasData.copyFrom(this._textureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as EgretTextureData;
                }

                const currentTextureAtlas = currentTextureAtlasData.texture ? currentTextureAtlasData.texture._bitmapData : null;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) { // Create texture.
                        const textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
                        const textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;
                        const subTextureWidth = Math.min(currentTextureData.region.width, textureAtlasWidth - currentTextureData.region.x); // TODO need remove
                        const subTextureHeight = Math.min(currentTextureData.region.height, textureAtlasHeight - currentTextureData.region.y); // TODO need remove

                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = currentTextureAtlas;
                        currentTextureData.texture.$initData(
                            currentTextureData.region.x, currentTextureData.region.y,
                            subTextureWidth, subTextureHeight,
                            0, 0,
                            subTextureWidth, subTextureHeight,
                            textureAtlasWidth, textureAtlasHeight
                        );
                    }

                    if (isMeshDisplay) { // Mesh.
                        const meshDisplay = this._renderDisplay as egret.Mesh;
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

                        meshDisplay.$setBitmapData(currentTextureData.texture);
                        meshDisplay.$setAnchorOffsetX(this._pivotX);
                        meshDisplay.$setAnchorOffsetY(this._pivotY);
                        meshDisplay.$updateVertices();
                        meshDisplay.$invalidateTransform();
                    }
                    else { // Normal texture.
                        const normalDisplay = this._renderDisplay as egret.Bitmap;
                        normalDisplay.$setBitmapData(currentTextureData.texture);
                        normalDisplay.$setAnchorOffsetX(this._pivotX);
                        normalDisplay.$setAnchorOffsetY(this._pivotY);
                    }

                    this._updateVisible();
                    return;
                }
            }

            if (isMeshDisplay) {
                const meshDisplay = this._renderDisplay as egret.Mesh;
                meshDisplay.$setBitmapData(null);
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
                meshDisplay.visible = false;
            }
            else {
                const normalDisplay = this._renderDisplay as egret.Bitmap;
                normalDisplay.$setBitmapData(null);
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
                normalDisplay.visible = false;
            }
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const meshDisplay = this._renderDisplay as egret.Mesh;
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
        protected _updateTransform(isSkinnedMesh: boolean): void {
            if (isSkinnedMesh) { // Identity transform.
                const transformationMatrix = this._renderDisplay.matrix;
                transformationMatrix.identity();
                this._renderDisplay.$setMatrix(transformationMatrix, this.transformUpdateEnabled);
            }
            else {
                if (this.transformUpdateEnabled) {
                    this._renderDisplay.$setMatrix((<any>this.globalTransformMatrix) as egret.Matrix, true);
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
}