namespace dragonBones {
    /**
     * Pixi 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class PixiSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.PixiSlot]";
        }

        private _renderDisplay: PIXI.DisplayObject;
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            this._updateTransform = PIXI.VERSION[0] === "3" ? this._updateTransformV3 : this._updateTransformV4;
            this._renderDisplay = null as any;
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
            (value as PIXI.DisplayObject).destroy();
        }
        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay) as PIXI.DisplayObject;
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = this._armature.display as PixiArmatureDisplay;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as PixiArmatureDisplay;
            const prevDisplay = value as PIXI.DisplayObject;
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
            const container = this._armature.display as PixiArmatureDisplay;
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
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.NORMAL;
                    break;

                case BlendMode.Add:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.ADD;
                    break;

                case BlendMode.Darken:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.DARKEN;
                    break;

                case BlendMode.Difference:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.DIFFERENCE;
                    break;

                case BlendMode.HardLight:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
                    break;

                case BlendMode.Lighten:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.LIGHTEN;
                    break;

                case BlendMode.Multiply:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.MULTIPLY;
                    break;

                case BlendMode.Overlay:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.OVERLAY;
                    break;

                case BlendMode.Screen:
                    (this._renderDisplay as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.SCREEN;
                    break;

                default:
                    break;
            }
        }
        /**
         * @private
         */
        protected _updateColor(): void {
            this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
            // TODO
        }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const meshData = this._display === this._meshDisplay ? this._meshData : null;
            let currentTextureData = this._textureData as (PixiTextureData | null);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as PixiTextureAtlasData;
                if (this._armature.replacedTexture !== null && this._rawDisplayDatas.indexOf(this._displayData) >= 0) { // Update replaced texture atlas.
                    if (this._armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = BaseObject.borrowObject(PixiTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    else {
                        currentTextureAtlasData = this._armature._replaceTextureAtlasData as PixiTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as PixiTextureData;
                }

                const renderTexture = currentTextureData.renderTexture;
                if (renderTexture !== null) {
                    const currentTextureAtlas = currentTextureData.renderTexture as PIXI.Texture;
                    if (meshData !== null) { // Mesh.
                        const data = meshData.parent.parent;
                        const intArray = data.intArray;
                        const floatArray = data.floatArray;
                        const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                        const triangleCount = intArray[meshData.offset + BinaryOffset.MeshTriangleCount];
                        const verticesOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];
                        const uvOffset = verticesOffset + vertexCount * 2;

                        const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;
                        const textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
                        const textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;

                        meshDisplay.vertices = new Float32Array(vertexCount * 2) as any;
                        meshDisplay.uvs = new Float32Array(vertexCount * 2) as any;
                        meshDisplay.indices = new Uint16Array(triangleCount * 3) as any;
                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshDisplay.vertices[i] = floatArray[verticesOffset + i];
                            meshDisplay.uvs[i] = floatArray[uvOffset + i];
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshDisplay.indices[i] = intArray[meshData.offset + BinaryOffset.MeshVertexIndices + i];
                        }

                        for (let i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                            const u = meshDisplay.uvs[i];
                            const v = meshDisplay.uvs[i + 1];
                            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
                            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
                        }

                        meshDisplay.texture = renderTexture as any;
                        //meshDisplay.dirty = true; // Pixi 3.x
                        meshDisplay.dirty++; // Pixi 4.x Can not support change mesh vertice count.
                    }
                    else { // Normal texture.
                        const normalDisplay = this._renderDisplay as PIXI.Sprite;
                        normalDisplay.texture = renderTexture;
                    }

                    this._updateVisible();
                    return;
                }
            }

            if (meshData !== null) {
                const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;
                meshDisplay.texture = null as any;
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
                meshDisplay.visible = false;
            }
            else {
                const normalDisplay = this._renderDisplay as PIXI.Sprite;
                normalDisplay.texture = null as any;
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
                normalDisplay.visible = false;
            }
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const hasFFD = this._ffdVertices.length > 0;
            const meshData = this._meshData as MeshDisplayData;
            const weight = meshData.weight;
            const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;

            if (weight !== null) {
                const data = meshData.parent.parent;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
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

                    meshDisplay.vertices[iD++] = xG;
                    meshDisplay.vertices[iD++] = yG;
                }
            }
            else if (hasFFD) {
                const data = meshData.parent.parent;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                const vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

                for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                    meshDisplay.vertices[i] = floatArray[vertexOffset + i] + this._ffdVertices[i];
                }
            }
        }
        /**
         * @private
         */
        protected _updateTransform(isSkinnedMesh: boolean): void {
            isSkinnedMesh;
            throw new Error();
        }
        /**
         * @private
         */
        protected _updateTransformV3(isSkinnedMesh: boolean): void {
            if (isSkinnedMesh) { // Identity transform.
                this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
            }
            else {
                this.updateGlobalTransform(); // Update transform.

                const transform = this.global;
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);

                if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                    this._renderDisplay.setTransform(
                        x, y,
                        transform.scaleX, transform.scaleY,
                        transform.rotation,
                        transform.skew, 0.0,
                    );
                }
                else {
                    this._renderDisplay.position.set(x, y);
                    this._renderDisplay.rotation = transform.rotation;
                    this._renderDisplay.skew.set(-transform.skew, 0.0);
                    this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
                }
            }
        }
        /**
         * @private
         */
        protected _updateTransformV4(isSkinnedMesh: boolean): void {
            if (isSkinnedMesh) { // Identity transform.
                this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
            }
            else {
                this.updateGlobalTransform(); // Update transform.

                const transform = this.global;

                if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                    this._renderDisplay.setTransform(
                        transform.x, transform.y,
                        transform.scaleX, transform.scaleY,
                        transform.rotation,
                        -transform.skew, 0.0,
                        this._pivotX, this._pivotY
                    );
                }
                else {
                    const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                    const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                    this._renderDisplay.position.set(x, y);
                    this._renderDisplay.rotation = transform.rotation;
                    this._renderDisplay.skew.set(-transform.skew, 0.0);
                    this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
                }
            }
        }
    }
}