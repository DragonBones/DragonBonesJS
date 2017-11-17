/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2016 DragonBones team and other contributors
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
     * - The Hilo slot.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Hilo 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class HiloSlot extends Slot {
        public static toString(): string {
            return "[class dragonBones.HiloSlot]";
        }

        private _textureScale: number;
        private _renderDisplay: Hilo.View;
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._textureScale = 1.0;
            this._renderDisplay = null as any;
        }
        /**
         * @inheritDoc
         */
        protected _initDisplay(value: any): void {
            // tslint:disable-next-line:no-unused-expression
            value;
        }
        /**
         * @inheritDoc
         */
        protected _disposeDisplay(value: any): void {
            // tslint:disable-next-line:no-unused-expression
            value;
        }
        /**
         * @inheritDoc
         */
        protected _onUpdateDisplay(): void {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay) as Hilo.View;
        }
        /**
         * @inheritDoc
         */
        protected _addDisplay(): void {
            const container = this._armature.display as HiloArmatureDisplay;
            container.addChild(this._renderDisplay);
        }
        /**
         * @inheritDoc
         */
        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as HiloArmatureDisplay;
            const prevDisplay = value as Hilo.View;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
            this._textureScale = 1.0;
        }
        /**
         * @inheritDoc
         */
        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }
        /**
         * @inheritDoc
         */
        protected _updateZOrder(): void {
            const container = this._armature.display as HiloArmatureDisplay;
            const index = container.getChildIndex(this._renderDisplay);
            if (index === this._zOrder) {
                return;
            }

            container.addChildAt(this._renderDisplay, this._zOrder);
        }
        /**
         * @inheritDoc
         */
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible && this._visible;
        }
        /**
         * @inheritDoc
         */
        protected _updateBlendMode(): void {
            // TODO
        }
        /**
         * @inheritDoc
         */
        protected _updateColor(): void {
            // TODO
            // this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
            // if (this._renderDisplay instanceof PIXI.Sprite || this._renderDisplay instanceof PIXI.mesh.Mesh) {
            //     const color = (Math.round(this._colorTransform.redMultiplier * 0xFF) << 16) + (Math.round(this._colorTransform.greenMultiplier * 0xFF) << 8) + Math.round(this._colorTransform.blueMultiplier * 0xFF);
            //     this._renderDisplay.tint = color;
            // }
        }
        /**
         * @inheritDoc
         */
        protected _updateFrame(): void {
            const meshData = this._display === this._meshDisplay ? this._meshData : null;
            let currentTextureData = this._textureData as (PixiTextureData | null);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as PixiTextureAtlasData;
                if (this._armature.replacedTexture !== null && this._rawDisplayDatas !== null && this._rawDisplayDatas.indexOf(this._displayData) >= 0) { // Update replaced texture atlas.
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

                        const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;
                        const textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : renderTexture.width;
                        const textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : renderTexture.height;

                        meshDisplay.vertices = new Float32Array(vertexCount * 2) as any;
                        meshDisplay.uvs = new Float32Array(vertexCount * 2) as any;
                        meshDisplay.indices = new Uint16Array(triangleCount * 3) as any;
                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshDisplay.vertices[i] = floatArray[vertexOffset + i];
                            meshDisplay.uvs[i] = floatArray[uvOffset + i];
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshDisplay.indices[i] = intArray[meshData.offset + BinaryOffset.MeshVertexIndices + i];
                        }

                        for (let i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                            const u = meshDisplay.uvs[i];
                            const v = meshDisplay.uvs[i + 1];
                            if (currentTextureData.rotated) {
                                meshDisplay.uvs[i] = (currentTextureData.region.x + (1.0 - v) * currentTextureData.region.width) / textureAtlasWidth;
                                meshDisplay.uvs[i + 1] = (currentTextureData.region.y + u * currentTextureData.region.height) / textureAtlasHeight;
                            }
                            else {
                                meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
                                meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
                            }
                        }

                        this._textureScale = 1.0;
                        meshDisplay.texture = renderTexture as any;
                        //meshDisplay.dirty = true; // Pixi 3.x
                        meshDisplay.dirty++; // Pixi 4.x Can not support change mesh vertice count.
                    }
                    else { // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        const normalDisplay = this._renderDisplay as PIXI.Sprite;
                        normalDisplay.texture = renderTexture;
                    }

                    this._visibleDirty = true;
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
         * @inheritDoc
         */
        protected _updateMesh(): void {
            // TODO
            // const hasFFD = this._ffdVertices.length > 0;
            // const scale = this._armature._armatureData.scale;
            // const meshData = this._meshData as MeshDisplayData;
            // const weight = meshData.weight;
            // const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;

            // if (weight !== null) {
            //     const data = meshData.parent.parent.parent;
            //     const intArray = data.intArray;
            //     const floatArray = data.floatArray;
            //     const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
            //     let weightFloatOffset = intArray[weight.offset + BinaryOffset.WeigthFloatOffset];

            //     if (weightFloatOffset < 0) {
            //         weightFloatOffset += 65536; // Fixed out of bouds bug. 
            //     }

            //     for (
            //         let i = 0, iD = 0, iB = weight.offset + BinaryOffset.WeigthBoneIndices + weight.bones.length, iV = weightFloatOffset, iF = 0;
            //         i < vertexCount;
            //         ++i
            //     ) {
            //         const boneCount = intArray[iB++];
            //         let xG = 0.0, yG = 0.0;
            //         for (let j = 0; j < boneCount; ++j) {
            //             const boneIndex = intArray[iB++];
            //             const bone = this._meshBones[boneIndex];
            //             if (bone !== null) {
            //                 const matrix = bone.globalTransformMatrix;
            //                 const weight = floatArray[iV++];
            //                 let xL = floatArray[iV++] * scale;
            //                 let yL = floatArray[iV++] * scale;

            //                 if (hasFFD) {
            //                     xL += this._ffdVertices[iF++];
            //                     yL += this._ffdVertices[iF++];
            //                 }

            //                 xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
            //                 yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
            //             }
            //         }

            //         meshDisplay.vertices[iD++] = xG;
            //         meshDisplay.vertices[iD++] = yG;
            //     }
            // }
            // else if (hasFFD) {
            //     const data = meshData.parent.parent.parent;
            //     const intArray = data.intArray;
            //     const floatArray = data.floatArray;
            //     const vertexCount = intArray[meshData.offset + BinaryOffset.MeshVertexCount];
            //     let vertexOffset = intArray[meshData.offset + BinaryOffset.MeshFloatOffset];

            //     if (vertexOffset < 0) {
            //         vertexOffset += 65536; // Fixed out of bouds bug. 
            //     }

            //     for (let i = 0, l = vertexCount * 2; i < l; ++i) {
            //         meshDisplay.vertices[i] = floatArray[vertexOffset + i] * scale + this._ffdVertices[i];
            //     }
            // }
        }
        /**
         * @inheritDoc
         */
        protected _updateTransform(isSkinnedMesh: boolean): void {
            if (isSkinnedMesh) { // Identity transform.
                this._renderDisplay.x = 0.0;
                this._renderDisplay.y = 0.0;
                this._renderDisplay.rotation = 0.0;
                (this._renderDisplay as any).skew = 0.0;
                this._renderDisplay.scaleX = 1.0;
                this._renderDisplay.scaleX = 1.0;
            }
            else {
                this.updateGlobalTransform(); // Update transform.

                const transform = this.global;

                if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                    const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                    const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                    this._renderDisplay.x = x;
                    this._renderDisplay.y = y;
                    this._renderDisplay.rotation = transform.rotation;
                    (this._renderDisplay as any).skew = transform.skew;
                    this._renderDisplay.scaleX = transform.scaleX * this._textureScale;
                    this._renderDisplay.scaleX = transform.scaleY * this._textureScale;
                }
                else {
                    this._renderDisplay.x = transform.x;
                    this._renderDisplay.y = transform.y;
                    this._renderDisplay.rotation = transform.rotation;
                    (this._renderDisplay as any).skew = transform.skew;
                    this._renderDisplay.scaleX = transform.scaleX * this._textureScale;
                    this._renderDisplay.scaleX = transform.scaleY * this._textureScale;
                }
            }
        }
    }
}