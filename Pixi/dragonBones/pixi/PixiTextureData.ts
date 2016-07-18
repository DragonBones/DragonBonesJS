namespace dragonBones {
    /**
     * @language zh_CN
     * Pixi 贴图集数据。
     * @version DragonBones 3.0
     */
    export class PixiTextureAtlasData extends TextureAtlasData {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.PixiTextureAtlasData]";
        }
        /**
         * @language zh_CN
         * Pixi 贴图。
         * @version DragonBones 3.0
         */
        public texture: PIXI.BaseTexture;
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        }
        /**
         * @private
         */
        public generateTextureData(): TextureData {
            return BaseObject.borrowObject(PixiTextureData);
        }
    }
    /**
     * @private
     */
    export class PixiTextureData extends TextureData {
        public static toString(): string {
            return "[Class dragonBones.PixiTextureData]";
        }

        public texture: PIXI.Texture;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            if (this.texture) {
                this.texture.destroy(false);
                this.texture = null;
            }
        }
    }
}