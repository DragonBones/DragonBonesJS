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

        private _createTexture(textureData: PixiTextureData, textureAtlas: PIXI.BaseTexture): PIXI.Texture {
            const originSize = new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height);
            const texture = new PIXI.Texture(
                textureAtlas,
                <PIXI.Rectangle><any>textureData.region, // No need to set frame.
                <PIXI.Rectangle><any>textureData.region,
                originSize,
                textureData.rotated
            );
            
            return texture;
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
            (value as PIXI.DisplayObject).destroy();
        }
        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            if (!this._rawDisplay) {
                this._rawDisplay = new PIXI.Sprite();
            }

            this._renderDisplay = (this._display || this._rawDisplay) as PIXI.DisplayObject;
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = this._armature._display as PixiArmatureDisplay;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: Object): void {
            const container = this._armature._display as PixiArmatureDisplay;
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
            const container = this._armature._display as PixiArmatureDisplay;
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
        }
        /**
         * @private
         */
        protected _updateFilters(): void { }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const frameDisplay = this._renderDisplay as PIXI.Sprite;

            if (this._display && this._displayIndex >= 0) {
                const rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                const replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                const currentDisplayData = replacedDisplayData || rawDisplayData;
                const currentTextureData = currentDisplayData.texture as PixiTextureData;
                if (currentTextureData) {
                    const currentTextureAtlasData = currentTextureData.parent as PixiTextureAtlasData;
                    const replacedTextureAtlas = this._armature.replacedTexture as PIXI.BaseTexture;
                    const currentTextureAtlas = (replacedTextureAtlas && currentDisplayData.texture.parent == rawDisplayData.texture.parent) ?
                        replacedTextureAtlas : currentTextureAtlasData.texture;
                    if (currentTextureAtlas) {
                        let currentTexture = currentTextureData.texture;

                        if (currentTextureAtlas == replacedTextureAtlas) {
                            const armatureDisplay = this._armature._display as PixiArmatureDisplay;
                            const textureName = currentTextureData.name;
                            currentTexture = armatureDisplay._subTextures[textureName];
                            if (!currentTexture) {
                                currentTexture = this._createTexture(currentTextureData, currentTextureAtlas);
                                armatureDisplay._subTextures[textureName] = currentTexture;
                            }
                        }
                        else if (!currentTextureData.texture) {
                            currentTexture = this._createTexture(currentTextureData, currentTextureAtlas);
                            currentTextureData.texture = currentTexture;
                        }

                        this._updatePivot(rawDisplayData, currentDisplayData, currentTextureData);

                        if (this._meshData && this._display == this._meshDisplay) { // Mesh.
                            const meshDisplay = this._meshDisplay as PIXI.mesh.Mesh;
                            const textureAtlasWidth = currentTextureAtlas ? currentTextureAtlas.width : 1;
                            const textureAtlasHeight = currentTextureAtlas ? currentTextureAtlas.height : 1;

                            meshDisplay.uvs = <any>new Float32Array(this._meshData.uvs);
                            meshDisplay.vertices = <any>new Float32Array(this._meshData.vertices);
                            meshDisplay.indices = <any>new Uint16Array(this._meshData.vertexIndices);

                            for (let i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                                const u = meshDisplay.uvs[i];
                                const v = meshDisplay.uvs[i + 1];
                                meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
                                meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
                            }

                            meshDisplay.texture = currentTexture;
                            meshDisplay.dirty = true;

                            // Identity transform.
                            if (this._meshData.skinned) {
                                meshDisplay.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);
                            }
                        }
                        else { // Normal texture.
                            frameDisplay.texture = currentTexture;
                        }

                        this._updateVisible();

                        return;
                    }
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
            const meshDisplay = this._meshDisplay as PIXI.mesh.Mesh;
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