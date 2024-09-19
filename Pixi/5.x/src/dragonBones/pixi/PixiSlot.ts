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
     * - The PixiJS slot.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - PixiJS 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class PixiSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.PixiSlot]";
        }

        private _textureScale: number;
        private _renderDisplay: PIXI.DisplayObject;

        protected _onClear(): void {
            super._onClear();

            this._textureScale = 1.0;
            this._renderDisplay = null as any;
            this._updateTransform = PIXI.VERSION[0] === "3" ? this._updateTransformV3 : this._updateTransformV4;
        }

        protected _initDisplay(value: any, isRetain: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            // tslint:disable-next-line:no-unused-expression
            isRetain;
        }

        protected _disposeDisplay(value: any, isRelease: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            if (!isRelease) {
                (value as PIXI.DisplayObject).destroy();
            }
        }

        protected _onUpdateDisplay(): void {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay) as PIXI.DisplayObject;
        }

        protected _addDisplay(): void {
            const container = this._armature.display as PixiArmatureDisplay;
            container.addChild(this._renderDisplay);
        }

        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as PixiArmatureDisplay;
            const prevDisplay = value as PIXI.DisplayObject;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
            this._textureScale = 1.0;
        }

        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }

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
         */
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible && this._visible;
        }

        protected _updateBlendMode(): void {
            if (this._renderDisplay instanceof PIXI.Sprite) {
                switch (this._blendMode) {
                    case BlendMode.Normal:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.NORMAL;
                        break;

                    case BlendMode.Add:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.ADD;
                        break;

                    case BlendMode.Darken:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.DARKEN;
                        break;

                    case BlendMode.Difference:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.DIFFERENCE;
                        break;

                    case BlendMode.HardLight:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
                        break;

                    case BlendMode.Lighten:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.LIGHTEN;
                        break;

                    case BlendMode.Multiply:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.MULTIPLY;
                        break;

                    case BlendMode.Overlay:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.OVERLAY;
                        break;

                    case BlendMode.Screen:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.SCREEN;
                        break;

                    default:
                        break;
                }
            }
            // TODO child armature.
        }

        protected _updateColor(): void {
            const alpha = this._colorTransform.alphaMultiplier * this._globalAlpha;
            this._renderDisplay.alpha = alpha;

            if (this._renderDisplay instanceof PIXI.Sprite || this._renderDisplay instanceof PIXI.SimpleMesh) {
                const color = (Math.round(this._colorTransform.redMultiplier * 0xFF) << 16) + (Math.round(this._colorTransform.greenMultiplier * 0xFF) << 8) + Math.round(this._colorTransform.blueMultiplier * 0xFF);
                this._renderDisplay.tint = color;
            }
            // TODO child armature.
        }

        protected _updateFrame(): void {
            let currentTextureData = this._textureData as (PixiTextureData | null);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as PixiTextureAtlasData;

                if (this._armature.replacedTexture !== null) { // Update replaced texture atlas.
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
                    if (this._geometryData !== null) { // Mesh.
                        const data = this._geometryData.data;
                        const intArray = data.intArray;
                        const floatArray = data.floatArray;
                        const vertexCount = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexCount];
                        const triangleCount = intArray[this._geometryData.offset + BinaryOffset.GeometryTriangleCount];
                        let vertexOffset = intArray[this._geometryData.offset + BinaryOffset.GeometryFloatOffset];

                        if (vertexOffset < 0) {
                            vertexOffset += 65536; // Fixed out of bouds bug.
                        }

                        const uvOffset = vertexOffset + vertexCount * 2;
                        const scale = this._armature._armatureData.scale;

                        const meshDisplay = this._renderDisplay as PIXI.SimpleMesh;

                        const vertices = new Float32Array(vertexCount * 2) as any;
                        const uvs = new Float32Array(vertexCount * 2) as any;
                        const indices = new Uint16Array(triangleCount * 3) as any;
                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            vertices[i] = floatArray[vertexOffset + i] * scale;
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            indices[i] = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexIndices + i];
                        }

                        for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                            const u = floatArray[uvOffset + i];
                            const v = floatArray[uvOffset + i + 1];

                            if (currentTextureData.rotated) {
                                uvs[i] = 1 - v;
                                uvs[i + 1] = u;
                            } else {
                                uvs[i] = u;
                                uvs[i + 1] = v;
                            }
                        }

                        this._textureScale = 1.0;
                        meshDisplay.texture = renderTexture as any;
                        meshDisplay.vertices = vertices;
                        meshDisplay.uvBuffer.update(uvs);
                        meshDisplay.geometry.addIndex(indices);

                        const isSkinned = this._geometryData.weight !== null;
                        const isSurface = this._parent._boneData.type !== BoneType.Bone;
                        if (isSkinned || isSurface) {
                            this._identityTransform();
                        }
                    }
                    else {
                        // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        const normalDisplay = this._renderDisplay as PIXI.Sprite;
                        normalDisplay.texture = renderTexture;
                    }

                    this._visibleDirty = true;

                    return;
                }
            }

            if (this._geometryData !== null) {
                const meshDisplay = this._renderDisplay as PIXI.SimpleMesh;
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

        protected _updateMesh(): void {
            const scale = this._armature._armatureData.scale;
            const deformVertices = (this._displayFrame as DisplayFrame).deformVertices;
            const bones = this._geometryBones;
            const geometryData = this._geometryData as GeometryData;
            const weightData = geometryData.weight;

            const hasDeform = deformVertices.length > 0 && geometryData.inheritDeform;
            const meshDisplay = this._renderDisplay as PIXI.SimpleMesh;

            if (weightData !== null) {
                const data = geometryData.data;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[geometryData.offset + BinaryOffset.GeometryVertexCount];
                let weightFloatOffset = intArray[weightData.offset + BinaryOffset.WeigthFloatOffset];

                if (weightFloatOffset < 0) {
                    weightFloatOffset += 65536; // Fixed out of bouds bug.
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
                    vertexOffset += 65536; // Fixed out of bouds bug.
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
            throw new Error();
        }

        protected _updateTransformV3(): void {
            this.updateGlobalTransform(); // Update transform.

            const transform = this.global;

            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.setTransform(
                    x, y,
                    transform.scaleX * this._textureScale, transform.scaleY * this._textureScale,
                    transform.rotation,
                    transform.skew, 0.0,
                );
            }
            else {
                this._renderDisplay.position.set(transform.x, transform.y);
                this._renderDisplay.rotation = transform.rotation;
                this._renderDisplay.skew.set(transform.skew, 0.0);
                this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
            }
        }

        protected _updateTransformV4(): void {
            this.updateGlobalTransform(); // Update transform.

            const transform = this.global;

            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.setTransform(
                    x, y,
                    transform.scaleX * this._textureScale, transform.scaleY * this._textureScale,
                    transform.rotation,
                    -transform.skew, 0.0
                );
            }
            else {
                this._renderDisplay.position.set(transform.x, transform.y);
                this._renderDisplay.rotation = transform.rotation;
                this._renderDisplay.skew.set(-transform.skew, 0.0);
                this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
            }
        }

        protected _identityTransform(): void {
            this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0);
        }
    }
}
