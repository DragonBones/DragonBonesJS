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
     * - The egret texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Egret 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.EgretTextureAtlasData]";
        }
        /**
         * @internal
         */
        public disposeEnabled: boolean;

        private _renderTexture: egret.Texture | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.disposeEnabled && this._renderTexture !== null) {
                this._renderTexture.dispose();
            }

            this.disposeEnabled = false;
            this._renderTexture = null;
        }
        /**
         * @inheritDoc
         */
        public createTexture(): TextureData {
            return BaseObject.borrowObject(EgretTextureData);
        }
        /**
         * - The Egret texture.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - Egret 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get renderTexture(): egret.Texture | null {
            return this._renderTexture;
        }
        public set renderTexture(value: egret.Texture | null) {
            if (this._renderTexture === value) {
                return;
            }

            this._renderTexture = value;

            if (this._renderTexture !== null) {
                const bitmapData = this._renderTexture.bitmapData;
                const textureAtlasWidth = this.width > 0.0 ? this.width : bitmapData.width;
                const textureAtlasHeight = this.height > 0.0 ? this.height : bitmapData.height;

                for (let k in this.textures) {
                    const scale = egret.$TextureScaleFactor;
                    const textureData = this.textures[k] as EgretTextureData;
                    const subTextureWidth = textureData.region.width;
                    const subTextureHeight = textureData.region.height;

                    if (textureData.renderTexture === null) {
                        textureData.renderTexture = new egret.Texture();
                    }

                    textureData.renderTexture.bitmapData = bitmapData;

                    if (textureData.rotated) {
                        textureData.renderTexture.$initData(
                            textureData.region.x * scale, textureData.region.y * scale,
                            subTextureHeight * scale, subTextureWidth * scale,
                            0, 0,
                            subTextureHeight * scale, subTextureWidth * scale,
                            textureAtlasWidth, textureAtlasHeight,
                            textureData.rotated
                        );
                    }
                    else {
                        textureData.renderTexture.$initData(
                            textureData.region.x * scale, textureData.region.y * scale,
                            subTextureWidth * scale, subTextureHeight * scale,
                            0, 0,
                            subTextureWidth * scale, subTextureHeight * scale,
                            textureAtlasWidth, textureAtlasHeight
                        );
                    }
                }
            }
            else {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as EgretTextureData;
                    textureData.renderTexture = null;
                }
            }
        }

        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#removeTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#removeTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        public dispose(): void {
            console.warn("已废弃。");
            this.returnToPool();
        }
        /**
         * - Deprecated, please refer to {@link #renderTexture}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #renderTexture}。
         * @deprecated
         * @language zh_CN
         */
        public get texture() {
            console.warn("已废弃。");
            return this.renderTexture;
        }
    }
    /**
     * @internal
     */
    export class EgretTextureData extends TextureData {
        public static toString(): string {
            return "[class dragonBones.EgretTextureData]";
        }

        public renderTexture: egret.Texture | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.renderTexture !== null) {
                //this.renderTexture.dispose(false);
                //this.renderTexture.dispose();
            }

            this.renderTexture = null;
        }
    }
}