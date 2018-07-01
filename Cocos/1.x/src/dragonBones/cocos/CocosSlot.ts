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
     * - The Cocos slot.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Cocos 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class CocosSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.CocosSlot]";
        }

        private _ccMeshDirty: boolean = false;
        private _textureScale: number;
        private _renderDisplay: cc.Node;

        protected _onClear(): void {
            super._onClear();

            this._textureScale = 1.0;
            this._renderDisplay = null as any;
        }

        protected _initDisplay(_value: any, _isRetain: boolean): void {
        }

        protected _disposeDisplay(value: any, isRelease: boolean): void {
            if (!isRelease) {
                (value as cc.Node).destroy();
            }
        }

        protected _onUpdateDisplay(): void {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay) as cc.Node;
        }

        protected _addDisplay(): void {
            const container = this._armature.display as cc.Node;
            container.addChild(this._renderDisplay, this._zOrder);
        }

        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as cc.Node;
            const prevDisplay = value as cc.Node;

            if (this._renderDisplay.parent !== container) {
                container.addChild(this._renderDisplay, prevDisplay.getLocalZOrder());
            }

            // container.removeChild(prevDisplay, false);
            this._renderDisplay.active = true;
            prevDisplay.active = false;

            this._textureScale = 1.0;
        }

        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay, false);
        }

        protected _updateZOrder(): void {
            if (this._renderDisplay.getLocalZOrder() === this._zOrder) {
                return;
            }

            this._renderDisplay.setLocalZOrder(this._zOrder);
        }
        /**
         * @internal
         */
        public _updateVisible(): void {
            this._renderDisplay.active = this._parent.visible && this._visible;
        }

        protected _updateBlendMode(): void {
            const sprite = this._renderDisplay.getComponent(cc.Sprite);
            if (sprite) {
                switch (this._blendMode) {
                    case BlendMode.Normal:
                        break;

                    case BlendMode.Add:
                        const texture = sprite.spriteFrame.getTexture();
                        const BlendFunc = cc.BlendFunc as any; // creator.d.ts error.
                        if (texture && texture.hasPremultipliedAlpha()) {
                            (sprite as any)._sgNode.setBlendFunc(BlendFunc.BlendFactor.ONE, BlendFunc.BlendFactor.ONE); // creator.d.ts error.
                        }
                        else {
                            (sprite as any)._sgNode.setBlendFunc(BlendFunc.BlendFactor.SRC_ALPHA, BlendFunc.BlendFactor.ONE); // creator.d.ts error.
                        }
                        break;

                    case BlendMode.Darken:
                        break;

                    case BlendMode.Difference:
                        break;

                    case BlendMode.HardLight:
                        break;

                    case BlendMode.Lighten:
                        break;

                    case BlendMode.Multiply:
                        break;

                    case BlendMode.Overlay:
                        break;

                    case BlendMode.Screen:
                        break;

                    default:
                        break;
                }
            }
            else if (this._childArmature !== null) {
                for (const slot of this._childArmature.getSlots() as CocosSlot[]) {
                    slot._blendMode = this._blendMode;
                    slot._updateBlendMode();
                }
            }
        }

        protected _updateColor(): void {
            const alpha = this._colorTransform.alphaMultiplier * this._globalAlpha * 255;
            const color = this._renderDisplay.color;
            this._renderDisplay.opacity = alpha;
            color.setR(this._colorTransform.redMultiplier * 0xFF);
            color.setG(this._colorTransform.greenMultiplier * 0xFF);
            color.setB(this._colorTransform.blueMultiplier * 0xFF);
            (this._renderDisplay as any).setColor(color); // creator.d.ts error.
        }

        protected _updateFrame(): void {
            let currentTextureData = this._textureData as (CocosTextureData | null);
            const sprite = this._renderDisplay.getComponent(cc.Sprite);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as CocosTextureAtlasData;

                if (this._armature.replacedTexture !== null) { // Update replaced texture atlas.
                    if (this._armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = BaseObject.borrowObject(CocosTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    else {
                        currentTextureAtlasData = this._armature._replaceTextureAtlasData as CocosTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as CocosTextureData;
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

                        const textureAtlasSize = renderTexture.getTexture().getContentSizeInPixels();
                        const textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : textureAtlasSize.width;
                        const textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : textureAtlasSize.height;
                        const region = currentTextureData.region;
                        const boundsRect = cc.rect(999999.0, 999999.0, -999999.0, -999999.0);
                        const polygonInfo = {
                            triangles: {
                                verts: [] as { x: number, y: number, u: number, v: number }[],
                                indices: [] as number[]
                            },
                            rect: boundsRect
                        };

                        for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                            const vertex = {
                                x: floatArray[vertexOffset + i] * scale,
                                y: -floatArray[vertexOffset + i + 1] * scale,
                                u: floatArray[uvOffset + i],
                                v: floatArray[uvOffset + i + 1]
                            };

                            if (currentTextureData.rotated) {
                                const backU = vertex.u;
                                vertex.u = (region.x + (1.0 - vertex.v) * region.width) / textureAtlasWidth;
                                vertex.v = (region.y + backU * region.height) / textureAtlasHeight;
                            }
                            else {
                                vertex.u = (region.x + vertex.u * region.width) / textureAtlasWidth;
                                vertex.v = (region.y + vertex.v * region.height) / textureAtlasHeight;
                            }

                            polygonInfo.triangles.verts[i / 2] = vertex;

                            if (boundsRect.x > vertex.x) {
                                boundsRect.x = vertex.x;
                            }

                            if (boundsRect.width < vertex.x) {
                                boundsRect.width = vertex.x;
                            }

                            if (boundsRect.y > vertex.y) {
                                boundsRect.y = vertex.y;
                            }

                            if (boundsRect.height < vertex.y) {
                                boundsRect.height = vertex.y;
                            }
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            polygonInfo.triangles.indices[i] = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexIndices + i];
                        }

                        this._textureScale = 1.0;
                        (sprite as any)._sgNode.setRenderingType((cc as any).Scale9Sprite.RenderingType.MESH); // creator.d.ts error.
                        sprite.spriteFrame = renderTexture;
                        (sprite as any)._sgNode.setMeshPolygonInfo(polygonInfo); // creator.d.ts error.
                        (sprite as any)._sgNode.setContentSize(cc.size(boundsRect.width, boundsRect.height)); // creator.d.ts error.

                        const isSkinned = this._geometryData.weight !== null;
                        const isSurface = this._parent._boneData.type !== BoneType.Bone;
                        if (isSkinned || isSurface) {
                            this._identityTransform();
                        }
                        // Delay to update cocos mesh. (some cocos bug.)
                        this._ccMeshDirty = true;
                    }
                    else { // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        (sprite as any)._sgNode.setRenderingType((cc as any).Scale9Sprite.RenderingType.SIMPLE); // creator.d.ts error.
                        sprite.spriteFrame = renderTexture;
                        (sprite as any)._sgNode.setContentSize(renderTexture.getOriginalSize()); // creator.d.ts error.
                    }

                    this._visibleDirty = true;
                    // this._blendModeDirty = true;
                    // this._colorDirty = true;

                    return;
                }
            }

            this._renderDisplay.active = false;
            this._renderDisplay.setPosition(0.0, 0.0);
        }

        protected _updateMesh(): void {
            const scale = this._armature._armatureData.scale;
            const deformVertices = (this._displayFrame as DisplayFrame).deformVertices;
            const bones = this._geometryBones;
            const geometryData = this._geometryData as GeometryData;
            const weightData = geometryData.weight;

            const hasDeform = deformVertices.length > 0 && geometryData.inheritDeform;
            const meshDisplay = (this._renderDisplay.getComponent(cc.Sprite) as any)._sgNode; // as cc.Scale9Sprite;
            const polygonInfo = meshDisplay.getMeshPolygonInfo();
            if (!polygonInfo) {
                return;
            }

            const verticesAndUVs = polygonInfo.triangles.verts as { x: number, y: number, u: number, v: number }[];
            const boundsRect = cc.rect(999999.0, 999999.0, -999999.0, -999999.0);

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
                    let i = 0, iB = weightData.offset + BinaryOffset.WeigthBoneIndices + bones.length, iV = weightFloatOffset, iF = 0;
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

                    const vertex = verticesAndUVs[i];
                    vertex.x = xG;
                    vertex.y = yG;

                    if (boundsRect.x > xG) {
                        boundsRect.x = xG;
                    }

                    if (boundsRect.width < xG) {
                        boundsRect.width = xG;
                    }

                    if (boundsRect.y > yG) {
                        boundsRect.y = yG;
                    }

                    if (boundsRect.height < yG) {
                        boundsRect.height = yG;
                    }
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
                    const iH = i / 2; // int.
                    let x = floatArray[vertexOffset + i] * scale;
                    let y = floatArray[vertexOffset + i + 1] * scale;

                    if (hasDeform) {
                        x += deformVertices[i];
                        y += deformVertices[i + 1];
                    }

                    const vertex = verticesAndUVs[iH];

                    if (isSurface) {
                        const matrix = (this._parent as Surface)._getGlobalTransformMatrix(x, y);
                        vertex.x = matrix.a * x + matrix.c * y + matrix.tx;
                        vertex.y = matrix.b * x + matrix.d * y + matrix.ty;
                        //
                        x = vertex.x;
                        y = vertex.y;
                    }
                    else {
                        vertex.x = x;
                        y = vertex.y = -y;
                    }

                    if (boundsRect.x > x) {
                        boundsRect.x = x;
                    }

                    if (boundsRect.width < x) {
                        boundsRect.width = x;
                    }

                    if (boundsRect.y > y) {
                        boundsRect.y = y;
                    }

                    if (boundsRect.height < y) {
                        boundsRect.height = y;
                    }
                }
            }

            boundsRect.width -= boundsRect.x;
            boundsRect.height -= boundsRect.y;

            polygonInfo.rect = boundsRect;
            meshDisplay.setContentSize(cc.size(boundsRect.width, boundsRect.height));
            meshDisplay.setMeshPolygonInfo(polygonInfo);

            if (weightData !== null) {
                this._identityTransform();
            }
            else {
                const transform = this.global;
                const globalTransformMatrix = this.globalTransformMatrix;
                this._renderDisplay.x = transform.x - (globalTransformMatrix.a * this._pivotX - globalTransformMatrix.c * this._pivotY);
                this._renderDisplay.y = transform.y - (globalTransformMatrix.b * this._pivotX - globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.rotationX = -(transform.rotation + transform.skew) * dragonBones.Transform.RAD_DEG;
                this._renderDisplay.rotationY = -transform.rotation * dragonBones.Transform.RAD_DEG;
                this._renderDisplay.scaleX = transform.scaleX * this._textureScale;
                this._renderDisplay.scaleY = -transform.scaleY * this._textureScale;
            }

            if (this._ccMeshDirty) {
                this._ccMeshDirty = false;
                this._verticesDirty = true;
            }
        }

        protected _updateTransform(): void {
            // const globalTransformMatrix = this.globalTransformMatrix;
            // const helpMatrix = TransformObject._helpMatrix;

            // helpMatrix.a = globalTransformMatrix.a;
            // helpMatrix.b = globalTransformMatrix.b;
            // helpMatrix.c = -globalTransformMatrix.c;
            // helpMatrix.d = -globalTransformMatrix.d;

            // if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
            //     helpMatrix.tx = globalTransformMatrix.tx - (globalTransformMatrix.a * this._pivotX + globalTransformMatrix.c * this._pivotY);
            //     helpMatrix.ty = (globalTransformMatrix.ty - (globalTransformMatrix.b * this._pivotX + globalTransformMatrix.d * this._pivotY));
            // }
            // else {
            //     helpMatrix.tx = globalTransformMatrix.tx;
            //     helpMatrix.ty = globalTransformMatrix.ty;
            // }

            // (this._renderDisplay as any)._sgNode._renderCmd.setNodeToParentTransform(helpMatrix); // creator.d.ts error.
            this.updateGlobalTransform();

            const transform = this.global;
            const globalTransformMatrix = this.globalTransformMatrix;

            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                this._renderDisplay.x = transform.x - (globalTransformMatrix.a * this._pivotX - globalTransformMatrix.c * this._pivotY);
                this._renderDisplay.y = transform.y - (globalTransformMatrix.b * this._pivotX - globalTransformMatrix.d * this._pivotY);
            }
            else {
                this._renderDisplay.x = transform.x;
                this._renderDisplay.y = transform.y;
            }

            this._renderDisplay.rotationX = -(transform.rotation + transform.skew) * dragonBones.Transform.RAD_DEG;
            this._renderDisplay.rotationY = -transform.rotation * dragonBones.Transform.RAD_DEG;
            this._renderDisplay.scaleX = transform.scaleX * this._textureScale;
            this._renderDisplay.scaleY = -transform.scaleY * this._textureScale;
        }

        protected _identityTransform(): void {
            // const helpMatrix = TransformObject._helpMatrix;
            // helpMatrix.a = 1.0;
            // helpMatrix.b = 0.0;
            // helpMatrix.c = -0.0;
            // helpMatrix.d = -1.0;
            // helpMatrix.tx = 0.0;
            // helpMatrix.ty = 0.0;
            // (this._renderDisplay as any)._renderCmd.setNodeToParentTransform(helpMatrix);

            this._renderDisplay.x = 0.0;
            this._renderDisplay.y = 0.0;
            this._renderDisplay.rotationX = 0.0;
            this._renderDisplay.rotationY = 0.0;
            this._renderDisplay.scaleX = 1.0;
            this._renderDisplay.scaleY = 1.0;
        }
    }
}