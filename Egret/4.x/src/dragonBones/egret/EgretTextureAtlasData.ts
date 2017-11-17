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
         * @private
         */
        public disposeEnabled: boolean;

        private _renderTexture: egret.Texture | null = null; // Initial value.
        /**
         * @inheritDoc
         */
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

                    if (EgretFactory._isV5) {
                        (textureData.renderTexture as any)["$bitmapData"] = bitmapData;
                    }
                    else {
                        textureData.renderTexture._bitmapData = bitmapData;
                    }

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
     * @private
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