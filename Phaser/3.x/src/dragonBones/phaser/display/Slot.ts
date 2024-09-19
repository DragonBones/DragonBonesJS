namespace dragonBones.phaser.display {
    export class Slot extends dragonBones.Slot {
        static toString(): string {
            return "[class dragonBones.PhaserSlot]";
        }

        private _textureScale: number;
        private _renderDisplay: SlotImage | SlotSprite | SlotMesh | DisplayContainer;

        protected _onClear(): void {
            super._onClear();

            this._textureScale = 1.0;
            if (this._renderDisplay) {
                this._renderDisplay.destroy();
                this._renderDisplay = null;
            }
        }

        protected _initDisplay(rawDisplay: any, isRetain: boolean): void {
        }

        protected _disposeDisplay(prevDisplay: any, isRelease: boolean): void {
            // do nothing here, prevDisplay normally is an user customized GameObject set for this slot, so user need to destroy it manually.
        }

        protected _onUpdateDisplay(): void {
            this._renderDisplay = this._display || this._rawDisplay;
        }

        // Phaser will soone remove the functionality of nested container, so here we need to look for an alternative solution for display.add(childArmatureDisplay)
        protected _addDisplay(): void {
            this.armature.display.add(this._renderDisplay);
        }

        protected _replaceDisplay(prevDisplay: any): void {
            if (!this._renderDisplay["setSkew"]) {
                console.warn(`please call dragonBones.phaser.util.extendSkew to mix skew component into your display object,
                                and set its pipeline to 'PhaserTextureTintPipeline' by calling 'setPiepline' method, more detail please refer to the 'ReplaceSlotDisplay.ts' example`);
                return;
            }

            this.armature.display.replace(prevDisplay, this._renderDisplay);
            this._renderDisplay.parentContainer = this.armature.display;
        }

        protected _removeDisplay(): void {
            // can't use this._armature.display.remove here, perphaps this._renderDisplay is a child of armature.
            this._renderDisplay.parentContainer.remove(this._renderDisplay);
        }

        protected _updateDisplayData(): void {
            super._updateDisplayData();

            if (this.armature.replacedTexture !== null) {
                this._textureDirty = true;
            }
        }

        protected _updateZOrder(): void {
            if (this._renderDisplay.depth === this._zOrder) return;
            this._renderDisplay.setDepth(this._zOrder);
        }

        _updateVisible(): void {
            this._renderDisplay.setVisible(this._parent.visible && this._visible);
        }

        protected _updateBlendMode(): void {
            let mode = Phaser.BlendModes.NORMAL;
            switch (this._blendMode) {
                case BlendMode.Normal:
                    mode = Phaser.BlendModes.NORMAL;
                    break;
                case BlendMode.Add:
                    mode = Phaser.BlendModes.ADD;
                    break;
                case BlendMode.Darken:
                    mode = Phaser.BlendModes.DARKEN;
                    break;
                case BlendMode.Difference:
                    mode = Phaser.BlendModes.DIFFERENCE;
                    break;
                case BlendMode.HardLight:
                    mode = Phaser.BlendModes.HARD_LIGHT;
                    break;
                case BlendMode.Lighten:
                    mode = Phaser.BlendModes.LIGHTEN;
                    break;
                case BlendMode.Multiply:
                    mode = Phaser.BlendModes.MULTIPLY;
                    break;
                case BlendMode.Overlay:
                    mode = Phaser.BlendModes.OVERLAY;
                    break;
                case BlendMode.Screen:
                    mode = Phaser.BlendModes.SCREEN;
                    break;
                default:
                    break;
            }

            this._renderDisplay.setBlendMode(mode);
        }

        protected _updateColor(): void {
            const c = this._colorTransform;

            const a = this._globalAlpha * c.alphaMultiplier + c.alphaOffset;
            this._renderDisplay.setAlpha(a);

            if (this._renderDisplay instanceof DisplayContainer) return;

            const r = 0xff * c.redMultiplier + c.redOffset;
            const g = 0xff * c.greenMultiplier + c.greenOffset;
            const b = 0xff * c.blueMultiplier + c.blueOffset;
            const rgb = (r << 16) | (g << 8) | b;
            this._renderDisplay.setTint(rgb);
        }

        protected _updateFrame(): void {
            if (this._renderDisplay instanceof DisplayContainer) return;

            let currentTextureData = this._textureData as TextureData;

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as TextureAtlasData;
                if (this.armature.replacedTexture !== null) { // Update replaced texture atlas.
                    if (this.armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = BaseObject.borrowObject(TextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this.armature.replacedTexture;
                        this.armature._replaceTextureAtlasData = currentTextureAtlasData;
                    } else
                        currentTextureAtlasData = this.armature._replaceTextureAtlasData as TextureAtlasData;

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as TextureData;
                }

                const frame = currentTextureData.renderTexture;
                if (frame !== null) {
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

                        const meshDisplay = this._renderDisplay as SlotMesh;
                        const region = currentTextureData.region;

                        meshDisplay.fakeVertices = new Float32Array(vertexCount * 2) as any;
                        meshDisplay.fakeUvs = new Float32Array(vertexCount * 2) as any;
                        meshDisplay.fakeIndices = new Uint16Array(triangleCount * 3);

                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            meshDisplay.fakeVertices[i] = floatArray[vertexOffset + i] * scale;
                        }

                        for (let i = 0; i < triangleCount * 3; ++i) {
                            meshDisplay.fakeIndices[i] = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexIndices + i];
                        }

                        for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                            const u = floatArray[uvOffset + i];
                            const v = floatArray[uvOffset + i + 1];

                            if (currentTextureData.rotated) {
                                meshDisplay.fakeUvs[i] = (region.x + (1.0 - v) * region.width) / currentTextureAtlasData.width;
                                meshDisplay.fakeUvs[i + 1] = (region.y + u * region.height) / currentTextureAtlasData.height;
                            }
                            else {
                                meshDisplay.fakeUvs[i] = (region.x + u * region.width) / currentTextureAtlasData.width;
                                meshDisplay.fakeUvs[i + 1] = (region.y + v * region.height) / currentTextureAtlasData.height;
                            }
                        }

                        this._textureScale = 1.0;
                        meshDisplay.texture = frame.texture;
                        meshDisplay.frame = frame;

                        meshDisplay.updateVertices();

                        const isSkinned = this._geometryData.weight !== null;
                        const isSurface = this._parent._boneData.type !== BoneType.Bone;
                        if (isSkinned || isSurface) {
                            this._identityTransform();
                        }
                    } else { // normal texture.
                        this._renderDisplay.texture = frame.texture;
                        this._renderDisplay.frame = frame;
                        this._renderDisplay.setDisplayOrigin(this._pivotX, this._pivotY);
                        this._textureScale = currentTextureData.parent.scale * this.armature.armatureData.scale;
                        this._renderDisplay.setScale(this._textureScale);
                    }

                    this._visibleDirty = true;
                    return;
                }
            } else {
                this._renderDisplay.x = 0.0;
                this._renderDisplay.y = 0.0;
                this._renderDisplay.setTexture(undefined);
            }
        }

        protected _updateMesh(): void {
            const scale = this._armature._armatureData.scale;
            const deformVertices = (this._displayFrame as DisplayFrame).deformVertices;
            const bones = this._geometryBones;
            const geometryData = this._geometryData as GeometryData;
            const weightData = geometryData.weight;

            const hasDeform = deformVertices.length > 0 && geometryData.inheritDeform;
            const meshDisplay = this._renderDisplay as SlotMesh;

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

                    meshDisplay.fakeVertices[iD++] = xG;
                    meshDisplay.fakeVertices[iD++] = yG;
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
                        meshDisplay.fakeVertices[i] = matrix.a * x + matrix.c * y + matrix.tx;
                        meshDisplay.fakeVertices[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                    else {
                        meshDisplay.fakeVertices[i] = x;
                        meshDisplay.fakeVertices[i + 1] = y;
                    }
                }
            }
            meshDisplay.updateVertices();
        }

        protected _updateTransform(): void {
            this.updateGlobalTransform();

            const transform = this.global;
            this._renderDisplay.x = transform.x;     // No need to calcuate pivot offset manually here as Phaser.GameObjects.GameObject takes that into account already.
            this._renderDisplay.y = transform.y;
            this._renderDisplay.rotation = transform.rotation;
            this._renderDisplay["setSkew"](transform.skew, 0);
            this._renderDisplay.setScale(transform.scaleX * this._textureScale, transform.scaleY * this._textureScale);
        }

        protected _identityTransform(): void {
            this._renderDisplay.setPosition();
            this._renderDisplay.setRotation();
            this._textureScale = 1.0;
            this._renderDisplay.setScale(this._textureScale);
            this._renderDisplay["setSkew"](0);
        }
    }
}
