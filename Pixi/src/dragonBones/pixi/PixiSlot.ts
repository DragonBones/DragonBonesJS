namespace dragonBones {
    /**
     * @language zh_CN
     * Pixi 插槽。
     * @version DragonBones 3.0
     */
    export class PixiSlot extends Slot {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.PixiSlot]";
        }

        private _renderDisplay: PIXI.DisplayObject;
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();

            this._updateTransform = PIXI.VERSION[0] === "3" ? this._updateTransformV3 : this._updateTransformV4;
        }
        /**
         * @private
         */
        protected _onClear(): void {
            super._onClear();

            this._renderDisplay = null;
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

            container.addChildAt(this._renderDisplay, this._zOrder < index ? this._zOrder : this._zOrder + 1);
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
        }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const isMeshDisplay = this._meshData && this._display === this._meshDisplay;
            let currentTextureData = this._textureData as PixiTextureData;

            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                let currentTextureAtlasData = currentTextureData.parent as PixiTextureAtlasData;

                // Update replaced texture atlas.
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData as PixiTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = BaseObject.borrowObject(PixiTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as PixiTextureData;
                }

                const currentTextureAtlas = currentTextureAtlasData.texture;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) {
                        currentTextureData.texture = new PIXI.Texture(
                            currentTextureAtlas,
                            <any>currentTextureData.region as PIXI.Rectangle, // No need to set frame.
                            <any>currentTextureData.region as PIXI.Rectangle,
                            new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height),
                            currentTextureData.rotated as any // .d.ts bug
                        );
                    }

                    if (isMeshDisplay) { // Mesh.
                        const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;
                        const textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
                        const textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;

                        meshDisplay.uvs = <any>new Float32Array(this._meshData.uvs);
                        meshDisplay.vertices = <any>new Float32Array(this._meshData.vertices);
                        meshDisplay.indices = <any>new Uint16Array(this._meshData.vertexIndices);

                        for (let i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                            const u = meshDisplay.uvs[i];
                            const v = meshDisplay.uvs[i + 1];
                            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
                            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
                        }

                        meshDisplay.texture = currentTextureData.texture;
                        //meshDisplay.dirty = true; // Pixi 3.x
                        meshDisplay.dirty++; // Pixi 4.x Can not support change mesh vertice count.
                    }
                    else { // Normal texture.
                        const normalDisplay = this._renderDisplay as PIXI.Sprite;
                        normalDisplay.texture = currentTextureData.texture;
                    }

                    this._updateVisible();

                    return;
                }
            }

            if (isMeshDisplay) {
                const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;
                meshDisplay.visible = false;
                meshDisplay.texture = null;
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
            }
            else {
                const normalDisplay = this._renderDisplay as PIXI.Sprite;
                normalDisplay.visible = false;
                normalDisplay.texture = null;
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
            }
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const meshDisplay = this._renderDisplay as PIXI.mesh.Mesh;
            const hasFFD = this._ffdVertices.length > 0;

            if (this._meshData.skinned) {
                for (let i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    let iH = i / 2;

                    const boneIndices = this._meshData.boneIndices[iH];
                    const boneVertices = this._meshData.boneVertices[iH];
                    const weights = this._meshData.weights[iH];

                    let xG = 0.0, yG = 0.0;

                    for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        const bone = this._meshBones[boneIndices[iB]];
                        const matrix = bone.globalTransformMatrix;
                        const weight = weights[iB];

                        let xL = 0.0, yL = 0.0;
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

                    meshDisplay.vertices[i] = xG;
                    meshDisplay.vertices[i + 1] = yG;
                }

            }
            else if (hasFFD) {
                const vertices = this._meshData.vertices;
                for (let i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    const xG = vertices[i] + this._ffdVertices[i];
                    const yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshDisplay.vertices[i] = xG;
                    meshDisplay.vertices[i + 1] = yG;
                }
            }
        }
        /**
         * @private
         */
        protected _updateTransform(isSkinnedMesh: boolean): void {
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

                const x = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY); // Pixi pivot do not work.
                const y = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY); // Pixi pivot do not work.
                const transform = this.global;
                this._renderDisplay.setTransform(
                    x, y,
                    transform.scaleX, transform.scaleY,
                    transform.skewX,
                    0.0, transform.skewY - transform.skewX
                );
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
                this._renderDisplay.setTransform(
                    transform.x, transform.y,
                    transform.scaleX, transform.scaleY,
                    transform.skewX,
                    0.0, transform.skewY - transform.skewX,
                    this._pivotX, this._pivotY
                );
            }
        }
    }
}