/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
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
     * - The Phaser slot.
     * @version DragonBones 5.6
     * @language en_US
     */
    /**
     * - Phaser 插槽。
     * @version DragonBones 5.6
     * @language zh_CN
     */
    export class PhaserSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.PhaserSlot]";
        }

        private _textureScale: number;
        private _renderDisplay:
            Phaser.GameObjects.GameObject &
            Phaser.GameObjects.Components.Visible &
            Phaser.GameObjects.Components.BlendMode &
            Phaser.GameObjects.Components.Alpha &
            Phaser.GameObjects.Components.Texture &
            Phaser.GameObjects.Components.Transform;

        protected _onClear(): void {
            super._onClear();

            this._textureScale = 1.0;
            this._renderDisplay = null as any;
        }

        protected _initDisplay(_value: any, _isRetain: boolean): void {
        }

        protected _disposeDisplay(value: any, isRelease: boolean): void {
            if (!isRelease) {
                (value as Phaser.GameObjects.GameObject).destroy();
            }
        }

        protected _onUpdateDisplay(): void {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        }

        protected _addDisplay(): void {
            const container = this._armature.display as PhaserArmatureDisplay;
            container.add(this._renderDisplay);
        }

        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as PhaserArmatureDisplay;
            const prevDisplay = value as Phaser.GameObjects.GameObject;
            container.add(this._renderDisplay);
            container.swap(this._renderDisplay, prevDisplay);
            container.remove(prevDisplay);
            this._textureScale = 1.0;
        }

        protected _removeDisplay(): void {
            this._renderDisplay.parentContainer.remove(this._renderDisplay);
        }

        protected _updateZOrder(): void {
            const container = this._armature.display as PhaserArmatureDisplay;
            const index = container.getIndex(this._renderDisplay);
            if (index === this._zOrder) {
                return;
            }

            container.addAt(this._renderDisplay, this._zOrder);
        }
        /**
         * @internal
         */
        public _updateVisible(): void {
            this._renderDisplay.setVisible(this._parent.visible && this._visible);
        }

        protected _updateBlendMode(): void {
            switch (this._blendMode) {
                case BlendMode.Normal:
                    this._renderDisplay.blendMode = Phaser.BlendModes.NORMAL;
                    break;

                case BlendMode.Add:
                    this._renderDisplay.blendMode = Phaser.BlendModes.ADD;
                    break;

                case BlendMode.Darken:
                    this._renderDisplay.blendMode = Phaser.BlendModes.DARKEN;
                    break;

                case BlendMode.Difference:
                    this._renderDisplay.blendMode = Phaser.BlendModes.DIFFERENCE;
                    break;

                case BlendMode.HardLight:
                    this._renderDisplay.blendMode = Phaser.BlendModes.HARD_LIGHT;
                    break;

                case BlendMode.Lighten:
                    this._renderDisplay.blendMode = Phaser.BlendModes.LIGHTEN;
                    break;

                case BlendMode.Multiply:
                    this._renderDisplay.blendMode = Phaser.BlendModes.MULTIPLY;
                    break;

                case BlendMode.Overlay:
                    this._renderDisplay.blendMode = Phaser.BlendModes.OVERLAY;
                    break;

                case BlendMode.Screen:
                    this._renderDisplay.blendMode = Phaser.BlendModes.SCREEN;
                    break;

                default:
                    break;
            }
            // TODO child armature.
        }

        protected _updateColor(): void {
            const alpha = this._colorTransform.alphaMultiplier * this._globalAlpha;
            this._renderDisplay.setAlpha(alpha);

            // TODO color.
            // TODO child armature.
        }

        protected _updateFrame(): void {
            let currentTextureData = this._textureData as (PhaserTextureData | null);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as PhaserTextureAtlasData;

                if (this._armature.replacedTexture !== null) { // Update replaced texture atlas.
                    if (this._armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = BaseObject.borrowObject(PhaserTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    else {
                        currentTextureAtlasData = this._armature._replaceTextureAtlasData as PhaserTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as PhaserTextureData;
                }

                const renderTexture = currentTextureData.renderTexture;
                if (renderTexture !== null) {
                    if (this._geometryData !== null) { // Mesh.
                        const data = this._geometryData.data;
                        const intArray = data.intArray;
                        const floatArray = data.floatArray;
                        const vertexCount = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexCount];
                        const triangleCount = intArray[this._geometryData.offset + BinaryOffset.GeometryTriangleCount];
                        let vertexOffset = intArray[this._geometryData.offset + BinaryOffset.GeometryFloatOffset];

                        if (vertexOffset < 0) {
                            vertexOffset += 65536; // Fixed out of bounds bug. 
                        }

                        const uvOffset = vertexOffset + vertexCount * 2;
                        const scale = this._armature._armatureData.scale;

                        const meshDisplay = this._renderDisplay as Phaser.GameObjects.Mesh;
                        meshDisplay.vertices = new Float32Array(vertexCount * 2);
                        meshDisplay.uv = new Float32Array(vertexCount * 2);
                        meshDisplay.indices = new Uint16Array(triangleCount * 2); // Phaser3 do not have indices.

                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshDisplay.vertices[i] = floatArray[vertexOffset + i] * scale;
                            meshDisplay.uv[i] = floatArray[uvOffset + i];
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshDisplay.indices[i] = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexIndices + i];
                        }

                        meshDisplay.setTexture(currentTextureAtlasData.name, currentTextureData.name);

                        const isSkinned = this._geometryData.weight !== null;
                        const isSurface = this._parent._boneData.type !== BoneType.Bone;
                        if (isSkinned || isSurface) {
                            this._identityTransform();
                        }
                    }
                    else { // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        this._renderDisplay.setTexture(currentTextureAtlasData.name, currentTextureData.name);
                    }

                    this._visibleDirty = true;
                    return;
                }
            }

            const normalDisplay = this._renderDisplay;
            normalDisplay.x = 0.0;
            normalDisplay.y = 0.0;
            normalDisplay.setVisible(false);
        }

        protected _updateMesh(): void {
            const scale = this._armature._armatureData.scale;
            const deformVertices = (this._displayFrame as DisplayFrame).deformVertices;
            const bones = this._geometryBones;
            const geometryData = this._geometryData as GeometryData;
            const weightData = geometryData.weight;

            const hasDeform = deformVertices.length > 0 && geometryData.inheritDeform;
            const meshDisplay = this._renderDisplay as Phaser.GameObjects.Mesh;

            if (weightData !== null) {
                const data = geometryData.data;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[geometryData.offset + BinaryOffset.GeometryVertexCount];
                let weightFloatOffset = intArray[weightData.offset + BinaryOffset.WeigthFloatOffset];

                if (weightFloatOffset < 0) {
                    weightFloatOffset += 65536; // Fixed out of bounds bug. 
                }

                for (
                    let i = 0, iD = 0, iB = weightData.offset + BinaryOffset.WeigthBoneIndices + bones.length, iV = weightFloatOffset, iF = 0;
                    i < vertexCount;
                    ++i
                ) {
                    const boneCount = intArray[iB++];
                    let xG = 0.0, yG = 0.0;

                    for (let j = 0; j < boneCount; ++j) {
                        const boneIndex = intArray[iB++];
                        const bone = bones[boneIndex];

                        if (bone !== null) {
                            const matrix = bone.globalTransformMatrix;
                            const weight = floatArray[iV++];
                            let xL = floatArray[iV++] * scale;
                            let yL = floatArray[iV++] * scale;

                            if (hasDeform) {
                                xL += deformVertices[iF++];
                                yL += deformVertices[iF++];
                            }

                            xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                            yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        }
                    }

                    meshDisplay.vertices[iD++] = xG;
                    meshDisplay.vertices[iD++] = yG;
                }
            }
            else {
                const isSurface = this._parent._boneData.type !== BoneType.Bone;
                const data = geometryData.data;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[geometryData.offset + BinaryOffset.GeometryVertexCount];
                let vertexOffset = intArray[geometryData.offset + BinaryOffset.GeometryFloatOffset];

                if (vertexOffset < 0) {
                    vertexOffset += 65536; // Fixed out of bounds bug. 
                }

                for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                    let x = floatArray[vertexOffset + i] * scale;
                    let y = floatArray[vertexOffset + i + 1] * scale;

                    if (hasDeform) {
                        x += deformVertices[i];
                        y += deformVertices[i + 1];
                    }

                    if (isSurface) {
                        const matrix = (this._parent as Surface)._getGlobalTransformMatrix(x, y);
                        meshDisplay.vertices[i] = matrix.a * x + matrix.c * y + matrix.tx;
                        meshDisplay.vertices[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                    else {
                        meshDisplay.vertices[i] = x;
                        meshDisplay.vertices[i + 1] = y;
                    }
                }
            }
        }

        protected _updateTransform(): void {
            this.updateGlobalTransform(); // Update transform.

            const transform = this.global;

            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);

                this._renderDisplay.x = x;
                this._renderDisplay.y = y;
            }
            else {
                this._renderDisplay.x = transform.x;
                this._renderDisplay.y = transform.y;
            }

            this._renderDisplay.rotation = transform.rotation;
            // (this._renderDisplay as any).skew = transform.skew; // Phase can not support skew.
            this._renderDisplay.setScale(transform.scaleX * this._textureScale, transform.scaleY * this._textureScale);
        }

        protected _identityTransform(): void {
            this._renderDisplay.setPosition();
            this._renderDisplay.setRotation();
            this._renderDisplay.setScale(1.0, 1.0);
            // TODO Phase can not support skew.
        }
    }
}
