/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
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
        protected _initDisplay(value: any, isRetain: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            // tslint:disable-next-line:no-unused-expression
            isRetain;
        }
        /**
         * @inheritDoc
         */
        protected _disposeDisplay(value: any, isRelease: boolean): void {
            // tslint:disable-next-line:no-unused-expression
            value;
            // tslint:disable-next-line:no-unused-expression
            isRelease;
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
            const color = (Math.round(this._colorTransform.redMultiplier * 0xFF) << 16) + (Math.round(this._colorTransform.greenMultiplier * 0xFF) << 8) + Math.round(this._colorTransform.blueMultiplier * 0xFF);

            this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
            this._renderDisplay.tint = color;
        }
        /**
         * @inheritDoc
         */
        protected _updateFrame(): void {
            const meshData = this._display === this._meshDisplay ? this._meshData : null;
            let currentTextureData = this._textureData as (HiloTextureData | null);

            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent as HiloTextureAtlasData;
                if (this._armature.replacedTexture !== null && this._rawDisplayDatas !== null && this._rawDisplayDatas.indexOf(this._displayData) >= 0) { // Update replaced texture atlas.
                    if (this._armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = BaseObject.borrowObject(HiloTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    else {
                        currentTextureAtlasData = this._armature._replaceTextureAtlasData as HiloTextureAtlasData;
                    }

                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as HiloTextureData;
                }

                const renderTexture = currentTextureAtlasData.renderTexture;
                if (renderTexture !== null) {
                    if (meshData !== null) { // Mesh.
                        // TODO
                    }
                    else { // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        const normalDisplay = this._renderDisplay as Hilo.Bitmap;
                        normalDisplay.setImage(renderTexture, [currentTextureData.region.x, currentTextureData.region.y, currentTextureData.region.width, currentTextureData.region.height]);
                    }

                    this._visibleDirty = true;
                    return;
                }
            }

            if (meshData !== null) {
                // TODO
            }
            else {
                const normalDisplay = this._renderDisplay as Hilo.Bitmap;
                // normalDisplay.setImage(null);
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
        }
        /**
         * @inheritDoc
         */
        public _updateGlueMesh(): void {
            // TODO
        }
        /**
         * @inheritDoc
         */
        protected _updateTransform(): void {
            this.updateGlobalTransform(); // Update transform.

            const transform = this.global;

            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.x = x;
                this._renderDisplay.y = y;
                this._renderDisplay.rotation = transform.rotation * Transform.RAD_DEG;
                (this._renderDisplay as any).skew = transform.skew; // Hilo can not support skew. TODO
                this._renderDisplay.scaleX = transform.scaleX * this._textureScale;
                this._renderDisplay.scaleY = transform.scaleY * this._textureScale;
            }
            else {
                this._renderDisplay.x = transform.x;
                this._renderDisplay.y = transform.y;
                this._renderDisplay.rotation = transform.rotation * Transform.RAD_DEG;
                (this._renderDisplay as any).skew = transform.skew; // Hilo can not support skew. TODO
                this._renderDisplay.scaleX = transform.scaleX * this._textureScale;
                this._renderDisplay.scaleY = transform.scaleY * this._textureScale;
            }
        }
        /**
         * @inheritDoc
         */
        protected _identityTransform(): void {
            this._renderDisplay.x = 0.0;
            this._renderDisplay.y = 0.0;
            this._renderDisplay.rotation = 0.0;
            (this._renderDisplay as any).skew = 0.0;
            this._renderDisplay.scaleX = 1.0;
            this._renderDisplay.scaleY = 1.0;
        }
    }
}
