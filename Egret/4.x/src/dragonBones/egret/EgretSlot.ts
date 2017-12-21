/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
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
     * - The egret slot.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Egret 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.EgretSlot]";
        }
        /**
         * - Whether to update the transform properties of the display object.
         * For better performance, the transform properties of display object (x, y, rotation, ScaleX, ScaleX) are not updated and need to be set to true if these properties need to be accessed correctly.
         * @default false
         * @version DragonBones 3.0
         * @language zh_CN
         */
        /**
         * - 是否更新显示对象的变换属性。
         * 为了更好的性能, 默认并不会更新显示对象的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public transformUpdateEnabled: boolean = false;

        private _armatureDisplay: EgretArmatureDisplay = null as any;
        private _renderDisplay: egret.DisplayObject = null as any;
        private _colorFilter: egret.ColorMatrixFilter | null = null;
        /**
         * @inheritDoc
         */
        public init(slotData: SlotData, displayDatas: Array<DisplayData | null> | null, rawDisplay: any, meshDisplay: any): void {
            super.init(slotData, displayDatas, rawDisplay, meshDisplay);

            if (EgretFactory._isV5) {
                this._updateTransform = this._updateTransformV5;
                this._identityTransform = this._identityTransformV5;
            }
            else {
                this._updateTransform = this._updateTransformV4;
                this._identityTransform = this._identityTransformV4;
            }
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._armatureDisplay = null as any; //
            this._renderDisplay = null as any; //
            this._colorFilter = null;
        }
        /**
         * @inheritDoc
         */
        protected _initDisplay(value: any, isRetain: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            // tslint:disable-next-line:no-unused-expression
            isRetain;
        }
        /**
         * @inheritDoc
         */
        protected _disposeDisplay(value: any, isRelease: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            // tslint:disable-next-line:no-unused-expression
            isRelease;
        }
        /**
         * @inheritDoc
         */
        protected _onUpdateDisplay(): void {
            this._armatureDisplay = this._armature.display;
            this._renderDisplay = (this._display !== null ? this._display : this._rawDisplay) as egret.DisplayObject;

            if (EgretFactory._isV5) {
                if (this._renderDisplay === this._rawDisplay && !(this._renderDisplay.$renderNode instanceof egret.sys.BitmapNode)) {
                    this._renderDisplay.$renderNode = new egret.sys.BitmapNode();
                }
            }

            if (this._armatureDisplay._batchEnabled) {
                if (this._renderDisplay !== this._rawDisplay && this._renderDisplay !== this._meshDisplay) {
                    this._armatureDisplay.disableBatch();
                }
                else {
                    const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode);
                    if (!node.matrix) {
                        node.matrix = new egret.Matrix();
                    }
                }
            }
        }
        /**
         * @inheritDoc
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
         * @inheritDoc
         */
        protected _replaceDisplay(value: any): void {
            const prevDisplay = value as egret.DisplayObject;

            if (this._armatureDisplay._batchEnabled) {
                const nodes = (this._armatureDisplay.$renderNode as egret.sys.GroupNode).drawData;
                nodes[nodes.indexOf(prevDisplay.$renderNode)] = this._renderDisplay.$renderNode;
            }
            else {
                this._armatureDisplay.addChild(this._renderDisplay);
                this._armatureDisplay.swapChildren(this._renderDisplay, prevDisplay);
                this._armatureDisplay.removeChild(prevDisplay);
            }
        }
        /**
         * @inheritDoc
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
         * @inheritDoc
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
         * @inheritDoc
         */
        public _updateVisible(): void {
            const visible = this._parent.visible && this._visible;

            if (this._armatureDisplay._batchEnabled) {
                const node = this._renderDisplay.$renderNode as (egret.sys.BitmapNode);
                node.alpha = visible ? 1.0 : 0.0;
            }
            else {
                this._renderDisplay.visible = visible;
            }
        }
        /**
         * @inheritDoc
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
         * @inheritDoc
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
         * @inheritDoc
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
                        const scale = this._armature._armatureData.scale;

                        const meshDisplay = this._renderDisplay as egret.Mesh;
                        const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

                        meshNode.uvs.length = vertexCount * 2;
                        meshNode.vertices.length = vertexCount * 2;
                        meshNode.indices.length = triangleCount * 3;

                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshNode.vertices[i] = floatArray[vertexOffset + i] * scale;
                            meshNode.uvs[i] = floatArray[uvOffset + i];
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshNode.indices[i] = intArray[meshData.offset + BinaryOffset.MeshVertexIndices + i];
                        }

                        if (this._armatureDisplay._batchEnabled) {
                            const texture = currentTextureData.renderTexture;
                            const node = this._renderDisplay.$renderNode as egret.sys.MeshNode;
                            egret.sys.RenderNode.prototype.cleanBeforeRender.call(node);

                            if (EgretFactory._isV5) {
                                node.image = (texture as any)["$bitmapData"];
                            }
                            else {
                                node.image = texture._bitmapData;
                            }

                            if (EgretFactory._isV5) {
                                node.image = (texture as any)["$bitmapData"];
                                node.drawMesh(
                                    (texture as any).$bitmapX, (texture as any).$bitmapY,
                                    (texture as any).$bitmapWidth, (texture as any).$bitmapHeight,
                                    (texture as any).$offsetX, (texture as any).$offsetY,
                                    texture.textureWidth, texture.textureHeight
                                );

                                node.imageWidth = (texture as any).$sourceWidth;
                                node.imageHeight = (texture as any).$sourceHeight;
                            }
                            else {
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

                            this._blendModeDirty = true;
                            this._colorDirty = true;
                        }

                        meshDisplay.texture = currentTextureData.renderTexture;
                        meshDisplay.$setAnchorOffsetX(this._pivotX);
                        meshDisplay.$setAnchorOffsetY(this._pivotY);
                        meshDisplay.$updateVertices();

                        if (!EgretFactory._isV5) {
                            meshDisplay.$invalidateTransform();
                        }

                        const isSkinned = (this._meshData as MeshDisplayData).weight !== null;
                        const isSurface = this._parent._boneData.type !== BoneType.Bone;
                        if (isSkinned || isSurface) {
                            this._identityTransform();
                        }
                    }
                    else { // Normal texture.
                        const scale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        const textureWidth = (currentTextureData.rotated ? currentTextureData.region.height : currentTextureData.region.width) * scale;
                        const textureHeight = (currentTextureData.rotated ? currentTextureData.region.width : currentTextureData.region.height) * scale;
                        const normalDisplay = this._renderDisplay as egret.Bitmap;
                        const texture = currentTextureData.renderTexture;
                        normalDisplay.texture = texture;

                        if (this._armatureDisplay._batchEnabled) {
                            const node = this._renderDisplay.$renderNode as egret.sys.BitmapNode;
                            egret.sys.RenderNode.prototype.cleanBeforeRender.call(node);

                            if (EgretFactory._isV5) {
                                node.image = (texture as any)["$bitmapData"];
                                node.drawImage(
                                    (texture as any).$bitmapX, (texture as any).$bitmapY,
                                    (texture as any).$bitmapWidth, (texture as any).$bitmapHeight,
                                    (texture as any).$offsetX, (texture as any).$offsetY,
                                    textureWidth, textureHeight
                                );

                                node.imageWidth = (texture as any).$sourceWidth;
                                node.imageHeight = (texture as any).$sourceHeight;
                            }
                            else {
                                node.image = texture._bitmapData;
                                node.drawImage(
                                    texture._bitmapX, texture._bitmapY,
                                    texture._bitmapWidth, texture._bitmapHeight,
                                    texture._offsetX, texture._offsetY,
                                    textureWidth, textureHeight
                                );

                                node.imageWidth = texture._sourceWidth;
                                node.imageHeight = texture._sourceHeight;
                            }

                            this._blendModeDirty = true;
                            this._colorDirty = true;
                        }
                        else {
                            normalDisplay.width = textureWidth;
                            normalDisplay.height = textureHeight;
                        }

                        normalDisplay.$setAnchorOffsetX(this._pivotX);
                        normalDisplay.$setAnchorOffsetY(this._pivotY);
                    }

                    this._visibleDirty = true;

                    return;
                }
            }

            if (this._armatureDisplay._batchEnabled) {
                (this._renderDisplay.$renderNode as egret.sys.BitmapNode).image = null as any;
            }

            const normalDisplay = this._renderDisplay as egret.Bitmap;
            normalDisplay.$setBitmapData(null as any);
            normalDisplay.x = 0.0;
            normalDisplay.y = 0.0;
            normalDisplay.visible = false;
        }
        /**
         * @inheritDoc
         */
        protected _updateMesh(): void {
            const scale = this._armature._armatureData.scale;
            const meshData = this._meshData as MeshDisplayData;
            const hasDeform = this._deformVertices.length > 0 && meshData.inheritDeform;
            const weight = meshData.weight;
            const meshDisplay = this._renderDisplay as egret.Mesh;
            const meshNode = meshDisplay.$renderNode as egret.sys.MeshNode;

            if (weight !== null) {
                const data = meshData.parent.parent.parent;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                let weightFloatOffset = intArray[weight.offset + BinaryOffset.WeigthFloatOffset];

                if (weightFloatOffset < 0) {
                    weightFloatOffset += 65536; // Fixed out of bouds bug. 
                }

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
                            let xL = floatArray[iV++] * scale;
                            let yL = floatArray[iV++] * scale;

                            if (hasDeform) {
                                xL += this._deformVertices[iF++];
                                yL += this._deformVertices[iF++];
                            }

                            xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                            yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        }
                    }

                    meshNode.vertices[iD++] = xG;
                    meshNode.vertices[iD++] = yG;
                }

                meshDisplay.$updateVertices();

                if (!EgretFactory._isV5) {
                    meshDisplay.$invalidateTransform();
                }
            }
            else if (hasDeform) {
                const isSurface = this._parent._boneData.type !== BoneType.Bone;
                // const isGlue = meshData.glue !== null; TODO
                const data = meshData.parent.parent.parent;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
                let vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

                if (vertexOffset < 0) {
                    vertexOffset += 65536; // Fixed out of bouds bug. 
                }

                for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                    const x = floatArray[vertexOffset + i] * scale + this._deformVertices[i];
                    const y = floatArray[vertexOffset + i + 1] * scale + this._deformVertices[i + 1];

                    if (isSurface) {
                        const matrix = (this._parent as Surface)._getGlobalTransformMatrix(x, y);
                        meshNode.vertices[i] = matrix.a * x + matrix.c * y + matrix.tx;
                        meshNode.vertices[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                    else {
                        meshNode.vertices[i] = x;
                        meshNode.vertices[i + 1] = y;
                    }
                }

                meshDisplay.$updateVertices();

                if (!EgretFactory._isV5) {
                    meshDisplay.$invalidateTransform();
                }
            }

            if (this._armatureDisplay._batchEnabled) {
                this._armatureDisplay._childDirty = true;
            }
        }
        /**
         * @inheritDoc
         */
        public _updateGlueMesh(): void {
            const glue = (this._meshData as MeshDisplayData).glue as GlueData;
            const weights = glue.weights;
            const meshes = glue.meshes;
            const meshDisplay = this._renderDisplay as egret.Mesh;
            const vertices = (meshDisplay.$renderNode as egret.sys.MeshNode).vertices;

            for (let i = 0, l = weights.length;
                i < l;
                ++i
            ) {
                const iV = weights[i];
                const meshCount = weights[i++];
                let totalWeight = 1.0;
                let x = 0.0;
                let y = 0.0;

                for (let j = 0; j < meshCount; ++j) {
                    const iM = weights[i++];
                    const iMV = weights[i++] * 2;
                    const weight = weights[i++];
                    const slot = this._meshSlots[iM];
                    const mesh = meshes[iM];
                    totalWeight -= weight;

                    if (slot !== null && mesh !== null && slot._meshData !== null && slot._meshData.offset === mesh.offset) {
                        const glueVertices = ((slot.display as egret.Mesh).$renderNode as egret.sys.MeshNode).vertices;
                        x += glueVertices[iMV] * weight;
                        y += glueVertices[iMV + 1] * weight;
                    }
                }

                vertices[iV] = x + vertices[iV] * totalWeight;
                vertices[iV + 1] = y + vertices[iV + 1] * totalWeight;
            }

            meshDisplay.$updateVertices();

            if (!EgretFactory._isV5) {
                meshDisplay.$invalidateTransform();
            }
        }
        /**
         * @inheritDoc
         */
        protected _updateTransform(): void {
            throw new Error();
        }
        /**
         * @inheritDoc
         */
        protected _identityTransform(): void {
            throw new Error();
        }

        private _identityTransformV4(): void {
            if (this._armatureDisplay._batchEnabled) {
                this._armatureDisplay._childDirty = true;
                let displayMatrix = (this._renderDisplay.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode)).matrix;
                displayMatrix.a = 1.0;
                displayMatrix.b = 0.0;
                displayMatrix.c = 0.0;
                displayMatrix.d = 1.0;
                displayMatrix.tx = 0.0;
                displayMatrix.ty = 0.0;
            }
            else {
                egret.$TempMatrix.identity();
                this._renderDisplay.$setMatrix(egret.$TempMatrix, this.transformUpdateEnabled);
            }
        }

        private _identityTransformV5(): void {
            egret.$TempMatrix.identity();
            this._renderDisplay.$setMatrix(egret.$TempMatrix, this.transformUpdateEnabled);
        }

        private _updateTransformV4(): void {
            const globalTransformMatrix = this.globalTransformMatrix;
            if (this._armatureDisplay._batchEnabled) {
                this._armatureDisplay._childDirty = true;
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

        private _updateTransformV5(): void {
            const globalTransformMatrix = this.globalTransformMatrix;
            if (this._armatureDisplay._batchEnabled) {
                this._armatureDisplay._childDirty = true;
                let displayMatrix = (this._renderDisplay.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode)).matrix;
                displayMatrix.a = globalTransformMatrix.a;
                displayMatrix.b = globalTransformMatrix.b;
                displayMatrix.c = globalTransformMatrix.c;
                displayMatrix.d = globalTransformMatrix.d;
                displayMatrix.tx = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                displayMatrix.ty = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
            }
            else {
                this._renderDisplay.$setMatrix((globalTransformMatrix as any) as egret.Matrix, this.transformUpdateEnabled);
            }
        }
    }
}