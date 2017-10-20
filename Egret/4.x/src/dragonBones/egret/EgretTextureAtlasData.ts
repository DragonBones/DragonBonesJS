namespace dragonBones {
    /**
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.EgretTextureAtlasData]";
        }

        public disposeEnabled: boolean;

        private _renderTexture: egret.Texture | null = null; // Initial value.
        /**
         * @private
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
         * @private
         */
        public createTexture(): TextureData {
            return BaseObject.borrowObject(EgretTextureData);
        }
        /**
         * Egret 贴图。
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

                    textureData.renderTexture._bitmapData = bitmapData;

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
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        public dispose(): void {
            console.warn("已废弃，请参考 @see");
            this.returnToPool();
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EgretTextureAtlasData#renderTexture
         */
        public get texture() {
            console.warn("已废弃，请参考 @see");
            return this.renderTexture;
        }
    }
    /**
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