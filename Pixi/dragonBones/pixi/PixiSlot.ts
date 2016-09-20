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
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._renderDisplay = null;
        }

        /**
         * @private
         */
        protected _initDisplay(value: Object): void {
        }
        /**
         * @private
         */
        protected _disposeDisplay(value: Object): void {
            (<PIXI.DisplayObject>value).destroy();
        }
        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            if (!this._rawDisplay) {
                this._rawDisplay = new PIXI.Sprite();
            }

            this._renderDisplay = <PIXI.DisplayObject>(this._display || this._rawDisplay);
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = <PixiArmatureDisplay>this._armature._display;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: Object): void {
            const container = <PixiArmatureDisplay>this._armature._display;
            const prevDisplay = <PIXI.DisplayObject>value;
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
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible;
        }
        /**
         * @private
         */
        protected _updateBlendMode(): void {
            switch (this._blendMode) {
                case BlendMode.Normal:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.NORMAL;
                    break;

                case BlendMode.Add:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.ADD;
                    break;

                case BlendMode.Darken:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.DARKEN;
                    break;

                case BlendMode.Difference:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.DIFFERENCE;
                    break;

                case BlendMode.HardLight:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
                    break;

                case BlendMode.Lighten:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.LIGHTEN;
                    break;

                case BlendMode.Multiply:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.MULTIPLY;
                    break;

                case BlendMode.Overlay:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.OVERLAY;
                    break;

                case BlendMode.Screen:
                    (<PIXI.Sprite>this._renderDisplay).blendMode = PIXI.BLEND_MODES.SCREEN;
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
        protected _updateFilters(): void { }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const frameDisplay = <PIXI.Sprite>this._renderDisplay;

            if (this._display && this._displayIndex >= 0) {
                const rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                const replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                const currentDisplayData = replacedDisplayData || rawDisplayData;
                const currentTextureData = <PixiTextureData>currentDisplayData.texture;
                if (currentTextureData) {
                    const textureAtlasTexture = (<PixiTextureAtlasData>currentTextureData.parent).texture;
                    if (!currentTextureData.texture && textureAtlasTexture) { // Create and cache texture.
                        const originSize = new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height);
                        currentTextureData.texture = new PIXI.Texture(
                            textureAtlasTexture,
                            <PIXI.Rectangle><any>currentTextureData.region, // No need to set frame.
                            <PIXI.Rectangle><any>currentTextureData.region,
                            originSize,
                            currentTextureData.rotated
                        );
                    }

                    const texture = (<PIXI.Texture>this._armature._replacedTexture) || currentTextureData.texture;

                    if (this._meshData && this._display == this._meshDisplay) { // Mesh.
                        const meshDisplay = <PIXI.mesh.Mesh>this._meshDisplay;

                        if (this._meshData != rawDisplayData.mesh && rawDisplayData && rawDisplayData != currentDisplayData) {
                            this._pivotX = rawDisplayData.transform.x - currentDisplayData.transform.x;
                            this._pivotY = rawDisplayData.transform.y - currentDisplayData.transform.y;
                        }
                        else {
                            this._pivotX = 0;
                            this._pivotY = 0;
                        }

                        /*
                        for (let i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                            meshDisplay.uvs[i] = this._meshData.uvs[i];
                            meshDisplay.vertices[i] = this._meshData.vertices[i];
                        }

                        for (let i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                            meshDisplay.indices[i] = this._meshData.vertexIndices[i];
                        }
                        */

                        meshDisplay.uvs = <any>new Float32Array(this._meshData.uvs);
                        meshDisplay.vertices = <any>new Float32Array(this._meshData.vertices);
                        meshDisplay.indices = <any>new Uint16Array(this._meshData.vertexIndices);

                        for (let i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                            const u = meshDisplay.uvs[i];
                            const v = meshDisplay.uvs[i + 1];
                            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasTexture.width;
                            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasTexture.height;
                        }

                        meshDisplay.texture = texture;
                        meshDisplay.dirty = true;

                        // Identity transform.
                        if (this._meshData.skinned) {
                            meshDisplay.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);
                        }
                    }
                    else { // Normal texture.
                        this._updatePivot(rawDisplayData, currentDisplayData, currentTextureData);

                        frameDisplay.texture = texture;
                    }

                    this._updateVisible();

                    return;
                }
            }

            this._pivotX = 0;
            this._pivotY = 0;

            frameDisplay.visible = false;
            frameDisplay.texture = null;
            frameDisplay.x = this.origin.x;
            frameDisplay.y = this.origin.y;
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const meshDisplay = <PIXI.mesh.Mesh>this._meshDisplay;
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
        protected _updateTransform(): void {
            // this._renderDisplay.worldTransform.copy(<PIXI.Matrix><any>this.globalTransformMatrix); // How to set matrix !?

            this._renderDisplay.setTransform(
                this.global.x, this.global.y,
                this.global.scaleX, this.global.scaleY,
                this.global.skewY,
                0, 0,
                this._pivotX, this._pivotY
            );
        }
    }
}