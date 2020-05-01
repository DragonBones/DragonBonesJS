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
        private _renderDisplay: PIXI.DisplayObject;

        protected _onClear(): void {
            super._onClear();

            this._textureScale = 1.0;
            this._renderDisplay = null as any;
        }

        protected _initDisplay(value: any, isRetain: boolean): void {
            const display = value as PhaserSlotDisplay;
            display._renderIndex = 0;
            // tslint:disable-next-line:no-unused-expression
            isRetain;
        }

        protected _disposeDisplay(value: any, isRelease: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            if (!isRelease) {
                (value as Phaser.Sprite).destroy(true); // PIXI.DisplayObject.destroy();
            }
        }

        protected _onUpdateDisplay(): void {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay) as PIXI.DisplayObject;
        }

        protected _addDisplay(): void {
            const container = this._armature.display as PhaserArmatureDisplay;
            container.addChild(this._renderDisplay);
        }

        protected _replaceDisplay(value: any): void {
            const container = this._armature.display as PhaserArmatureDisplay;
            const prevDisplay = value as PIXI.DisplayObject;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            this._renderDisplay._renderIndex = prevDisplay._renderIndex;
            container.removeChild(prevDisplay);
            this._textureScale = 1.0;
        }

        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }

        protected _updateZOrder(): void {
            const container = this._armature.display as PhaserArmatureDisplay;
            if (this._renderDisplay._renderIndex !== this._zOrder) {
                this._renderDisplay._renderIndex = this._zOrder;
                container.removeChild(this._renderDisplay);
                let added = false;
                for (let i = 0; i < container.children.length; ++i) {
                    const child = container.getChildAt(i);
                    if (child._renderIndex > this._zOrder) {
                        container.addChildAt(this._renderDisplay, i);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    container.addChild(this._renderDisplay);
                }
            }
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
                        this._renderDisplay.blendMode = PIXI.blendModes.NORMAL;
                        break;

                    case BlendMode.Add:
                        this._renderDisplay.blendMode = PIXI.blendModes.ADD;
                        break;

                    case BlendMode.Darken:
                        this._renderDisplay.blendMode = PIXI.blendModes.DARKEN;
                        break;

                    case BlendMode.Difference:
                        this._renderDisplay.blendMode = PIXI.blendModes.DIFFERENCE;
                        break;

                    case BlendMode.HardLight:
                        this._renderDisplay.blendMode = PIXI.blendModes.HARD_LIGHT;
                        break;

                    case BlendMode.Lighten:
                        this._renderDisplay.blendMode = PIXI.blendModes.LIGHTEN;
                        break;

                    case BlendMode.Multiply:
                        this._renderDisplay.blendMode = PIXI.blendModes.MULTIPLY;
                        break;

                    case BlendMode.Overlay:
                        this._renderDisplay.blendMode = PIXI.blendModes.OVERLAY;
                        break;

                    case BlendMode.Screen:
                        this._renderDisplay.blendMode = PIXI.blendModes.SCREEN;
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

            if (this._renderDisplay instanceof PIXI.Sprite) { // || this._renderDisplay instanceof PIXI.mesh.Mesh
                const color = (Math.round(this._colorTransform.redMultiplier * 0xFF) << 16) + (Math.round(this._colorTransform.greenMultiplier * 0xFF) << 8) + Math.round(this._colorTransform.blueMultiplier * 0xFF);
                this._renderDisplay.tint = color;
            }
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
                        // TODO
                    }
                    else { // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        const normalDisplay = this._renderDisplay as PhaserSlotDisplay;
                        normalDisplay.setTexture(renderTexture);
                    }

                    this._visibleDirty = true;
                    return;
                }
            }

            if (this._geometryData !== null) {
                // TODO
            }
            else {
                const normalDisplay = this._renderDisplay;
                // normalDisplay.texture = null as any;
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
                normalDisplay.visible = false;
            }
        }

        protected _updateMesh(): void {
            // TODO
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
            (this._renderDisplay as any).skew = transform.skew; // Phase can not support skew.
            this._renderDisplay.scale.x = transform.scaleX * this._textureScale;
            this._renderDisplay.scale.y = transform.scaleY * this._textureScale;
        }

        protected _identityTransform(): void {
            this._renderDisplay.x = 0.0;
            this._renderDisplay.y = 0.0;
            this._renderDisplay.rotation = 0.0;
            (this._renderDisplay as any).skew = 0.0;
            this._renderDisplay.scale.x = 1.0;
            this._renderDisplay.scale.y = 1.0;
        }
    }
}
