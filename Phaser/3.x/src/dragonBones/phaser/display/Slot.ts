namespace dragonBones.phaser.display {
    export class Slot extends dragonBones.Slot {
        static toString(): string {
            return "[class dragonBones.PhaserSlot]";
        }

        private _textureScale: number;
        private _renderDisplay: SlotImage | SlotSprite | DisplayContainer;

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
                        // ignored, Phaser currently does not support mesh.indices
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
            // ignored, Phaser currently does not support mesh.indices
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
