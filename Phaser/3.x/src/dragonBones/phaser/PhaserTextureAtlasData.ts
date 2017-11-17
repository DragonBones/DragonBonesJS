namespace dragonBones {
    /**
     * - The Phaser texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Phaser 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class PhaserTextureAtlasData extends TextureAtlasData {
        public static toString(): string {
            return "[class dragonBones.PhaserTextureAtlasData]";
        }

        private _renderTexture: Phaser.Texture | null = null; // Initial value.
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            if (this._renderTexture !== null) {
                // this._renderTexture.dispose();
            }

            this._renderTexture = null;
        }
        /**
         * @inheritDoc
         */
        public createTexture(): TextureData {
            return BaseObject.borrowObject(PhaserTextureData);
        }
        /**
         * - The Phaser texture.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - Phaser 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get renderTexture(): Phaser.Texture | null {
            return this._renderTexture;
        }
        public set renderTexture(value: Phaser.Texture | null) {
            if (this._renderTexture === value) {
                return;
            }

            this._renderTexture = value;

            if (this._renderTexture !== null) {
                let index = 0;
                for (let k in this.textures) {
                    const textureData = this.textures[k] as PhaserTextureData;
                    textureData.textureFrame = this._renderTexture.add(
                        k, index++,
                        textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height
                    );
                    textureData.textureFrame.rotated = textureData.rotated;
                }
            }
            else {
                for (let k in this.textures) {
                    const textureData = this.textures[k] as PhaserTextureData;
                    textureData.textureFrame = null;
                }
            }
        }
    }
    /**
     * @internal
     * @private
     */
    export class PhaserTextureData extends TextureData {
        public static toString(): string {
            return "[class dragonBones.PhaserTextureData]";
        }

        public textureFrame: Phaser.Frame | null = null; // Initial value.

        protected _onClear(): void {
            super._onClear();

            if (this.textureFrame !== null) {
                this.textureFrame.destroy();
            }

            this.textureFrame = null;
        }
    }
}